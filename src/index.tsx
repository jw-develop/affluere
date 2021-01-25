import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import driveClient from './utils/driveClient';

async function init() {
  const promise = driveClient.update();
  const answer = prompt("Enter PIN");
  if (answer !== "119") {
    alert("Unauthorized!");
    return;
  }

  await promise;
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

init();