import { NegativeMinutesError } from "./error/negativeMinutesError";

class Timer {
    private running: boolean;
    private resetted: boolean;
    private endTime: number;
    private minutes: number;
    private remainingTime: number;

    constructor(minutes: number) {
        if(minutes < 0)
            throw new NegativeMinutesError("Passing negative value to Timer constructor");
        this.minutes = minutes;
        this.running = false;
        this.endTime = Date.now();
        this.resetted = true;
        this.remainingTime = 0;
    }

    getTime(): [number, number, number] {
        if (this.resetted) return [0, 0, 0];

        let milisseconds = this.running
            ? this.endTime - Date.now()
            : this.remainingTime;
        if (milisseconds < 0) {
            this.running = false;
            this.resetted = true;
            return [0, 0, 0];
        }

        let seconds = Math.floor((milisseconds + 800) / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        return [hours, minutes, seconds];
    }

    pause(): [number, number, number] {
        if (this.resetted) {
            this.running = false;
            return this.getTime();
        }

        if (this.running) {
            this.running = false;
            this.remainingTime = this.endTime - Date.now();
            if (this.remainingTime < 0) this.remainingTime = 0;
        }
        return this.getTime();
    }

    unpause(): [number, number, number] {
        if (this.resetted) {
            this.running = false;
            return this.getTime();
        }

        if (!this.running) {
            this.running = true;
            this.endTime = Date.now() + this.remainingTime;
        }
        return this.getTime();
    }

    start(): [number, number, number] {
        if (this.resetted) {
            this.endTime = Date.now() + this.minutes * 60 * 1000;
            this.running = true;
            this.resetted = false;
        }
        return this.getTime();
    }

    reset(): [number, number, number] {
        this.resetted = true;
        this.running = false;

        return this.getTime();
    }

    isRunning(): boolean {
        return this.running;
    }
}

export default Timer;
