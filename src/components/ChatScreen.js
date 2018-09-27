import React, { Component } from 'react';
import Chatkit from '@pusher/chatkit';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';
import ShowCreatedRoom from './showCreatedRoom';
import Button from '@material-ui/core/Button';
import OnlineUserList from './OnlineUserList';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
    global: {
        fontFamily: 'Arial',
        fontSize: '14px'
    },
    chatContainer: {
        padding: 20,
        marginTop: 30
    },
    
    logOut: {
        textAlign: 'right',
        color:'#fff',
        width:"80%",
        textDecoration: 'none'
    },    
    button : {
        background: '#2196f3',
        color: '#fff'
    },
    createRoom : {
        backgroundColor: '#ffffff',                
        borderRight: '1px solid #4d394b',        
        marginTop: 30,
        marginLeft: 10
    },
    whosOnlineListContainer: {        
        marginTop: 30,
        marginLeft: 10,
        flex: 'none',
        padding: 20,
        backgroundColor: '#fff',
        color: 'white',
        h2Title: {
            marginBottom: '10px',
            color: '#000'
        },
        textField: {
            marginBottom: '10px'
        }
    }
  };

class ChatScreen extends Component {
    constructor (props) {
        super();

        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],            
            roomname: '',
            roomprivacy: false,
            currentUserRooms: {}
        }

        this.sendMessage = this.sendMessage.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.slackChatManager = '';
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
    }
    createRoom(e) {        
            this.state.currentUser
                .createRoom({
                name: this.state.roomname,
                private: this.state.roomprivacy,
                addUserIds: []
            }).then(room => {
                this.setState({ roomname: '' })
                let newList = this.state.currentUserRooms;
                newList.push(room);
                this.setState({ currentUserRooms: newList });
            })
            .catch(err => {
                console.log(`Error creating room ${err}`)
            })
        
    }
    handleChange(e) {
        this.setState({ roomname: e.target.value })
    }
    
    onRoomChange(id) {
        const newRoom = this.state.currentUserRooms.filter(function (el) { return el.id === id; });
        this.setState({currentRoomId : id });
        this.setState({currentRoom : newRoom[0] });       
        this.chatManagerUpdateRoomMessages(id);
    }
    chatManger() {
        this.slackChatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:ee43a19a-add3-4346-a2c8-dddb6d27ee22',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'http://localhost:3001/authenticate'
            })
        })
    }
    chatManagerUpdateRoomMessages(roomId) {
        this.chatManger();
        this.slackChatManager
        .connect()
        .then(currentUser => {
            this.setState({ currentUser })
            this.setState({ currentUserRooms: currentUser.rooms })
            return currentUser.fetchMessages({
                roomId: roomId,
            }).then(messages => {
                this.setState({
                    messages: messages,
                });
              })
              .catch(err => {
                console.log(`Error fetching messages: ${err}`)
              })
        })
        .catch(error => console.error('error', error))
    }
    logoutHandler() {
        localStorage.removeItem('username');
    }  
    componentDidMount () {
        this.chatManger();
        this.slackChatManager
        .connect()
        .then(currentUser => {
          this.setState({ currentUser })
          this.setState({ currentUserRooms: currentUser.rooms })          
          return currentUser.subscribeToRoom({
            roomId: 15523680,
            messageLimit: 100,
            hooks: {
              onNewMessage: message => {
                this.setState({
                  messages: [...this.state.messages, message],
                })
              },
              onUserCameOnline: () => this.forceUpdate(),
              onUserWentOffline: () => this.forceUpdate(),
              onUserJoined: () => this.forceUpdate()
            }
          })
        })
        .then(currentRoom => {
          this.setState({ currentRoom })
        })
        .catch(error => console.error('error', error))
    }

    render() {        
        
        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar>                           
                        <Typography variant="title" color="inherit">
                            Capstone Chat App
                        </Typography>
                        <a href='' style={styles.logOut} onClick={this.logoutHandler.bind(this)}>Logout</a>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={4}>
		    	    <Paper style={styles.whosOnlineListContainer}>
                            <FormControl>
                                <Input placeholder="Create Room"   
                                value={this.state.roomname}                                
                                onChange={this.handleChange} />
                            </FormControl>
                            <FormControlLabel control={
                                <Checkbox icon={<LockOpen />} checkedIcon={<Lock />}  onChange={this.handlePrivacyChange} value="checkedH" />}
                            />
                            <Button style={this.buttonStyle} onClick={this.createRoom} variant="outlined" color="primary">
                                Create
                            </Button>
                        </Paper>
                        <Paper  style={styles.whosOnlineListContainer}>
                        { this.state.currentUserRooms.length > 0 ? 
                                <h4 style={styles.whosOnlineListContainer.h2Title}>Team List</h4> : '' }
                        { this.state.currentUserRooms.length > 0 ? 
                            <ShowCreatedRoom userRooms={this.state.currentUserRooms} onRoomChange={this.onRoomChange.bind(this)} />
                            : ''}
                        </Paper>
                        <Paper style={styles.whosOnlineListContainer}>
                            <OnlineUserList
                                currentUser={this.state.currentUser}
                                users={this.state.currentRoom.users}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={8} style={styles.chatListContainer}>
                        <Paper style={styles.chatContainer}> 
                            <MessageList
                                messages={this.state.messages}
                                style={styles.chatList}
                            />
                            <SendMessageForm 
                                onSubmit={this.sendMessage}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default ChatScreen;