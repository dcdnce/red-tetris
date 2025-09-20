import React from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/play/Board.module.css";
import { useSelector } from "react-redux";
import { selectPlayers } from "../../store/gameSlice";

function Block({ row, col, isPlayerConnected }) {
    // Add color later
    const style = {
        gridRowStart: row + 1,
        gridColumnStart: col + 1,
    };

    return (
        <div
            className={`${isPlayerConnected ? styles.block : styles.blockOffline}`}
            style={style}
        />
    );
}

function Board({ number }) {
    const { roomName } = useParams();

    const players = useSelector(selectPlayers(roomName));
    const gameBoard = players[number].board;
    const isPlayerConnected = players[number].isConnected;

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
                    isPlayerConnected={isPlayerConnected}
                />
            ))}
        </div>
    );
}

export default Board;
