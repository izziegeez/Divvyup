import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Settings from '../atoms/Settings';
import Algos from '../functional/Sorting'
import EC2 from '../SERVER';

export default class PartiesList extends Component {

    constructor(props)  {
        super(props);
        this.state = {
            organizeOldestFirst: true,
            party: undefined,
            redirect: false,
            openMoreInfo: false,
            partyInfo: undefined
        };
    }

    redirectToParty = id => {
        axios.post(EC2 + '/join', { id })
            .then(res => this.setState({ party: res.data.party, redirect: true }))
            .catch(err => console.error('Error getting parties:', err));
    }

    organizeItems = items => {
        const order = this.state.organizeOldestFirst ? 'oldest' : 'newest';
        items = Algos.mergeSort(items, order);

        let components = [];
        if (items.length === 0) {
            components.push(<div key='none' className='parties-list-item'>No parties yet...</div>);
        } else {
            let text, onClick;
            items.forEach(item => {
                const { name, cost, id } = item;
                text = name + ((cost === undefined) ? '' : ': $' + cost);
                onClick = (cost === undefined) ? () => this.redirectToParty(id) : () => this.setState({ openMoreInfo: true, partyInfo: item });
                components.push(<div className='parties-list-item' key={id} onClick={onClick}>{text}</div>);
            });
        }

        return components;
    }

    renderMorePartyInfo = partyInfo => {
        let moreInfo = [],
            date = new Date(partyInfo.timestamp),
            captialized;
        delete partyInfo._id;
        partyInfo.cancelled = partyInfo.cancelled ? 'Yes' : 'No';
        partyInfo.timestamp = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        
        Object.keys(partyInfo).forEach(key => {
            captialized = key[0].toUpperCase() + key.slice(1);
            if (key === 'id') captialized = 'ID';
            moreInfo.push(<li key={key}>{captialized + ':  ' + partyInfo[key]}</li>);
        });

        return moreInfo;
    }

    render() {
        const { userID } = this.props.location.state;
        if (this.state.redirect) {
            const { name, id } = this.state.party;
            return <Redirect to={{ pathname: '/party/' + name, 
                                    state: { userID, partyID: id } }} />;
        }

        const options = {
            'Sort By': {
                suboptions: [
                    'Date (Oldest First)', 
                    'Date (Newest First)'
                ],
                events: [
                    () => this.setState({ organizeOldestFirst: true }),
                    () => this.setState({ organizeOldestFirst: false }),
                ]
            },
            'Profile': {
                event: () => this.props.history.goBack()
            },
            'Click on an active party to go to it': {

            },
            'Click on an old party to see more info': {

            },
        }
        const items = this.props.location.state.items,
              itemsOrganized = items ? this.organizeItems(items) : null;

        let moreInfo = [];
        if (this.state.openMoreInfo) moreInfo = this.renderMorePartyInfo({...this.state.partyInfo});
        
        return (
            <div id='display' className='box-display'>
                <Settings options={options} />
                {itemsOrganized}
                <div className='modal' style={{flexFlow: 'column', transform: this.state.openMoreInfo ? 'scale(1)' : 'scale(0)'}}>
                    <div className='modal-icon' onClick={() => this.setState({ openMoreInfo: false })}>&times;</div>
                    <ul>{moreInfo}</ul>
                </div>
            </div>
        )
     }
}
