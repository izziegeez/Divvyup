import React, { Component } from 'react';

export default class Contribute extends Component {

    constructor(props)  {
        super(props);
        this.state = { 
            contribution: ''
        };
    }

    onSubmit = e => {
        e.preventDefault();
        if (this.state.contribution.length > 0)
            if (window.confirm('Are you sure you want to contribute $' + this.state.contribution + '?')) {
                const user = { username: this.props.user.username, id: this.props.user.id };
                this.props.socket.emit('getConfirmation', user, parseFloat(this.state.contribution));
            }
    }

    inputChange = event => {
        const cost = event.target.value,
              costCleared = cost.length === 0 && this.state.contribution.length !== 0,
              newestCharIsNumber = '0123456789'.indexOf(cost[cost.length - 1]) !== -1;
        if (costCleared) this.setState({ contribution: '' });
        else if (newestCharIsNumber) this.setState({ contribution: cost });
      }

    render() {
        return (
            <form name='contribution' id='contribution-form' onSubmit={this.onSubmit}>
                <input type='text' placeholder='Contribution Amount' maxLength='4' 
                    value={this.state.contribution} onChange={this.inputChange} />
                <input type='submit' className='contributeConfirm' value='Contribute!' />
            </form>
        )
     }
}
