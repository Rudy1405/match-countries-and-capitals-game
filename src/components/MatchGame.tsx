/// This component should handle the logic for the match of the countries and capitals from data, also state management on clicks 
import React, {useState, useEffect, useCallback} from "react";
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

    const [firstChoice, setFirstChoice] = useState<string | null>(()=>{
        const savedFirstChoice = localStorage.getItem('firstChoice');
        return savedFirstChoice ? savedFirstChoice : null;
    })


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

    const setModalValues = (message: string) => {
        setGameStatus(message);
        setOpenModal(true);
    }

    const getMatchValues = useCallback(() => {
        const totalPairs = countryCapitalsPairs.length;
        const remainingUndefinedButtons = countryCapitalsPairs.reduce((acc, [country, capital]) => {
            if (buttonStates[country] === undefined || buttonStates[capital] === undefined) {
                return acc + 2; // Add 2 for both the country and capital if either is undefined
            }
            return acc;
        }, 0);
        
        return [totalPairs, remainingUndefinedButtons / 2];
    }, [countryCapitalsPairs, buttonStates]);
    

    useEffect(()=>{
        localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
    }, [buttonStates])

    useEffect(() =>{
        localStorage.setItem('mistakes', mistakes.toString());
        localStorage.setItem('correctCount', correctCount.toString());
    }, [mistakes, correctCount])

    useEffect(() => {
        if (firstChoice) {
            localStorage.setItem('firstChoice', firstChoice);
        } else {
            localStorage.removeItem('firstChoice');
        }
    }, [firstChoice]);

    useEffect(()=>{
        const [totalPairs, possibleMistakesAttemps] = getMatchValues();  
        if (mistakes >= 3) {
            setModalValues('Sorry, you lose!');
        } else if (correctCount === totalPairs && mistakes === 0) {
            setModalValues('You are a Geography Master, you win!');
        } else if (possibleMistakesAttemps + mistakes < 4 && mistakes > 0) {
            setModalValues('You win!');
        }
    },[mistakes, correctCount, countryCapitalsPairs.length, buttonStates, countryCapitalsPairs, getMatchValues]);

    const handleButtonClick = (key: string, value: string, type: 'country' | 'capital') => {
        if (!firstChoice) { 
            setFirstChoice(key);
            setButtonStates((prev) => ({...prev, [key]: 'active'}));
        } else {
            // lets first verify when firstchoice is a country and match with a capital or firstchoice is a capital and match with a country
            if( (type === 'capital' && data[firstChoice!] === key) || (type === 'country' && data[key] === firstChoice!)) {
                /// this means its a correct match
                setButtonStates((prev) => ({...prev, [key]: 'correct', [firstChoice]:'correct'}));
                setCorrectCount((prev) => prev + 1);
            } else {
                // there is a mistake
                setButtonStates((prev) => ({...prev, [key]: 'wrong', [firstChoice]:'wrong'})); 
                setMistakes((prev) => prev + 1);
            }
            setFirstChoice(null);
        }

    }

    const resetGame = () => {
        localStorage.removeItem('buttonStates');
        localStorage.removeItem('firstChoice');
        localStorage.removeItem('mistakes');
        localStorage.removeItem('correctCount');

        setButtonStates({});
        setFirstChoice(null);
        setMistakes(0);
        setCorrectCount(0);
        setOpenModal(false); 
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
            <GameResultModal open={openModal} gameStatus={gameStatus} onReset={resetGame} />
        </Box>
    );
  };

  export default MatchGame;