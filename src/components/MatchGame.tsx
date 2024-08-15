/// This component should handle the logic for the match of the countries and capitals from data, also state management on clicks 
import React, {useState, useEffect} from "react";
import data from '../../data.json'

interface MatchGameProps {
    data:Record<string, string>
}

const MatchGame: React.FC<MatchGameProps> = ({ data }) => {
    
    return (
        <div> Main component MatchGame </div>
    );
  };
  
  export default MatchGame;