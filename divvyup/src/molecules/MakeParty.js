import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import CreateForm from '../forms/CreateForm';
import Settings from '../atoms/Settings';

export default class MakeParty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            party: undefined
        }
    }

    handleResponse = res => this.setState({ redirect: true, party: res.data.party });

    render() {
        if (!this.props.location.state || !this.props.location.state.userID) 
            return <Redirect to={{ pathname: '/login', state: { lastPage: '/host' } }} />;
        const { userID } = this.props.location.state;
        if (this.state.redirect) {
            const { name, id } = this.state.party;
            return <Redirect to={{ pathname: '/party/' + name, 
                                    state: { userID, partyID: id } }} />;
        }
        return (
            <div className='container'>
                <Settings options={{ 'Profile': { event: () => this.props.history.goBack() } }} />
                <CreateForm userID={userID} handleResponse={this.handleResponse} />
            </div>
        )
    }
}