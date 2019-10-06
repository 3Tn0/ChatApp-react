import React from 'react';
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config.js'

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: "Jazz",
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser
        this.getRooms()
      })
      .catch(error => {
        console.error("error:", error);
      })
  }

  getRooms = () => {
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
      .catch(err => console.log('error on joinableRooms: ', err))
  }

  subscribeToRoom = (roomId) => {
    this.setState({
      messages: []
    })
    this.currentUser.subscribeToRoomMultipart({
      roomId,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          })
        }
      },
    })
    .then(room => {
        this.setState({
          roomId: room.id
        })

        this.getRooms()
    })
  }

  sendMessage = text => {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    })
  }

  render() {
    return (
      <div className="app">
        <RoomList roomId={this.state.roomId} subscribeToRoom={this.subscribeToRoom} allRooms={[...this.state.joinedRooms, ...this.state.joinableRooms]} />
        <MessageList messages={this.state.messages} />
        <SendMessageForm sendMessage={this.sendMessage} />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
