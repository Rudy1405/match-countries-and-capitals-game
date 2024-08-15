import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';

interface GameResultModalProps {
    open: boolean;
    gameStatus: string | null;
    onReset: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ open, gameStatus, onReset }) => {
    return (
        <Dialog open={open}>
          <DialogTitle variant="h6" align="center"> GAME OVER </DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center">
              {gameStatus}
            </Typography>
          </DialogContent>
          <DialogActions>
                <Button variant="contained" color="primary" onClick={onReset}>
                    Play Again
                </Button>
            </DialogActions>
        </Dialog>
      );
}

export default GameResultModal;