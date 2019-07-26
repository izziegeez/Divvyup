import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import openSocket from 'socket.io-client'
import axios from 'axios';
import Warning from '../atoms/Warning';
import Settings from '../atoms/Settings';
import Contribute from '../forms/Contribute'
import EC2 from '../SERVER';
import noPhoto from '../img/no_photo2.png';

export default class Party extends Component {

    constructor(props)  {
        super(props);
        this.socket = openSocket(EC2);
        this.partyEndAlerted = false;
        this.redirectingAlerted = false;
        this.state = { 
            user: undefined,
            party: undefined,
            attendees: [], 
            payment: '-', 
            over: false ,
            loading: true,
            modalVisible: false
        };
    }

    componentDidMount = () => {
        try {
            axios.post(EC2 + '/info',  {
                userID: this.props.location.state.userID,
                partyID: this.props.location.state.partyID
            })
            .then(res => {
                const { user, party } = res.data;
                this.setupSocket(user, party);
                this.setState({ user, party, loading: false });
            })
            .catch(err => console.error('Error getting party info:', err));
        } catch(err) {
            console.error('Error getting user data:', err);
        }
    }

    compononentWillUnmount = () => this.socket.emit('disconnect');

    setupSocket = (user, party) => {
        const socket = this.socket;

        socket.on('membershipChanged', attendees => {
            console.log('Membership changed');
            let me = attendees.find(attendee => user.id === attendee.id);
            this.setState({ attendees, payment: me.payment });
        });

        socket.on('contributeRequest', (requester, contribution) => {
            if (window.confirm(requester.username + ' wants to contribute $' + contribution))  {
                socket.emit('contribute', requester, contribution);
            }
        });

        socket.on('partyEnded', () => {
            if (!this.partyEndAlerted)  {
                this.partyEndAlerted = true;
                alert('Party Was Ended');
            }
        });

        socket.on('disconnect', () => {
            if (!this.redirectingAlerted)  {
                this.redirectingAlerted = true;
                alert('Redirecting To Profile...');
            }
            this.props.history.push({
                pathname: '/profile/' + user.username,
                state: {userID: user.id}
            });
        });

        socket.emit('join', party, user, attendees => this.setState({ attendees }));
    }

    attendeeList = attendees => {
        let names = [],
            userID = this.state.user.id,
            ownerID = this.state.party.ownerID,
            iAmOwner = userID === ownerID,
            attendeeTitle, info, color;
        attendees.forEach(user => {
            color = (user.id === userID) ? 'red' : 'black';    //if this is me
            attendeeTitle = (user.id === ownerID) ? 'Host: ' : 'Guest: ';
            if (!iAmOwner) {
                info =  <li key={user.id} style={{color}}>{attendeeTitle}{user.username}</li>;
            }
            else {
                info =  <li key={user.id}>
                            <div style={{color}}>{attendeeTitle}{user.username}</div>
                            <div>Contributed: ${user.contribution}</div>
                            <div>Will Pay: ${user.payment}</div>
                        </li>;
            }
            names.push(info);
        });
        return names;
    }

    render() {
        if (!this.props.location.state || !this.props.location.state.userID) 
            return <Redirect to={{ pathname: '/login' }} />;
        if (this.state.loading)
            return <div/>;

        let { user, party, attendees, payment } = this.state,
            guests = (attendees.length > 0) ? attendees.length - 1 : 0,
            attendeesList = this.attendeeList(attendees),
            iAmOwner = (party.ownerID === user.id);
        return (
            <div id='party-box' className='container appear'>
                <Settings options={{ 'Profile': { event: () => this.props.history.goBack() } }} />
                <div id='party-content-left'>
                    <div className='content-box'>
                        <Contribute socket={this.socket} user={user} />
                        <ul id='attendees-list' style={{padding: 20}}>{attendeesList}</ul>
                    </div>
                    <div className='buttons-hor' style={{justifySelf: 'flex-end', display: iAmOwner && !this.state.over ? 'flex' : 'none'}}>
                        <Warning name='End Party'
                            action={() => this.socket.emit('endParty', parseFloat(payment)) && this.setState({ over: true })} />
                        <Warning  name='Cancel Party'
                            action={() => this.socket.emit('cancelParty') && this.setState({ over: true })} />
                    </div>
                </div>
                <div id='party-content-right'>
                    <img src={noPhoto} style={{marginBottom: 20, height: 100, width: 100}} alt='profile' />
                    <div id='party-info'>
                        <div className='small-text' style={{color:'white'}}>Amount Due: ${payment}</div>
                        <div className='small-text'>Party Name: {this.props.match.params.name}</div>
                        <div className='small-text'>ID: {party.id}</div>
                        <div className='small-text'>Cost: ${party.cost}</div>
                        <div className='small-text'>Guests: {guests}</div>
                    </div>
                </div>
                <div id='open-responsive-party-modal' className='fas fa-grip-lines' onClick={() => this.setState({ modalVisible: true })} />
                <div className='modal' style={{transform: this.state.modalVisible ? 'scale(1)' : 'scale(0)'}}>
                    <div className='modal-icon' onClick={() => this.setState({ modalVisible: false })}>&times;</div>
                    <ul id='responsive-attendee-list'>{attendeesList}</ul>
                </div>
            </div>
        );
     }
}
