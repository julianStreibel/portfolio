import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Portfolio from './Portfolio';
import Login from './Login';
import Cookies from 'js-cookie';
import axios from 'axios';
const config = require('./config/config.json')["development"];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: Cookies.get('connect.sid')
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(name) {
        this.setState({ loggedIn: true, name });
    }

    logout() {
        this.setState({ loggedIn: false, name: "" });
        axios.get(`${config.API_URL}/accounts/logout`);
        Cookies.remove('connect.sid');
    }

    render() {
        const { loggedIn, name } = this.state;
        return (
            <Router>
                <Route path="/" exact component={() => <Login login={this.login} />} />
                {loggedIn &&
                    <Route path="/portfolio" exact component={() => <Portfolio name={name} logout={this.logout} />} />
                }
            </Router>
        )
    }
}

export default App;