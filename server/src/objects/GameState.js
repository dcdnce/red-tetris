export const kPendingState = "pending";
export const kStartedState = "started";
export const kFinishedState = "finished";

export default class GameState {
    constructor() {
        this.state = kPendingState;
    }

    setPending() {
        this.state = kPendingState;
    }

    setStarted() {
        this.state = kStartedState;
    }

    setFinished() {
        this.state = kFinishedState;
    }

    getState() {
        return this.state;
    }
}
