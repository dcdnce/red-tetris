const LOCK_DELAY_MS = 500;

export class LockDelay {
    constructor() {
        this._timer = null;
    }

    init() {
        this._timer = Date.now();
        // Logger.info(true, null, `Lock Delay init.`);
    }

    reset() {
        this._timer = Date.now();
        // Logger.info(true, null, `Lock Delay reset.`);
    }

    isExpired() {
        if (this._timer === null) return false;

        return Date.now() - this._timer >= LOCK_DELAY_MS;
    }

    end() {
        this._timer = null;
        // Logger.info(true, null, `Lock Delay ended.`);
    }

    isActive() {
        return this._timer !== null;
    }
}
