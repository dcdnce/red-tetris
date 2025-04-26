import React from "react";
import styles from "../../styles/play/Board.module.css"
import { useSelector } from "react-redux";

function Block({ row, col}) { // Add color later
	const style = {
		gridRowStart: row + 1,
		gridColumnStart: col + 1,
	};

	return (<div className={styles.block} style={style} />);
}


function Board() {
	const boardState = useSelector(state => state.game.board);

	var allBlocks = Array(0);
	for(let i = 0 ; i < 20 ; i++) {
		for (let j = 0 ; j < 10 ; j++) {
			if (boardState[i][j] == 1)
				allBlocks.push({row: i, col: j});
		}
	}

	return(
		<div className={styles.boardContainer}>
			{allBlocks.map(block => (
				<Block key={`${block.row}-${block.col}`} row={block.row} col={block.col}/>
			))}
		</div>
	);
}

export default Board;