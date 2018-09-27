import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';

class MessagesList extends Component {
    render() {
        const styles = {
            container: {
                overflowY: 'scroll',
                flex: 1,
            },
            ul: {
                listStyle: 'none',
            },
            li: {
                marginTop: 13,
                marginBottom: 13,
            },
            senderUsername: {
                fontWeight: 'bold',
            },
            message: { 
                fontSize: 15 
            },
            chatDetals: {
                padding: 20
            }
        }

        return (
            <div
                style={{
                    ...this.props.style,
                    ...styles.container,
                }}>
                <ul style={styles.ul}>
                    {this.props.messages.map((message, index) => (
                    <li key={index} style={styles.li}>
                        <Paper style={styles.chatDetals}>
                            <span style={styles.senderUsername}>{message.senderId}</span>{' '}
                            <p style={styles.message}>{message.text}</p>
                        </Paper>
                    </li>
                    ))}
                </ul> 
            </div>
        )
    }
}

export default MessagesList;