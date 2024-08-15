import React from "react";


const GameResultModal = ({gameStatus}) => {
    return(
        <dialog open={true}>
            {gameStatus}
        </dialog>
    )
}

export default GameResultModal;