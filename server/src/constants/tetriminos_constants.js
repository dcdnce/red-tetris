export const kicksJLSTZ = {
    // Rotate right
    "0->1": [
        [0, 0],
        [-1, 0],
        [-1, +1],
        [0, -2],
        [-1, -2],
    ],
    "1->2": [
        [0, 0],
        [+1, 0],
        [+1, -1],
        [0, +2],
        [+1, +2],
    ],
    "2->3": [
        [0, 0],
        [+1, 0],
        [+1, +1],
        [0, -2],
        [+1, -2],
    ],
    "3->0": [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, +2],
        [-1, +2],
    ],
    // Rotate left
    "1->0": [
        [0, 0],
        [+1, 0],
        [+1, -1],
        [0, +2],
        [+1, +2],
    ],
    "2->1": [
        [0, 0],
        [-1, 0],
        [-1, +1],
        [0, -2],
        [-1, -2],
    ],
    "3->2": [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, +2],
        [-1, +2],
    ],
    "0->3": [
        [0, 0],
        [+1, 0],
        [+1, +1],
        [0, -2],
        [+1, -2],
    ],
};

export const kicksI = {
    // Rotate right
    "0->1": [
        [0, 0],
        [-2, 0],
        [+1, 0],
        [-2, -1],
        [+1, +2],
    ],
    "1->2": [
        [0, 0],
        [-1, 0],
        [+2, 0],
        [-1, +2],
        [+2, -1],
    ],
    "2->3": [
        [0, 0],
        [+2, 0],
        [-1, 0],
        [+2, +1],
        [-1, -2],
    ],
    "3->0": [
        [0, 0],
        [+1, 0],
        [-2, 0],
        [+1, -2],
        [-2, +1],
    ],
    // Rotate left
    "1->0": [
        [0, 0],
        [+2, 0],
        [-1, 0],
        [+2, +1],
        [-1, -2],
    ],
    "2->1": [
        [0, 0],
        [+1, 0],
        [-2, 0],
        [+1, -2],
        [-2, +1],
    ],
    "3->2": [
        [0, 0],
        [-2, 0],
        [+1, 0],
        [-2, -1],
        [+1, +2],
    ],
    "0->3": [
        [0, 0],
        [-1, 0],
        [+2, 0],
        [-1, +2],
        [+2, -1],
    ],
};

export const kTetriminosTypes = [
    {
        id: 0,
        type: "EMPTY",
        // Reserved for empty blocks on the board
    },
    {
        // T-piece
        // Spawns with its flat side up, leaning left.
        id: 1,
        type: "T",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0], // Left arm
            [+1, 0], // Right arm
            [0, -1], // Top spike (negative Y is up)
        ],
        baseHeight: 2,
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // I-piece (long bar)
        // Spawns horizontally, centered.
        id: 2,
        type: "I",
        baseBlocks: [
            [0, 0], // Pivot block (slightly left of center)
            [-1, 0],
            [+1, 0],
            [+2, 0],
        ],
        basePosition: [4, 0], // Spawns in row 0, centered
    },
    {
        // O-piece (square)
        // Spawns centered.
        id: 3,
        type: "O",
        baseBlocks: [
            [0, 0],
            [+1, 0],
            [0, +1],
            [+1, +1],
        ],
        basePosition: [4, 0], // Spawns in row 0, centered
    },
    {
        // L-piece
        // Spawns with its flat side up, leaning left.
        id: 4,
        type: "L",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0],
            [+1, 0],
            [+1, -1], // Top-right corner
        ],
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // J-piece
        // Spawns with its flat side up, leaning left.
        id: 5,
        type: "J",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0],
            [+1, 0],
            [-1, -1], // Top-left corner
        ],
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // S-piece
        // Spawns horizontally, leaning left.
        id: 6,
        type: "S",
        baseBlocks: [
            [0, 0], // Pivot block
            [+1, 0],
            [0, -1],
            [-1, -1],
        ],
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
    {
        // Z-piece
        // Spawns horizontally, leaning left.
        id: 7,
        type: "Z",
        baseBlocks: [
            [0, 0], // Pivot block
            [-1, 0],
            [0, -1],
            [+1, -1],
        ],
        basePosition: [4, 1], // Spawns in row 1, column 4
    },
];
