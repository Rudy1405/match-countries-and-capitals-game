import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';

interface GameResultModalProps {
    open: boolean;
    gameStatus: string | null;
    onReset: () => void;
    onNewGame: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ open, gameStatus, onReset, onNewGame }) => {
    return (
        <Dialog open={open}>
          <DialogTitle variant="h6" align="center"> GAME OVER </DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center">
              {gameStatus}
            </Typography>
          </DialogContent>
          <DialogActions>
                {gameStatus !== 'You are a Geography Master, you win!' && (
                    <Button variant="contained" color="secondary" onClick={onReset}>
                        Retry?
                    </Button>
                )}
                <Button variant="contained" color="primary" onClick={onNewGame}>
                    Start a new Game
                </Button>
            </DialogActions>
        </Dialog>
      );
}

export default GameResultModal;