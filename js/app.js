(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomodoro_timer_1 = require("./pomodoro-timer");
class App {
    constructor() {
        this.pomodoro = null;
        this.cron = setInterval(() => {
            this.updateTimer();
        }, 20);
    }
    updateTimer() {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        if (this.pomodoro) {
            [hours, minutes, seconds] = this.pomodoro.getTime();
        }
        document.getElementById("second").innerHTML = this.format(seconds);
        document.getElementById("minute").innerHTML = this.format(minutes);
        document.getElementById("hour").innerHTML = this.format(hours);
    }
    format(number) {
        return ((number >= 10) ? "" : "0") + number;
    }
    start() {
        if (this.pomodoro) {
            this.pomodoro.advance();
        }
        else {
            this.pomodoro = new pomodoro_timer_1.PomodoroTimer();
        }
    }
    togglePause() {
        if (this.pomodoro) {
            this.pomodoro.togglePause();
        }
    }
    reset() {
        this.pomodoro = null;
    }
}
var app = new App();

},{"./pomodoro-timer":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegativeMinutesError = void 0;
class NegativeMinutesError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.NegativeMinutesError = NegativeMinutesError;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroTimer = void 0;
const timer_1 = require("./timer");
/**
 * Class that creates a Pomodoro dual timer, based on Timer class.
 */
class PomodoroTimer {
    /**
     * Creates a pomodoro timer with work time defined.
     * If minutes is not defined, set to default 25 minutes.
     * Play (rest) time is fixed set to 5 minutes.
     * @param {number} [workMinutes] number of work minutes.
     */
    constructor(workMinutes = 25) {
        this.work = true;
        this.timer = new timer_1.Timer(workMinutes);
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
        this.timer = new timer_1.Timer(this.work ? 5 : this.workMinutes);
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
exports.PomodoroTimer = PomodoroTimer;

},{"./timer":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const negativeMinutesError_1 = require("./errors/negativeMinutesError");
/**
 * Class that creates a timer to a fixed set of minutes.
 */
class Timer {
    /**
     * Create a timer to a fixed amount of minutes.
     * Minutes param should be a non-negative number.
     * @param {number} minutes number of minutes.
     * @throws {NegativeMinutesError} Passing negative value to Timer constructor is not allowed
     */
    constructor(minutes) {
        if (minutes < 0)
            throw new negativeMinutesError_1.NegativeMinutesError("Passing negative value to Timer constructor is not allowed");
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
    updateStatus() {
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
    getTime() {
        this.updateStatus();
        if (this.resetted)
            return [0, 0, 0];
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
    pause() {
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
    unpause() {
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
    start() {
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
    reset() {
        this.resetted = true;
        this.running = false;
        return this.getTime();
    }
    /**
     * Checks if the timer is running.
     * @returns a boolean
     */
    isRunning() {
        this.updateStatus();
        return this.running;
    }
    /**
     * Checks if the timer has already started (either running or paused).
     * @returns a boolean
     */
    hasStarted() {
        this.updateStatus();
        return !this.resetted;
    }
}
exports.Timer = Timer;

},{"./errors/negativeMinutesError":2}]},{},[1]);
