import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserLogin from './components/userLogin';
import ChatScreen from './components/ChatScreen';

class App extends Component {
  constructor() {
    super()
    this.state = {
      currentUsername: '',
      currentScreen: 'InitialScreen'
    }
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
  }

  onUsernameSubmitted(username) {
    fetch('http://localhost:3001/users', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })
      .then(response => {
        this.setState({
        currentUsername: username,
        currentScreen: 'ChatScreen'
        })
        localStorage.setItem('username', this.state.currentUsername);
      })
      .catch(error => console.error('error', error))
  }

  render() {
	if (this.props.currentUsername && !localStorage.getItem('username')) {
      localStorage.setItem('username', this.props.currentUsername);
    }
    const userLogged = localStorage.getItem('username');
    return (
      <div>{
        !userLogged ? <UserLogin onSubmit={this.onUsernameSubmitted} /> : <ChatScreen currentUsername={userLogged} />
      }</div>
    )    
  }
}
const mapStateToProps = (state) => ({
  currentUsername: state.currentUsername
});
export default connect(mapStateToProps)(App);
