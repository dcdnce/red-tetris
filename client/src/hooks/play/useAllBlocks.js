import { useMemo } from "react";

//[US-57] useMemo - re renders only if one of the following changes
export function useAllBlocks(isLocalPlayer, player) {
    const allBlocks = useMemo(() => {
        if (
            !player ||
            (!isLocalPlayer && !player.board) ||
            (isLocalPlayer && !player.boardFull)
        ) {
            return [];
        }

        // Pre-allocate array with exact size to avoid resizing
        const blocks = new Array(200);

        // Opponent logic
        if (!isLocalPlayer) {
            const board = player.board;
            const colHi = new Array(10);

            // Find highest block in each column
            for (let x = 0; x < 10; x++) {
                colHi[x] = 20;
                for (let y = 0; y < 20; y++) {
                    if (board[y][x] !== 0) {
                        colHi[x] = y;
                        break;
                    }
                }
            }

            // Build blocks array with direct index assignment
            let idx = 0;
            for (let y = 0; y < 20; y++) {
                for (let x = 0; x < 10; x++) {
                    blocks[idx] = {
                        row: y,
                        col: x,
                        id: y >= colHi[x] ? 8 : 0,
                    };
                    idx++;
                }
            }
        } else {
            // Player logic - direct index assignment
            const boardFull = player.boardFull;
            let idx = 0;
            for (let i = 0; i < 20; i++) {
                for (let j = 0; j < 10; j++) {
                    blocks[idx] = {
                        row: i,
                        col: j,
                        id: boardFull[i][j],
                    };
                    idx++;
                }
            }
        }

        return blocks;
    }, [isLocalPlayer, player]);

    return allBlocks;
}
