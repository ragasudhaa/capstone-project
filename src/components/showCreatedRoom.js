import React, { Component } from 'react'

class showCreatedRoom extends Component {

    handleClickEvent(event) {
        console.log('sjsj', event);
        this.props.onRoomChange(event.target.value);
    }
    render() {
        const styles = {
            container: {
                flex: 1,
                height:'40%',
                overflow: 'auto'
            },
            ul: {
                listStyle: 'none',
            },
            li: {
                marginTop: 13,
                marginBottom: 13,
                color: 'burlywood',
                cursor: 'pointer'
            }
        }
        return (
            <div
                style={{
                    ...this.props.style,
                    ...styles.container,
                }}
            >
                <ul style={styles.ul}>
                    {this.props.userRooms.map((team) => (
                        <li key={team.id} value={team.id} style={styles.li} onClick={this.handleClickEvent.bind(this)}>
                            {team.name}                            
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default showCreatedRoom