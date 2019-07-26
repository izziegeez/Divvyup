import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './molecules/Login';
import Register from './molecules/Register';
import Profile from './molecules/Profile';
import MakeParty from './molecules/MakeParty';
import FindParty from './molecules/FindParty';
import Party from './molecules/Party';
import PartiesList from './molecules/PartiesList';

class App extends React.Component {

  render() {
    return (
        <BrowserRouter>
        <div className='content'>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/host" component={MakeParty} />
                <Route exact path="/join" component={FindParty} />
                <Route exact path="/party/:name" component={Party} />
                <Route exact path="/profile/:username" component={Profile} />
                <Route exact path="/profile/:username/previous-parties" component={PartiesList} />
                <Route exact path="/profile/:username/active-parties" component={PartiesList} />
                <Route exact path="*" component={Login} />
            </Switch>
        </div>
        </BrowserRouter>
    );
  }
}

export default App;
