import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { injectGlobal } from 'react-emotion';

import './assets/fonts/whitney/whitney.css';
import * as Style from './Style';

injectGlobal({
  '& body': {
    margin: 0,
    padding: 0,
    backgroundColor: 'black',
    color: Style.foreground,
    fontFamily: Style.font,
    lineHeight: 1.2,
    textAlign: 'center',
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
