import Timer from "./timer";

/**
 * Class that creates a Pomodoro dual timer.
 * Works as a "Strategy pattern" to choose which Timer object to follow.
 */
class PomodoroTimer {
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
    private current: Timer;

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
        this.current = new Timer(workMinutes);
        this.workMinutes = workMinutes;
        this.cron = setInterval(() => {
            this.update();
        }, 100);
        this.running = true;

        this.current.start();
    }

    /**
     * Updates timer if needed, starting a new one when previous is over.
     * Method used to call on setInterval cron attribute.
     * @private
     */
    private update(): void {
        if (!this.current.hasStarted()) {
            /* Finished timer */
            this.advance();
        }
    }

    /**
     * Get time values to display in chronometer.
     * @returns an array of three integers, representing [hours, minutes, seconds].
     */
    getTime(): [number, number, number] {
        return this.current.getTime();
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
        if(this.running) this.current.pause();
        else this.current.unpause();

        this.running = !this.running;
    }

    /**
     * Advances to next pomodoro cycle manually.
     */
    advance(): void {
        this.current = new Timer(this.work ? 5 : this.workMinutes);
        this.work = !this.work;
        this.current.start();
    }

    /**
     * Check if Pomodoro is in work or play (rest) time.
     * @returns true if it's work time; false if it's play (rest) time.
     */
    isWorking(): boolean {
        return this.work;
    }
}

export default PomodoroTimer;
