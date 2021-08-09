import { Timer } from "./timer";
/**
 * Class that creates a Pomodoro dual timer, based on Timer class.
 */
export class PomodoroTimer {
    /**
     * Creates a pomodoro timer with work time defined.
     * If minutes is not defined, set to default 25 minutes.
     * Play (rest) time is fixed set to 5 minutes.
     * @param {number} [workMinutes] number of work minutes.
     */
    constructor(workMinutes = 25) {
        this.work = true;
        this.timer = new Timer(workMinutes);
        this.workMinutes = workMinutes;
        this.cron = setInterval(() => {
            this.update();
        }, 100);
        this.running = true;
        this.timer.start();
    }
    /**
     * Updates timer if needed, starting a new one when previous is over.
     * Method used to call on setInterval cron attribute.
     * @private
     */
    update() {
        if (!this.timer.hasStarted()) {
            /* Finished timer */
            this.advance();
        }
    }
    /**
     * Get time values to display in chronometer.
     * @returns an array of three integers, representing [hours, minutes, seconds].
     */
    getTime() {
        return this.timer.getTime();
    }
    /**
     * Checks if Pomodoro is running or paused.
     * @returns true if it's running; false if it's paused.
     */
    isRunning() {
        return this.running;
    }
    /**
     * Toggles pause button to pause/restart pomodoro timer.
     */
    togglePause() {
        if (this.running)
            this.timer.pause();
        else
            this.timer.unpause();
        this.running = !this.running;
    }
    /**
     * Advances to next pomodoro cycle manually.
     */
    advance() {
        this.timer = new Timer(this.work ? 5 : this.workMinutes);
        this.work = !this.work;
        this.timer.start();
    }
    /**
     * Check if Pomodoro is in work or play (rest) time.
     * @returns true if it's work time; false if it's play (rest) time.
     */
    isWorkTime() {
        return this.work;
    }
}
