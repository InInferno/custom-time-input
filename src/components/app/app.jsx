import React, { useState } from 'react';
import TimeInput from '../TimeInput/TimeInput';
import './app.css';

const App = () => {

  const date = new Date(2021, 0, 1, 13, 13, 0);
  const [time, setTime] = useState(date);

  return (
    <div className="App">
        <h1>Custom Time Input</h1>
        <TimeInput 
          value={time} 
          onChange={setTime}
        />
        <p>{time.toString()}</p>
    </div>
  );
}

export default App;
