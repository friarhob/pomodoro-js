import { NegativeMinutesError } from "./error/negativeMinutesError";

class Timer {
    private running: boolean;
    private resetted: boolean;
    private endTime: number;
    private minutes: number;
    private remainingTime: number;

    constructor(minutes: number) {
        if(minutes < 0)
            throw new NegativeMinutesError("Passing negative value to Timer constructor is not allowed");
        this.minutes = minutes;
        this.running = false;
        this.endTime = Date.now();
        this.resetted = true;
        this.remainingTime = 0;
    }

    private updateStatus(): void {
        let milisseconds = this.running
            ? this.endTime - Date.now()
            : this.remainingTime;

        if (milisseconds < 0) {
            this.running = false;
            this.resetted = true;

        }
    }

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
        this.updateStatus();
        return this.running;
    }

    hasStarted(): boolean {
        this.updateStatus();
        return !this.resetted;
    }
}

export default Timer;
