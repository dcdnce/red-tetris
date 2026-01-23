import { EntitySchema } from "typeorm";

export class Score {
    constructor(id, username, score, linesCleared, isActive) {
        this.id = id;
        this.username = username;
        this.score = score;
        this.linesCleared = linesCleared;
        this.isActive = isActive;
    }
}

export const ScoreSchema = new EntitySchema({
    name: "Score",
    target: Score,
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        username: {
            type: "text",
        },
        score: {
            type: "integer",
        },
        linesCleared: {
            type: "integer",
        },
        isActive: {
            type: "boolean",
            default: true,
        },
    },
});
