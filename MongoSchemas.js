/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  Modules ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("colors");

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////  Schema Declarations //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const partySchema = new mongoose.Schema({
  name: String,
  id: String,
  archived: Boolean,
  cost: Number,
  maxPrice: Number,
  ownerID: String,
  predictedGuests: Number,
  timestamp: String,
  users: [
    {
      id: String,
      username: String,
      contribution: Number,
      payment: Number,
      active: Boolean,
      owner: Boolean,
      sessionID: String
    }
  ]
});
const Party = mongoose.model("Party", partySchema);

const userSchema = new mongoose.Schema({
  username: String,
  id: String,
  password: { type: String, select: false },
  accountBalance: Number,
  activeParties: [
    {
      name: String,
      id: String,
      timestamp: String
    }
  ],
  previousParties: [
    {
      name: String,
      cost: Number,
      id: String,
      timestamp: String,
      cancelled: Boolean
    }
  ]
});
const User = mongoose.model("User", userSchema);

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////  Document Creation Functions //////////////////////////
/////////////////////////////////////////////////////////////////////////////////

const generateRandIdentifier = () => {
  // 37657312 different combinations
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";
  for (let i = 0; i < 6; i++)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};

const createParty = async (name, cost, ownerID) => {
  let allParties = await Party.find({ archived: false }),
    allPartyIDs = allParties.reduce((acc, curr) => acc.concat(curr.id), []), // reduce is funky yike
    id = generateRandIdentifier(),
    count = 0;
  while (allPartyIDs.find(partyID => partyID === id) && count < 37657312) {
    // while a match is found
    id = generateRandIdentifier();
    count++;
  }
  const newParty = new Party({
    name,
    id,
    cost,
    ownerID,
    archived: false,
    timestamp: Date(),
    users: []
  });
  await newParty
    .save()
    .then(console.log("Created a new party!".green))
    .catch(err => console.error("Error saving new Party document".red, err));
  return newParty;
};

const createUser = async (username, password) => {
  const newUser = new User({
    username,
    id: bcrypt.hashSync(generateRandIdentifier(), 10),
    password: bcrypt.hashSync(password, 10),
    accountBalance: 0,
    activeParties: [],
    previousParties: []
  });
  await newUser
    .save()
    .then(console.log("Created a new user!".green))
    .catch(err => console.error("Error saving new User document:".red, err));
  return newUser;
};

module.exports = {
  partySchema,

  userSchema,

  Party,

  User,

  createParty,

  createUser,

  generateRandIdentifier,

  deleteData: async () => {
    await User.deleteMany({})
      .then(console.log("Removed all User documents".yellow))
      .catch(err => console.error("Error removing User documents".red, err));
    await Party.deleteMany({})
      .then(console.log("Removed all Party documents".yellow))
      .catch(err => console.error("Error removing Party documents".red, err));
  }
};
