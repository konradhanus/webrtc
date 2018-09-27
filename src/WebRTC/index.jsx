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
            peer: null,
            firebase: { users: firebase.database() },
            users: null,
            myFirebaseKey: null, 
            calling: false,
            caller: null
        }
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    onGetUsers() {
        this.state.firebase.users.ref('users').on('value', (snapshot) => {
            const newUsers = snapshot.val();
            console.log('something was changed');
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
        this.setState({ myFirebaseKey: newUserKey });
        this.onCalling(newUserKey);
        //users.push(user);
    }

    componentDidMount() {

        this.onGetUsers();
        this.onConnect();
    }

    onConnect() {

        const peer = new Peer({
            initiator: false,
            trickle: false
        });
        
        this.setState({ peer: peer });

        peer.on('signal', (data) => {
            this.setState({ mySdpId: data });
            alert('send data to another');
        });

        this.onReciveMessage(peer);
    }

    onConnectionRequest(userId, name) {
        const peer = new Peer({
            initiator: true,
            trickle: false
        });

        this.setState({ peer: peer });

        peer.on('signal', (data) => {
            this.setState({ mySdpId: data });
            const users = this.state.firebase.users.ref('users/' + userId);
            users.set({ name: name, connectionRequest: this.state.mySdpId, caller: this.state.myFirebaseKey });
        });

        this.onReciveMessage(peer);
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

        this.onReciveMessage(peer);
    }

    onCalling(myFirebaseKey) {

        console.log(myFirebaseKey);
        this.state.firebase.users.ref('/users/'+myFirebaseKey).on('value', (snapshot) => {
            const connectionRequest = snapshot.val().connectionRequest;
            const caller = snapshot.val().caller;
            if(connectionRequest)
            {
                console.log(caller+' calling...');
                this.setState({otherSdpId: connectionRequest, caller: caller, calling: true});
                this.state.peer.signal(connectionRequest);
            }
        })
    }

    onPickup(){
        console.log('pickup method');
        const callerUserId = this.state.caller;
        const users = this.state.firebase.users.ref('users/' + callerUserId);
        users.update({ connectionRequest: this.state.mySdpId, caller: this.state.myFirebaseKey }); 
    }

    onChangeOtherId(e) {
        alert('nowe dane');
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

    onReciveMessage(peer) {
        peer.on('data', function (data) {
            alert(data);
        });
    }

    render() {

        const mySDP = JSON.stringify(this.state.mySdpId);
        const otherSDP = JSON.stringify(this.state.otherSdpId);
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
                    {/*<label>Your ID:</label>
                    <input id="yourId" value={mySDP} />
                    {this.state.mySdpId ? null :
                        <button onClick={() => this.onInit()}>Init</button>
                    }
                    <br />
                    <label>Other ID:</label>
                    <input id="otherId" onChange={(e) => this.onChangeOtherId(e)} value={otherSDP} /><br />
                   { <button onClick={() => this.onConnect()}>Connect</button>  }*/}
                <input type="text" /><button onClick={() => this.onSendMessage()}> send message</button> 
                    {/* wylistować uzytkownikow */}
                    <ul>
                        {this.state.users ?
                            Object.keys(this.state.users).map((userId, key) =>
                                <li onClick={() =>
                                    this.onConnectionRequest(userId, this.state.users[userId].name)} key={key}>
                                    {this.state.myFirebaseKey === userId ? <b>{this.state.users[userId].name}</b> : this.state.users[userId].name}
                                </li>)
                            : null}
                    </ul>

                    { this.state.calling ? <div><button onClick={()=> this.onPickup()}>Pickup</button><button>Cancel</button></div> :  null }
                </div>);
        }

    }
}

export default WebRTC;
