import React, {Component} from 'react';
import { Link } from "react-router-dom";

export default class Button extends Component {

    render() {
        const { pathname, user, style, onClick, text, params } = this.props;
        const userID = user ? user.id : '';
        const username = user ? user.username : '';
        const state = Object.assign({ userID, username }, params);
        return (
            <Link to={{ pathname, state }}><button className='appear' style={style} onClick={onClick}>{text}</button></Link>
        )
     }
}