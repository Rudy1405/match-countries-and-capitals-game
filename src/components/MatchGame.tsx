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

const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
};

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

    const [shuffledCountries, setShuffledCountries] = useState<string[]>(() => shuffleArray(Object.keys(data)));
    const [shuffledCapitals, setShuffledCapitals] = useState<string[]>(() => shuffleArray(Object.values(data)));



    const setModalValues = (message: string) => {
        setGameStatus(message);
        setOpenModal(true);
    }

    const getMatchValues = useCallback(() => {
        const totalPairs = Object.entries(data).length;
        const remainingUndefinedButtons = Object.entries(data).reduce((acc, [country, capital]) => {
            if (buttonStates[country] === undefined || buttonStates[capital] === undefined) {
                return acc + 2; // Add 2 for both the country and capital if either is undefined
            }
            return acc;
        }, 0);
        
        return [totalPairs, remainingUndefinedButtons / 2];
    }, [data, buttonStates]);
    

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

    useEffect(() => {
        const [totalPairs, possibleMistakesAttemps] = getMatchValues();
        
        if (mistakes >= 3) {
            setModalValues('Sorry, you lose!');
        } else if (correctCount === totalPairs && mistakes === 0) {
            setModalValues('You are a Geography Master, you win!');
        } else if (possibleMistakesAttemps + mistakes < 4 && mistakes > 0) {
            setModalValues('You win!');
        }
    }, [mistakes, correctCount, buttonStates, getMatchValues]);

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

    const resetGame = (newGame = false) => {
        localStorage.removeItem('buttonStates');
        localStorage.removeItem('firstChoice');
        localStorage.removeItem('mistakes');
        localStorage.removeItem('correctCount');

        setButtonStates({});
        setFirstChoice(null);
        setMistakes(0);
        setCorrectCount(0);

        if (newGame) {
            setShuffledCountries(shuffleArray(Object.keys(data)));
            setShuffledCapitals(shuffleArray(Object.values(data)));
        }
        setOpenModal(false); 

    }

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>
                Match the Countries with its Capitals!
            </Typography>
            <Grid container spacing={2}>
                {/* Render shuffled countries */}
                {shuffledCountries.map((country) => (
                    <Grid item xs={6} md={3} key={country}>
                        {(() => {
                            const countryState = buttonStates[country];
                            const state = isValidState(countryState) ? countryState : undefined;
                            return (
                                <GameButton
                                    label={country}
                                    state={state}
                                    onClick={() => handleButtonClick(country, data[country], 'country')}
                                />
                            );
                        })()}
                    </Grid>
                ))}
                {/* Render shuffled capitals */}
                {shuffledCapitals.map((capital) => (
                    <Grid item xs={6} md={3} key={capital}>
                        {(() => {
                            const capitalState = buttonStates[capital];
                            const state = isValidState(capitalState) ? capitalState : undefined;
                            return (
                                <GameButton
                                    label={capital}
                                    state={state}
                                    onClick={() => handleButtonClick(capital, Object.keys(data).find((key) => data[key] === capital)!, 'capital')}
                                />
                            );
                        })()}
                    </Grid>
                ))}
            </Grid>
            <Typography variant="body1" sx={{mt: 2}}>
                Mistakes: {mistakes}
            </Typography>
            <GameResultModal open={openModal} gameStatus={gameStatus} onReset={()=> resetGame(false)} onNewGame={() => resetGame(true)} />
        </Box>
    );
  };

  export default MatchGame;