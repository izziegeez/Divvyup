/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  Modules  ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

require('dotenv').config();
require('colors');
require('path');
const port = 8080;
const MongoQueries = require('./MongoQueries.js');
const MongoSchemas = require('./MongoSchemas.js');
const User = MongoSchemas.User;
const Party = MongoSchemas.Party;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const SocketIO = require('./SocketIO.js');
app.use(cors({origin: true}));
app.use(express.static(__dirname,+'/party'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////  DB Connection  ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const db = mongoose.connection;

db.once('open', () => {    // bind a function to perform when the database has been opened
  console.log('Connected to DB!'.green);
});
process.on('SIGINT', () => {   //CTR-C to close
   mongoose.connection.close(() => {
       console.log('\nDB connection closed by Node process ending'.cyan);
       process.exit(0);
   });
});
const url = process.env.DB_HOST;

mongoose.connect(url, {useNewUrlParser: true, w: 1});

db.on('error', console.error);

/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////  Socket.io  //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

var parties = new Map();    //map keeps track of users currently in the party
const setupPartiesMap = async () => {
    let allParties = await Party.find({});
    allParties.forEach(partyDoc => {
        parties.set(partyDoc.id, partyDoc.users)
    });
}
setupPartiesMap();

io.sockets.on('connection', async socket => {
    socket.on('join', async (party, user, callback) => {
        console.log('- Socket Connected! Party:', party.name, 'User:', user.username);
        
        socket.join(party.id);
        socket.user = user;
        socket.party = {
            id: party.id,
            cost: party.cost,
            name: party.name,
            timestamp: party.timestamp,
            ownerID: party.ownerID
        };
        
        if (!parties.get(party.id)) { //make a new party item in the map if needed
            console.log('Adding party to map...'.yellow);
            parties.set(party.id, []);
        }

        let userIsGuest = parties.get(party.id).find(guest => guest.id === user.id);
        if (!userIsGuest)  {  //add a new guest
            console.log('Adding new active guest to party:'.yellow, user.username);
            parties.get(party.id).push({
                id: user.id,
                username: user.username,
                contribution: 0,
                payment: SocketIO.determinePrice(party.cost, parties.get(party.id).length + 1, 0), //length is one less bc not pushed yet
                active: true,
                sessionID: socket.id
            });
            let partyInfo = { name: party.name, id: party.id, timestamp: party.timestamp };
            await User.updateOne({ id: user.id }, { $push: { activeParties: partyInfo } })
                        .catch(err => console.error('Error updating user active parties', err));
        } else {    // update sessionID and active status
            parties.get(party.id).forEach(guest => {    // agh there's gotta be smth better than forEach for this
                if (guest.id === user.id) {
                    guest.sessionID = socket.id;
                    guest.active = true;
                }
            });
        }
        parties.get(party.id).forEach(guest => guest.payment = SocketIO.determinePrice(party.cost, parties.get(party.id).length, guest.contribution));
        // every payment has to be updated as there's a new user
        
        Party.updateOne({ id: party.id }, { users: parties.get(party.id) }) //update party data on users accordingly
                .then(() => {
                    console.log('Updated users!'.green);
                    callback(party.users);
                    io.sockets.in(party.id).emit('membershipChanged', parties.get(party.id));   //notify guests
                })
                .catch(err => console.error('Error updating Party data on guest joining:'.red, err));
    });
    
    // Guest emits this from frontend, host receives contributeRequest on their socket
    socket.on('getConfirmation', (requester, contribution) => { // requester = {name, id}
        console.log('- Contribution confirmation request received'.yellow);

        let party = parties.get(socket.party.id),
            host = party.find(guest => guest.id === socket.party.ownerID);
        io.to(host.sessionID).emit('contributeRequest', requester, contribution);
    });
    
    // Host frontend emits this to server
    socket.on('contribute', (requester, addedContribution) => {
        console.log('- Contribution received from guest'.yellow);

        const party = socket.party,
            guests = parties.get(party.id),
            requesterCurr = guests.find(guest => guest.id === requester.id),
            newContribution = parseFloat(addedContribution) + parseFloat(requesterCurr.contribution);
            requesterUpdated = {    // interesting ES6-ish stuff and overriding object attributes
                ...requesterCurr,
                contribution: newContribution,
                payment: SocketIO.determinePrice(party.cost, guests.length, newContribution)
            };
        parties.get(party.id)[guests.indexOf(requesterCurr)] = requesterUpdated;
        parties.get(party.id).forEach(guest => (guest.id === party.ownerID) && (guest.payment = guest.payment - addedContribution))

        Party.updateOne({ id: party.id }, { $set: { users: parties.get(party.id) } })
                .then(() => {
                    io.sockets.in(party.id).emit('membershipChanged', parties.get(party.id));
                    console.log('Updated costs!'.green);
                })
                .catch(err => console.error('Error updating User document after contribution:'.red, err));
    });
    
    // Host frontend emits this to server
    socket.on('endParty', async payment => {
        let { id } = socket.party,
            options = {
                guests: parties.get(socket.party.id),
                party: socket.party,
                payment, 
                cancelled: false 
            };
        await SocketIO.archiveParty(options)
            .then(() => io.sockets.in(id).emit('partyEnded') && io.sockets.in(id).emit('disconnect'));
    });
    
    // Host frontend emits this to server
    socket.on('cancelParty', async () => {
        let { id } = socket.party,
            options = {
                guests: parties.get(socket.party.id),
                party: socket.party,
                payment: 0, 
                cancelled: true 
            };
        await SocketIO.archiveParty(options)
            .then(() => io.sockets.in(id).emit('partyEnded') && io.sockets.in(id).emit('disconnect'));
    });
    
    socket.on('error', () => {});
    
});

/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////  HTTP Requests  ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

app.post('/register', async (req, res) => {
    console.log('- Registration request received:', req.method.cyan, req.url.underline);
    const { username, password } = req.body,
          result = await MongoQueries.registerUser(username, password);
    res.status(200).send(result);   //userID and username
});

app.post('/login', async (req, res) => { 
    console.log('- Login request received:', req.method.cyan, req.url.underline);
    const { username, password } = req.body,
          result = await MongoQueries.authenticateUser(username, password);
    res.status(200).send(result);   //userID and username
});

app.delete('/clear/database', async (req, res) => {
    console.log('- Deletion request received:', req.method.cyan, req.url.underline);
    await MongoSchemas.deleteData();
    parties = new Map();
    console.log('Removed All Data!'.yellow);
    res.status(200).end();
});

app.post('/host', async (req, res) => {
    console.log('- Host request received:', req.method.cyan, req.url.underline);
    const { name, cost, ownerID } = req.body,
          party = await MongoSchemas.createParty(name, cost, ownerID);
    res.status(201).send({ party });
});

app.post('/join', async (req, res) => {
    console.log('- Join request received:', req.method.cyan, req.url.underline);
    const party = await MongoQueries.getParty(req.body.id);
    party && !party.archived ? res.status(200).send({ party })
                             : res.status(204).send({ party: null });
});

app.post('/info', async (req, res) => {
    console.log('- Info request received:', req.method.cyan, req.url.underline);
    const { userID, partyID } = req.body,
          user = await MongoQueries.getUser(userID),
          party = await MongoQueries.getParty(partyID);
    res.status(200).send({ user, party });
});

app.get('*', (req, res) => {   //bad url
    console.log('- Bad request received:'.red, req.method.cyan, req.url.underline);
    console.log('Error'.red);
    res.status(404).send('<h1>Error 404: Page Does Not Exist</h1>');
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////  Start Server  ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

server.listen(port, () => {
    console.log('Server listening on', String(port).yellow)
});

module.exports = {
    io
}