import React, { Component } from 'react';

export default class Warning extends Component {

    constructor() {
        super();
        this.state = {
            warning: false
        };
    }

    render() {
        return (
            <div className='flex-centered-col'>
                <button onClick={() => this.setState({ warning: true })}>{this.props.name}</button>
                <div className='modal' style={{flexFlow: 'column', transform: this.state.warning ? 'scale(1)' : 'scale(0)'}}>
                    <div className='modal-icon' onClick={() => this.setState({ warning: false })}>&times;</div>
                    <div className='text-warning'>Are You Sure?</div>
                    <div className='flex-centered' style={{marginTop: 20}}>
                        <button style={{marginRight: 10}} onClick={this.props.action}>Yes</button>
                        <button style={{marginLeft: 10}} onClick={() => this.setState({ warning: false })}>No</button>
                    </div>
                </div>
            </div>
        )
     }
}