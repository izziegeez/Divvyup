import React, { Component } from 'react';
import axios from 'axios';
import EC2 from '../SERVER';

export default class CreateForm extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name: '', 
            cost: '',
            waiting: false
        };
    }

    onSubmit = e => {
        e.preventDefault();
        this.setState({ waiting: true });
        axios.post(EC2 + '/host', {
            ownerID: this.props.userID,
            name: this.state.name,
            cost: this.state.cost
        })
        .then(res => this.props.handleResponse(res))
        .catch(err => console.error('Error submitting party creation form', err));
    }

    costChange = event => {
        const cost = event.target.value;
        if (cost.length === 0 && this.state.cost.length !== 0) this.setState({ cost: '' });
        else if ('0123456789'.indexOf(cost[cost.length - 1]) !== -1) this.setState({ cost: parseFloat(cost) });
    }

    render() {
        return (
            <form className='vert-form' onSubmit={this.onSubmit}>
                <input placeholder='Party Name' value={this.state.name} type='text' name='party name'
                        onChange={e => this.setState({ name: e.target.value })} maxLength='25' required />
                <input placeholder='Party Cost' value={this.state.cost} type='text' name='party name'
                        onChange={this.costChange} required maxLength='4' />
                <input name='create form submit' type='submit' value='Submit' 
                        style={{display: this.state.waiting ? 'none' : 'block'}} />
                <div className='fas fa-circle-notch fa-spin' style={{display: this.state.waiting ? 'block' : 'none'}} />
            </form>
        )
    }
}