/// This Component will render a button with the state 
import React from "react";
import { Button } from '@mui/material';

interface GameButtonProps {
    label: string;
    state: 'correct'| 'wrong' | 'active' | undefined; 
}

const GameButton: React.FC<GameButtonProps> = ({label, state}) => {

    return ( 
        <Button> button </Button>
    )
};

export default GameButton;