import { useMemo } from "react";

//[US-57] useMemo - re renders only if one of the following changes
export function useAllBlocks(isLocalPlayer, player) {
    const allBlocks = useMemo(() => {
        const newAllBlocks = [];

        if (
            !player ||
            (!isLocalPlayer && !player.board) ||
            (isLocalPlayer && !player.boardFull)
        ) {
            return [];
        }

        // Opponent logic
        if (!isLocalPlayer) {
            const board = player.board;
            let colHi = Array(10).fill(23);

            for (let x = 0; x < 10; x++) {
                for (let y = 0; y < 22; y++) {
                    if (board[y][x] !== 0) {
                        colHi[x] = y;
                        break;
                    }
                }
            }
            for (let x = 0; x < 10; x++) {
                for (let y = 0; y < 22; y++) {
                    let currentBlock = y >= colHi[x] ? 8 : 0;
                    newAllBlocks.push({ row: y, col: x, id: currentBlock });
                }
            }
        } else {
            // Player logic
            const boardFull = player.boardFull;
            for (let i = 0; i < 22; i++) {
                for (let j = 0; j < 10; j++) {
                    newAllBlocks.push({ row: i, col: j, id: boardFull[i][j] });
                }
            }
        }

        return newAllBlocks;
    }, [isLocalPlayer, player?.board, player?.boardFull, player?.username]);

    return allBlocks;
}
