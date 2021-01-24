import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import driveClient from './utils/driveClient';

async function init() {
  await driveClient.update();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

init();