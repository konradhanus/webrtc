import React, { Component } from 'react';
import Peer from 'simple-peer';
import firebase from '../firebase';

class WebRTC extends Component {

    constructor() {
        super();
        this.state = {
            name: null,
            logged: false,
            mySdpId: null,
            otherSdpId: null,
            peer: new Peer({
                initiator: false,
                trickle: false
            }),
            firebase: { users: firebase.database() },
            users: null, 
            myFirebaseKey: null
        }
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    onGetUsers() {
        this.state.firebase.users.ref('users').on('value', (snapshot) => {
            const newUsers = snapshot.val();
            this.setState({ users: newUsers })
        })
    }

    onLogin() {

        this.setState({ logged: true });

        //add me to firebase
        const users = this.state.firebase.users.ref('users');

        console.log(users);
        const user = {
            name: this.state.name
        }


        // Get a key for a new Post.
        var newUserKey = users.push(user).key;
        this.setState({myFirebaseKey: newUserKey});
        //users.push(user);
    }

    componentDidMount() {

        this.onGetUsers();
        this.onConnect();
        this.onReciveMessage();
        this.onCalling();
    }

    onConnect() {
        this.state.peer.on('signal', (data) => {
            console.log(data);
            this.setState({ mySdpId: data })
            console.log('polaczono');
        });
    }

    onConnectionRequest(userId, name){ 
        const peer = new Peer({
            initiator: true,
            trickle: false
        });

        this.setState({ peer: peer });

        peer.on('signal', (data) => {
            this.setState({ mySdpId: data });
            const users =  this.state.firebase.users.ref('users/'+userId);
            users.set({name: name, connectionRequest: this.state.mySdpId});
        });
    }
    
    onInit() {
        const peer = new Peer({
            initiator: true,
            trickle: false
        });

        this.setState({ peer: peer });

        peer.on('signal', (data) => {
            this.setState({ mySdpId: data });
        });
    }

    onCalling(){
        this.state.firebase.users.ref('users/'+this.state.myFirebaseKey+'/connectionRequest').on('value', (snapshot) => {
            const connectionRequest = snapshot.val();
            alert(connectionRequest);
        })
    }

    onChangeOtherId(e) {
        try {
            const otherSdpId = JSON.parse(e.target.value);
            this.setState({ otherSdpId: otherSdpId });
            console.log(otherSdpId);
            this.state.peer.signal(otherSdpId);

        } catch (e) {
            console.log('to nie jest json')
        }
    }

    onSendMessage() {
        console.log('send message');
        this.state.peer.send('wiadomosc');
    }

    onReciveMessage() {
        this.state.peer.on('data', function (data) {
            alert(data);
        });
    }


    render() {

        const mySDP = JSON.stringify(this.state.mySdpId);
        console.log(this.state.users);
        if (!this.state.logged) {
            return (
                <div>
                    <input type="text" onChange={(e) => this.onChangeName(e)} />
                    <button onClick={() => this.onLogin()} >Login</button>
                </div>
            );
        } else {
            return (
                <div>
                    <label>Your ID:</label>
                    <input id="yourId" value={mySDP} />
                    {this.state.mySdpId ? null :
                        <button onClick={() => this.onInit()}>Init</button>
                    }
                    <br />
                    <label>Other ID:</label>
                    <textarea id="otherId" onChange={(e) => this.onChangeOtherId(e)}>{this.state.something}</textarea><br />
                    <button onClick={() => this.onConnect()}>Connect</button>
                    <input type="text" /><button onClick={() => this.onSendMessage()}> send message</button>
                    {/* wylistować urzytkownikow */}
                    <ul>
                        {this.state.users ? 
                            Object.keys(this.state.users).map((userId, key) => 
                            <li onClick={() => 
                                this.onConnectionRequest(userId, this.state.users[userId].name)} key={key}>
                                {this.state.myFirebaseKey === userId ? <b>{this.state.users[userId].name}</b>: this.state.users[userId].name}
                                </li>) 
                                : null}
                    </ul>
                </div>);
        }

    }
}

export default WebRTC;
