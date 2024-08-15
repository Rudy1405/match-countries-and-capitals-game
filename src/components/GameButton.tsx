/// This Component will render a button with the state 
import React from "react";
import { Button } from '@mui/material';

interface GameButtonProps {
    label: string;
    state: 'correct'| 'wrong' | 'active' | undefined;
    onClick: () => void; 
}

const GameButton: React.FC<GameButtonProps> = ({label, state, onClick}) => {
    const setButtonStyle = () => {
        switch (state) {
            case 'correct':
                return {backgroundColor: '#00FF00', color: '#fff'};
            case 'wrong':
                return {backgroundColor: '#FF0000', color: '#fff'};
            case 'active':
                return {backgroundColor: '#0000FF', color: '#fff'};
            default: 
                return {backgroundColor: '#808080', color: '#fff'};        
        }
    }

    return ( 
        <Button
            variant="contained"
            fullWidth
            style={setButtonStyle()}
            onClick={onClick}
            disabled={state === 'correct' || state === 'wrong' || state === 'active'}
        >
        {label}
        </Button>
    )
};

export default GameButton;