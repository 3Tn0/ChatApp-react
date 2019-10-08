import React from 'react'
import ReactDOM from 'react-dom'

import Message from './Message'

class MessageList extends React.Component {

    //UNSAFE
    // componentWillUpdate() {
    //     const node = ReactDOM.findDOMNode(this)
    //     this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
    // }

    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this)
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 300 >= node.scrollHeight

        if (this.shouldScrollToBottom) {
            node.scrollTop = node.scrollHeight
        }
    }

    render() {

        if (this.props.disabled) {
            return (
                <div className="message-list">
                    <div className="join-room">
                        &larr; Join a room!
                    </div>
                </div>
            )
        }

        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <Message username={message.senderId} text={message.parts[0].payload.content} key={index} />
                    )
                })}
            </div>
        )
    }
}

export default MessageList