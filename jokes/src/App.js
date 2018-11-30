import React, { Component } from 'react';
import axios from "axios";
import { NavLink, Switch, Route, withRouter } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";

import './App.css';

const url = process.env.REACT_APP_API_URL;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      jokes: []
    };
  }

  authenticate = () => {
    const token = localStorage.getItem("Merty");
    if (token) {
      const options = {
        headers: {
          Authorization: token
        }
      };
      axios.get(`${url}/api/jokes`, options)
        .then(res => {
          if (res.data) {
            this.setState({ loggedIn: true, jokes: res.data });
          } else {
            throw new Error();
          }
        })
        .catch(err => {
          this.props.history.push("/signin");
        });
    } else {
      this.props.history.push("/signin");
    }
  }

  componentDidMount() {
    this.authenticate();
  }

  // componentDidUpdate(prevProps) {
  //   const { pathname } = this.props.location;
  //   if (pathname === "/" && pathname !== prevProps.location.pathname) {
  //     this.authenticate();
  //   }
  // }

  render() {
    return (
      <div className="App">
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
          <NavLink to="/signin">Sign In</NavLink>
        </nav>
        <section>
          <Switch>
            <Route path="/signup" component={Register} />
            <Route path="/signin" render={props => <Login 
              {...props} 
              checkin={this.authenticate}
              loggedIn={this.state.loggedIn} />} />
          </Switch>
          {this.state.jokes.map(joke => (
            <div key={joke.id}>
              <p>{joke.setup}</p>
              <p>{joke.punchline}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }
}

export default withRouter(App);
