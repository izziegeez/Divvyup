import React, { Component } from 'react';

export default class SlideList extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            visible: false
        };
    }

    processContent = content => {
        let listItems = [];
        content.forEach(item => listItems.push(<li key={item} >{item}</li>));
        return listItems;
    }

    render() {
        return (
            <div className='slide-container'>
                <div className='list-button' onClick={() => this.setState({ visible: !this.state.visible })}>
                    {this.props.buttonText}
                    <i className={this.state.visible ? 'arrow up' : 'arrow down'} onClick={() => this.setState({ visible: !this.state.visible })}></i>
                </div>
                <ul className={this.state.visible ? 'list-contents' : 'list-contents-hidden'}>
                    {this.processContent(this.props.content)}
                </ul>
            </div>
        )
    }
}
