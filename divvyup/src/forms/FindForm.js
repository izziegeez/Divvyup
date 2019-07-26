import React, { Component } from 'react';
import axios from 'axios';
import EC2 from '../SERVER';

export default class FindForm extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            id: '',
            error: false, 
            party: undefined,
            waiting: false,
            modalVisible: false
        };
    }

    findParty = e => {
        e.preventDefault();
        this.setState({ waiting: true });
        axios.post(EC2 + '/join', { id: this.state.id })
            .then(res => {
                let newState = res.data.party ? { party: res.data.party, modalVisible: true }
                                              : { error: true, warning: false, waiting: false };
                this.setState(newState)
            })
            .catch(err => console.error('Error getting parties:', err));
    }

    guestList = guests => {
        let names = [];
        guests.forEach(guest => names.push(<li style={{color: 'white'}} key={guest.username}>{guest.username}</li>));
        return names;
    }

    render() {
        const party = this.state.party ? this.state.party : { name: '-', cost: '-', users: [] }
        return (
        <div className='flex-centered-col'>
            <form onSubmit={this.findParty} className='vert-form appear' style={{transform: this.state.modalVisible ? 'scale(0)' : 'scale(1)'}}>
                <input name='party id' type="text" placeholder='Party ID' maxLength='6' 
                    value={this.state.id} onChange={e => this.setState({ id: e.target.value })} required />
                {this.state.error && <div className='fancy-error'>Party Not Found</div>}
                <input name='search' type='submit' value='Search' 
                        style={{display: this.state.waiting ? 'none' : 'block'}} />
                <div className='fas fa-circle-notch fa-spin' style={{display: this.state.waiting ? 'block' : 'none'}} />
            </form>
            <div className='modal' style={{transform: this.state.modalVisible ? 'scale(1)' : 'scale(0)'}}>
                <div className='modal-icon' onClick={() => this.setState({ modalVisible: false })}>&times;</div>
                <div className='vert-form appear'>
                    <div className='confirmation'>Are you sure this is the party you want to join?</div>
                    <div className='confirmation'>Name: {party.name}</div>
                    <div className='confirmation'>Cost: ${party.cost}</div>
                    <div className='confirmation'>Guests: </div>
                    <ul className='guest-list-preview'>{this.guestList(party.users)}</ul>
                    <div className='flex-centered' style={{width: '100%'}}>
                        <button style={{margin: 10}} onClick={() => this.props.redirect(this.state.party)}>Yes</button>
                        <button style={{margin: 10}} onClick={() => this.setState({ modalVisible: false, waiting: false })}>No</button>
                    </div>
                </div>
            </div>
        </div>
        )
     }
}
