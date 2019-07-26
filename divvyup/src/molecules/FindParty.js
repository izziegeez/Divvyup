import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import FindForm from '../forms/FindForm';
import Settings from '../atoms/Settings';

export default class FindParty extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            redirect: false,
            party: undefined
        };
    }

    redirect = party => this.setState({ redirect: true, party });

    render() {
        if (!this.props.location.state || !this.props.location.state.userID) 
            return <Redirect to={{ pathname: '/login', state: { lastPage: '/join' } }} />;
        const { userID } = this.props.location.state;
        if (this.state.redirect) {
            const { name, id } = this.state.party;
            return <Redirect to={{ pathname: '/party/' + name, 
                                    state: { userID, partyID: id } }} />;
        }
        return (
            <div className='container'>
                <Settings options={{ 'Profile': { event: () => this.props.history.goBack() } }} />
                <FindForm redirect={this.redirect} />
            </div>
        )
     }
}
