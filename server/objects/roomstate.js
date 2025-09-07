export const kPendingState = "pending";
export const kStartedState = "started";

export default class RoomState {
    constructor() {
        this.state = kPendingState;
    }

    setPending() {
        this.state = kPendingState;
    }

    setStarted() {
        this.state = kStartedState;
    }

    getState() {
        return this.state;
    }
}
