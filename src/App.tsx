import React from 'react';
import MatchGame from './components/MatchGame';
import data from './data.json'
import './App.css';


const App: React.FC = () => {
  return (
   <div className='App'>
    <MatchGame data={data} />
   </div>
  );
}

export default App;
