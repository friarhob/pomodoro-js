import { NegativeMinutesError } from "./errors/negativeMinutesError";

/**
 * Class that creates a timer to a fixed set of minutes.
 */
class Timer {
    /**
     * True if timer is running and not paused; false otherwise.
     * @type boolean
     * @private
     */
    private running: boolean;

    /**
     * True if timer is resetted (or just created); false otherwise (either running or paused).
     * @type boolean
     * @private
     */
    private resetted: boolean;
    
    /**
     * Time the Timer should end, in milisseconds (return from Date.now()).
     * @type number
     * @private
     */
    private endTime: number;
    
    /**
     * Number of minutes the Timer should run when started.
     * @type number
     * @private
     */
    private minutes: number;
    
    /**
     * Remaining time, in milisseconds, to be saved when paused and used to calculate new end time when unpaused
     * @type number
     * @private
     */
    private remainingTime: number;

    /**
     * Create a timer to a fixed amount of minutes.
     * Minutes param should be a non-negative number.
     * @param {number} minutes number of minutes.
     * @throws {NegativeMinutesError} Passing negative value to Timer constructor is not allowed
     */
    constructor(minutes: number) {
        if (minutes < 0)
            throw new NegativeMinutesError(
                "Passing negative value to Timer constructor is not allowed"
            );
        this.minutes = minutes;
        this.running = false;
        this.endTime = Date.now();
        this.resetted = true;
        this.remainingTime = 0;
    }

    /**
     * Private method to keep all attributes sanitized.
     * @private
     */
    private updateStatus(): void {
        let milisseconds = this.running
            ? this.endTime - Date.now()
            : this.remainingTime;

        if (milisseconds < 0) {
            this.running = false;
            this.resetted = true;
        }
    }

    /**
     * Gives the current clock status for a timer.
     * @returns an array of three integers, representing [hours, minutes, seconds]
     */
    getTime(): [number, number, number] {
        this.updateStatus();

        if (this.resetted) return [0, 0, 0];

        let milisseconds = this.running
            ? this.endTime - Date.now()
            : this.remainingTime;

        let seconds = Math.floor((milisseconds + 800) / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        return [hours, minutes, seconds];
    }

    /**
     * Pauses the timer while running.
     * If the timer is not running, does nothing.
     * @returns an array of three integers, representing [hours, minutes, seconds]
     */
    pause(): [number, number, number] {
        if (this.resetted) {
            this.running = false;
            return this.getTime();
        }

        if (this.running) {
            this.running = false;
            this.remainingTime = this.endTime - Date.now();
            this.updateStatus();
        }
        return this.getTime();
    }

    /**
     * Unpauses the timer while pause.
     * If the timer is not paused, does nothing.
     * @returns an array of three integers, representing [hours, minutes, seconds]
     */
    unpause(): [number, number, number] {
        if (this.resetted) {
            this.running = false;
            return this.getTime();
        }

        if (!this.running) {
            this.running = true;
            this.endTime = Date.now() + this.remainingTime;
            this.updateStatus();
        }
        return this.getTime();
    }

    /**
     * Starts the timer.
     * If the timer is already running, does nothing.
     * @returns an array of three integers, representing [hours, minutes, seconds]
     */
    start(): [number, number, number] {
        if (this.resetted) {
            this.endTime = Date.now() + this.minutes * 60 * 1000;
            this.running = true;
            this.resetted = false;
        }
        return this.getTime();
    }

    /**
     * Resets the timer.
     * If the timer is already resetted, does nothing.
     * @returns an array like [0,0,0], representing [hours, minutes, seconds]
     */
    reset(): [number, number, number] {
        this.resetted = true;
        this.running = false;

        return this.getTime();
    }

    /**
     * Checks if the timer is running.
     * @returns a boolean
     */
    isRunning(): boolean {
        this.updateStatus();
        return this.running;
    }

    /**
     * Checks if the timer has already started (either running or paused).
     * @returns a boolean
     */
    hasStarted(): boolean {
        this.updateStatus();
        return !this.resetted;
    }
}

export default Timer;
