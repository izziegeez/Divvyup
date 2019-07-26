import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Button from '../atoms/Button';
import noPhoto from '../img/no_photo2.png';
import EC2 from '../SERVER';

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            showPrevParties: false, 
            showContent: false,
            loading: true,
            user: undefined
        };
    }

    componentDidMount = async () => {
        try {
            await axios.post(EC2 + '/info', { userID: this.props.location.state.userID })
                        .then(res => this.setState({ user: res.data.user, loading: false }))
                        .catch(err => console.error('Error getting user data:', err));
        } catch(err) {
            console.error('Error getting user data:', err);
        }
    }

    render() {
        if (!this.props.location.state || !this.props.location.state.userID) 
            return <Redirect to={{ pathname: '/login', state: { lastPage: '/profile/' } }} />;
        if (this.state.loading)
            return <div/>
        const { username, accountBalance, previousParties, activeParties } = this.state.user;
        return (
            <div className='profile appear'>
                <img src={noPhoto} alt='profile' id='profile-pic' />
                <div id='profile-info'>
                    <div id='profile-username'>{username}</div>
                    <div id='profile-balance'>Balance: ${accountBalance}</div>
                    <div className='button-group'>
                        <Button pathname='/host' user={this.state.user} text='Host a Party' />
                        <Button pathname='/join' user={this.state.user} text='Join a Party' />
                        <Button pathname={'/profile/'+username+'/active-parties'} params={{ items: activeParties }} user={this.state.user} text='Active Parties'/>
                        <Button pathname={'/profile/'+username+'/previous-parties'} params={{ items: previousParties }} user={this.state.user} text='Previous Parties'/>
                        <Button pathname='/login' text='Logout' style={{backgroundColor: 'white', color: '#337ab7', borderColor: 'gray'}}/>
                    </div>
                </div>
            </div>
        )
    }
}
