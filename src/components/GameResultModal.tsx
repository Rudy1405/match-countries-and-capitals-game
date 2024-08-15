import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

interface GameResultModalProps {
    open: boolean;
    gameStatus: string | null;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ open, gameStatus }) => {
    return (
        <Dialog open={open}>
          <DialogTitle> Game Status </DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center">
              {gameStatus}
            </Typography>
          </DialogContent>
        </Dialog>
      );
}

export default GameResultModal;