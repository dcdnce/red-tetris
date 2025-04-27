const kTetriminosTypes = [
	{
		id: 0,
		blocks: [[0, 0], [1, 1], [-1, 1], [0, 1]],
		rotateOn: [0, 1]
	},
	// etc
]

export const createTestTetrimino = () => { return ({
	type: kTetriminosTypes[0],
	orientation: 0,
	position: [9, 5]
	// etc
});}


// Helpers

/**
 * Calcule les coordonnées absolues [x, y] de chaque bloc d'un tétromino
 * en fonction de son type, de sa position et de son orientation.
 * @param {object} tetrimino - L'objet tétromino (type, position, orientation)
 * @returns {Array<Array<number>>} - Un tableau de coordonnées [[x1, y1], [x2, y2], ...]
 */
export  const calculateAbsoluteBlockPositions = (tetrimino) => {
	if (!tetrimino || !tetrimino.type) return []; 

	const { type, orientation, position } = tetrimino;
	const [pivotX, pivotY] = position;
	let baseBlocks = type.blocks;

	let rotatedRelativeBlocks = baseBlocks.map(block => [...block]);

	for (let i = 0 ; i < orientation ; i++) {
		rotatedRelativeBlocks = rotatedRelativeBlocks.map(([x, y]) => ([-y, x]));
	}

	const rotatedAbsoluteBlocks = rotatedRelativeBlocks.map(([relX, relY]) => ([
		relX + pivotX,
		relY + pivotY
	]));

	return rotatedAbsoluteBlocks;
}

/**
 * Vérifie si toutes les positions de bloc données sont valides sur le plateau.
 * @param {Array<Array<number>>} blockPositions - Les coordonnées [[x, y], ...] à vérifier.
 * @param {Array<Array<number>>} board - Le plateau de jeu.
 * @returns {boolean} - True si toutes les positions sont valides, false sinon.
 */
export const isValidPosition = (blockPositions, board) => {
	const boardHeight = board.length;
	const boardWidth = board[0].length;

	return blockPositions.every(([x, y]) => {
		if (x < 0 || y < 0 || x >= boardWidth || y >= boardHeight) {
			return false;
		}

		if (board[y][x] !== 0) {
			return false;
		}

		return true;
	});
}