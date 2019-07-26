import React, { Component } from 'react';
import PropTypes from 'prop-types';
/* Not in this directory */
import EC2 from '../SERVER';

export default class NetworkError extends Component {

    render() {
        let tip;
        const err = this.props.err;
        if (!err || err.request) tip = <p className='error'>Reason: Server is down</p>;
        else if (err.response) tip = <p className='error'>Reason: Bad request</p>;
        else tip = <p className='error'>Reason: Could not connect. Check your connection, reload the page, and try again</p>;
        return (
            <div className='container-error'>
                <p className='error'>Network Error: {this.props.error}</p>
                <p className='error'>Attempt to connect to {EC2} failed</p>
                {tip}
            </div>
        );
    }
}

NetworkError.propTypes = {
    err: PropTypes.object.isRequired
}