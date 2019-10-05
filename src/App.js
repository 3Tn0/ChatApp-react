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
      messages: []
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
        currentUser.subscribeToRoomMultipart({
          roomId: 'b02a5493-ed79-4974-a26f-a3aff273e117',
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message]
              })
            }
          },
        });
      })
      .catch(error => {
        console.error("error:", error);
      })

  }

  render() {

    
    return (
      <div className="app">
        <RoomList />
        <MessageList messages={this.state.messages}/>
        <SendMessageForm />
        <NewRoomForm />
      </div>
    );
  }
}

export default App;
