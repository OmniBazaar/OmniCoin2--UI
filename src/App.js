import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import Home from './scenes/Home/Home';

class App extends Component {
  render() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props} />}/>
                <Route path="/signup" render={(props) => <Signup {...props} />}/>
                <Route path="/login" render={(props) => <Login {...props} />}/>
            </Switch>
        </Router>
    )
  }
}

export default App;
