/// This Component will render a button with the state 
import React from "react";
import { Button } from '@mui/material';

interface GameButtonProps {
    label: string;
    state: 'correct'| 'wrong' | 'active' | undefined;
    onClick: () => void; 
}

const GameButton: React.FC<GameButtonProps> = ({label, state, onClick}) => {

    return ( 
        <Button
            variant="contained"
            fullWidth
            style={{color: '#fff'}}
            onClick={onClick}
            disabled={state === 'correct' || state === 'wrong'}
        > 
        {label}
        </Button>
    )
};

export default GameButton;