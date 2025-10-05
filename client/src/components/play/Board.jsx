import React from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/play/Board.module.css";
import { useSelector } from "react-redux";
import { selectPlayers } from "../../store/gameSlice";

function Block({ row, col, playerNumber }) {
    const { roomName } = useParams();
    const players = useSelector(selectPlayers(roomName));
    const isPlayerConnected = players[playerNumber].isConnected;
    const didPlayerLost = players[playerNumber].didLost;

    // Position
    const style = {
        gridRowStart: row + 1,
        gridColumnStart: col + 1,
    };

    let className = styles.block;
    if (!isPlayerConnected) {
        className = styles.blockOffline;
    }
    if (didPlayerLost) {
        className = styles.blockDidLost;
    }

    return <div className={`${className}`} style={style} />;
}

function Board({ playerNumber }) {
    const { roomName } = useParams();

    const players = useSelector(selectPlayers(roomName));
    const gameBoard = players[playerNumber].board;

    // Board
    var allBlocks = Array(0);
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            if (gameBoard[i][j] != 0) allBlocks.push({ row: i, col: j });
        }
    }

    return (
        <div className={styles.boardContainer}>
            {allBlocks.map((block) => (
                <Block
                    key={`${block.row}-${block.col}`}
                    row={block.row}
                    col={block.col}
                    playerNumber={playerNumber}
                />
            ))}
        </div>
    );
}

export default Board;
