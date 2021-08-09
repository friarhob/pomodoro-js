import { Timer } from "./timer";

/**
 * Class that creates a Pomodoro dual timer, based on Timer class.
 */
export class PomodoroTimer {
    /**
     * True if it's work time, false otherwise.
     * @type boolean
     * @private
     */
    private work: boolean;

    /**
     * Timer pointer to store current timer being used.
     * @type Timer
     * @private
     */
    private timer: Timer;

    /**
     * Number of minutes of work time
     * @type number
     * @private
     */
    private workMinutes: number;

    /**
     * Storage for setInterval of update music.
     * @type NodeJS.Timer
     * @private
     */
    private cron: NodeJS.Timer;

    /**
     * Boolean to check if Pomodoro is running or paused.
     * True if Pomodoro is running; false otherwise.
     * @type boolean
     * @private
     */
    private running: boolean;

    /**
     * Creates a pomodoro timer with work time defined.
     * If minutes is not defined, set to default 25 minutes.
     * Play (rest) time is fixed set to 5 minutes. 
     * @param {number} [workMinutes] number of work minutes.
     */
    constructor(workMinutes: number = 25) {
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
    private update(): void {
        if (!this.timer.hasStarted()) {
            /* Finished timer */
            this.advance();
        }
    }

    /**
     * Get time values to display in chronometer.
     * @returns an array of three integers, representing [hours, minutes, seconds].
     */
    getTime(): [number, number, number] {
        return this.timer.getTime();
    }

    /**
     * Checks if Pomodoro is running or paused.
     * @returns true if it's running; false if it's paused.
     */
    isRunning(): boolean {
        return this.running;
    }

    /**
     * Toggles pause button to pause/restart pomodoro timer.
     */
    togglePause(): void {
        if(this.running) this.timer.pause();
        else this.timer.unpause();

        this.running = !this.running;
    }

    /**
     * Advances to next pomodoro cycle manually.
     */
    advance(): void {
        this.timer = new Timer(this.work ? 5 : this.workMinutes);
        this.work = !this.work;
        this.timer.start();
    }

    /**
     * Check if Pomodoro is in work or play (rest) time.
     * @returns true if it's work time; false if it's play (rest) time.
     */
    isWorkTime(): boolean {
        return this.work;
    }
}
