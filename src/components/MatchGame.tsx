/// This component should handle the logic for the match of the countries and capitals from data, also state management on clicks 
import React, {useState, useEffect} from "react";
import { Box, Grid, Typography } from '@mui/material';

import GameButton from "./GameButton";
import GameResultModal from "./GameResultModal";
interface MatchGameProps {
    data:Record<string, string>
}

const MatchGame: React.FC<MatchGameProps> = ({ data }) => {
    const [buttonStates, setButtonStates] = useState<Record<string, string>>( () => {
        const savedStates = localStorage.getItem('buttonStates');
        return savedStates ? JSON.parse(savedStates) : {};
    }); // Lets save the state on the localStorage 

    const [correctCount, setCorrectCount] = useState<number>( () => {
        const savedCorrect = localStorage.getItem('correctCount');
        return savedCorrect ? Number(savedCorrect) : 0;
    })

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [gameStatus, setGameStatus] = useState<string | null>(null);
    const countryCapitalsPairs = Object.entries(data);

    useEffect(()=>{
        localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
        localStorage.setItem('correctCount', correctCount.toString());
    }, [buttonStates, correctCount])

    const handleButtonClick = () => {

    }

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>
                Match the Countries with its Capitals!
            </Typography>
            <Grid container spacing={2}>
                {countryCapitalsPairs.map(([country, capital]) =>(
                    <React.Fragment key={country}>
                        <Grid item xs={6} md={3}>
                            <GameButton 
                                label={country}
                                state={buttonStates[country]}
                                onClick={()=> handleButtonClick()}
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <GameButton 
                                label={capital}
                                state={buttonStates[capital]}
                                onClick={()=> handleButtonClick()}
                            />
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
            <Typography variant="body1" sx={{mt: 2}}>
                Mistakes: 0
            </Typography>
            <GameResultModal open={openModal} gameStatus={gameStatus} />
        </Box>
    );
  };
  
  export default MatchGame;