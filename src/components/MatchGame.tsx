/// This component should handle the logic for the match of the countries and capitals from data, also state management on clicks 
import React, {useState, useEffect} from "react";
import { Box, Grid, Typography } from '@mui/material';

import GameButton from "./GameButton";
import GameResultModal from "./GameResultModal";
interface MatchGameProps {
    data:Record<string, string>
}

const isValidState = (state: string | undefined): state is 'correct'| 'wrong' | 'active' | undefined => {
    return state === 'correct' || state === 'wrong' || state === 'active' || state === undefined;
}

const MatchGame: React.FC<MatchGameProps> = ({ data }) => {
    const [buttonStates, setButtonStates] = useState<Record<string, string>>( () => {
        const savedStates = localStorage.getItem('buttonStates');
        return savedStates ? JSON.parse(savedStates) : {};
    }); // Lets save the state on the localStorage 

    const [firstChoice, setFirstChoice] = useState<string | null>(null);
    const [mistakes, setMistakes] = useState<number>(()=>{
        const savedMistakes = localStorage.getItem('mistakes');
        return savedMistakes ? Number(savedMistakes) : 0;
    })
    const [correctCount, setCorrectCount] = useState<number>( () => {
        const savedCorrect = localStorage.getItem('correctCount');
        return savedCorrect ? Number(savedCorrect) : 0;
    })

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [gameStatus, setGameStatus] = useState<string | null>(null);
    const countryCapitalsPairs = Object.entries(data);

    useEffect(()=>{
        localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
    }, [buttonStates])

    useEffect(() =>{
        localStorage.setItem('mistakes', mistakes.toString());
        localStorage.setItem('correctCount', correctCount.toString());
    }, [mistakes, correctCount])

    useEffect(()=>{
        if (mistakes >= 3) {
            setGameStatus('Sorry, you lose!');
            setOpenModal(true);
        } else if (correctCount === countryCapitalsPairs.length) {
            setGameStatus('You are a Geography Master, you win!');
            setOpenModal(true);
        }
    },[mistakes,correctCount,countryCapitalsPairs.length]);

    const handleButtonClick = (key: string, value: string, type: 'country' | 'capital') => {
        if (!firstChoice) { 
            setFirstChoice(key);
            setButtonStates((prev) => ({...prev, [key]: 'active'}));
        } else {
            const isCorrect = type === 'country'
            ? data[key] === data[firstChoice!]
            : key === Object.keys(data).find((k) => data[k] === firstChoice!);

            if (isCorrect) {
                setButtonStates((prev) => ({...prev, [key]: 'correct', [firstChoice!]:'correct'}));
                setCorrectCount((prev) => prev + 1);
            } else {
                setButtonStates((prev) => ({...prev, [key]: 'wrong', [firstChoice!]:'wrong'}));
                setMistakes((prev) => prev + 1);
            }
            setFirstChoice(null);
        }

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
                            {(() => {
                                const countryState = buttonStates[country];
                                /// Extract of the state to a var for TS better type handling on the compiler
                                return (
                                    <GameButton
                                        label={country}
                                        state={isValidState(countryState) ? countryState : undefined}
                                        onClick={() => handleButtonClick(country, capital, 'country')}
                                    />
                                    );
                            })()}
                        </Grid>
                        <Grid item xs={6} md={3}>
                            {(() => {
                                const capitalState = buttonStates[capital];
                                /// Extract of the state to a var for TS better type handling on the compiler
                                return (
                                    <GameButton
                                        label={capital}
                                        state={isValidState(capitalState) ? capitalState : undefined}
                                        onClick={() => handleButtonClick(capital, country, 'capital')}
                                    />
                                );
                            })()}   
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
            <Typography variant="body1" sx={{mt: 2}}>
                Mistakes: {mistakes}
            </Typography>
            <GameResultModal open={openModal} gameStatus={gameStatus} />
        </Box>
    );
  };

  export default MatchGame;