import * as React from 'react';
import registerServiceWorker from './registerServiceWorker';
import WebRTC from './WebRTC'
import * as ReactDOM from 'react-dom';

ReactDOM.render(<WebRTC />,document.getElementById('root'));
registerServiceWorker();
