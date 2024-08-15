import React from 'react';
import MatchGame from './components/MatchGame';
import data from '../data.json'
import logo from './logo.svg';
import './App.css';


const App: React.FC = () => {
  return (
   <div className='App'>
    <MatchGame data={data} />
   </div>
  );
}

export default App;
