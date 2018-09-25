import React, { Component } from 'react';
import Peer from 'simple-peer';

class WebRTC extends Component {

    constructor(){
        super();
        this.state = {
            mySDP: {},
            counter: 1
        }
    }

    componentDidUpdate(){
        console.log(this.state);

    }
    
    onConnect(){
        const peer = new Peer({
            initiator: true, 
            trickle: false
        });

        peer.on('signal', (data) => {
            console.log('jest');
            
            this.setState({mySDP: data});
        });
        let counter= this.state.counter + 1;
        this.setState({counter: counter});
    }

  render() {
      
    const mySDP = JSON.stringify(this.state.mySDP);
    console.log(mySDP);
    return (
      <div className="App">
        <label>Your ID:</label>
        <input id="yourId" value={mySDP} />
        <br />
        <label>Other ID:</label>
        <textarea id="otherId">{this.state.something}</textarea><br />
        <button id="connect" onClick={()=>this.onConnect()}>Connect</button>
      </div>
    );
  }
}

export default WebRTC;
