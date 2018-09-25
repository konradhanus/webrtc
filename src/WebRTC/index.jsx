import React, { Component } from 'react';
import Peer from 'simple-peer';

class WebRTC extends Component {

    constructor() {
        super();
        this.state = {
            mySdpId: null,
            otherSdpId: null,
            peer: new Peer({
                initiator: false,
                trickle: false
            })
        }
    }

    componentDidMount() {
        this.onConnect();
        this.onReciveMessage();
    }

    onConnect() {
        this.state.peer.on('signal', (data) => {
            console.log(data);
            this.setState({ mySdpId: data })
            console.log('polaczono');
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
        console.log(mySDP);
        return (
            <div className="App">
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
            </div>
        );
    }
}

export default WebRTC;
