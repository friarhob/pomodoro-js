var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("errors/negativeMinutesError", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NegativeMinutesError = void 0;
    var NegativeMinutesError = /** @class */ (function (_super) {
        __extends(NegativeMinutesError, _super);
        function NegativeMinutesError(m) {
            return _super.call(this, m) || this;
        }
        return NegativeMinutesError;
    }(Error));
    exports.NegativeMinutesError = NegativeMinutesError;
});
define("timer", ["require", "exports", "errors/negativeMinutesError"], function (require, exports, negativeMinutesError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timer = void 0;
    /**
     * Class that creates a timer to a fixed set of minutes.
     */
    var Timer = /** @class */ (function () {
        /**
         * Create a timer to a fixed amount of minutes.
         * Minutes param should be a non-negative number.
         * @param {number} minutes number of minutes.
         * @throws {NegativeMinutesError} Passing negative value to Timer constructor is not allowed
         */
        function Timer(minutes) {
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
        Timer.prototype.updateStatus = function () {
            var milisseconds = this.running
                ? this.endTime - Date.now()
                : this.remainingTime;
            if (milisseconds < 0) {
                this.running = false;
                this.resetted = true;
            }
        };
        /**
         * Gives the current clock status for a timer.
         * @returns an array of three integers, representing [hours, minutes, seconds]
         */
        Timer.prototype.getTime = function () {
            this.updateStatus();
            if (this.resetted)
                return [0, 0, 0];
            var milisseconds = this.running
                ? this.endTime - Date.now()
                : this.remainingTime;
            var seconds = Math.floor((milisseconds + 800) / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            return [hours, minutes, seconds];
        };
        /**
         * Pauses the timer while running.
         * If the timer is not running, does nothing.
         * @returns an array of three integers, representing [hours, minutes, seconds]
         */
        Timer.prototype.pause = function () {
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
        };
        /**
         * Unpauses the timer while pause.
         * If the timer is not paused, does nothing.
         * @returns an array of three integers, representing [hours, minutes, seconds]
         */
        Timer.prototype.unpause = function () {
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
        };
        /**
         * Starts the timer.
         * If the timer is already running, does nothing.
         * @returns an array of three integers, representing [hours, minutes, seconds]
         */
        Timer.prototype.start = function () {
            if (this.resetted) {
                this.endTime = Date.now() + this.minutes * 60 * 1000;
                this.running = true;
                this.resetted = false;
            }
            return this.getTime();
        };
        /**
         * Resets the timer.
         * If the timer is already resetted, does nothing.
         * @returns an array like [0,0,0], representing [hours, minutes, seconds]
         */
        Timer.prototype.reset = function () {
            this.resetted = true;
            this.running = false;
            return this.getTime();
        };
        /**
         * Checks if the timer is running.
         * @returns a boolean
         */
        Timer.prototype.isRunning = function () {
            this.updateStatus();
            return this.running;
        };
        /**
         * Checks if the timer has already started (either running or paused).
         * @returns a boolean
         */
        Timer.prototype.hasStarted = function () {
            this.updateStatus();
            return !this.resetted;
        };
        return Timer;
    }());
    exports.Timer = Timer;
});
define("pomodoro-timer", ["require", "exports", "timer"], function (require, exports, timer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PomodoroTimer = void 0;
    /**
     * Class that creates a Pomodoro dual timer, based on Timer class.
     */
    var PomodoroTimer = /** @class */ (function () {
        /**
         * Creates a pomodoro timer with work time defined.
         * If minutes is not defined, set to default 25 minutes.
         * Play (rest) time is fixed set to 5 minutes.
         * @param {number} [workMinutes] number of work minutes.
         */
        function PomodoroTimer(workMinutes) {
            var _this = this;
            if (workMinutes === void 0) { workMinutes = 25; }
            this.work = true;
            this.timer = new timer_1.Timer(workMinutes);
            this.workMinutes = workMinutes;
            this.cron = setInterval(function () {
                _this.update();
            }, 100);
            this.running = true;
            this.timer.start();
        }
        /**
         * Updates timer if needed, starting a new one when previous is over.
         * Method used to call on setInterval cron attribute.
         * @private
         */
        PomodoroTimer.prototype.update = function () {
            if (!this.timer.hasStarted()) {
                /* Finished timer */
                this.advance();
            }
        };
        /**
         * Get time values to display in chronometer.
         * @returns an array of three integers, representing [hours, minutes, seconds].
         */
        PomodoroTimer.prototype.getTime = function () {
            return this.timer.getTime();
        };
        /**
         * Checks if Pomodoro is running or paused.
         * @returns true if it's running; false if it's paused.
         */
        PomodoroTimer.prototype.isRunning = function () {
            return this.running;
        };
        /**
         * Toggles pause button to pause/restart pomodoro timer.
         */
        PomodoroTimer.prototype.togglePause = function () {
            if (this.running)
                this.timer.pause();
            else
                this.timer.unpause();
            this.running = !this.running;
        };
        /**
         * Advances to next pomodoro cycle manually.
         */
        PomodoroTimer.prototype.advance = function () {
            this.timer = new timer_1.Timer(this.work ? 5 : this.workMinutes);
            this.work = !this.work;
            this.timer.start();
        };
        /**
         * Check if Pomodoro is in work or play (rest) time.
         * @returns true if it's work time; false if it's play (rest) time.
         */
        PomodoroTimer.prototype.isWorkTime = function () {
            return this.work;
        };
        return PomodoroTimer;
    }());
    exports.PomodoroTimer = PomodoroTimer;
});
define("app", ["require", "exports", "pomodoro-timer"], function (require, exports, pomodoro_timer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    var App = /** @class */ (function () {
        function App() {
            var _this = this;
            this.pomodoro = null;
            this.cron = setInterval(function () {
                _this.updateTimer();
            }, 20);
        }
        App.prototype.updateTimer = function () {
            var _a;
            var hours = 0;
            var minutes = 0;
            var seconds = 0;
            if (this.pomodoro) {
                _a = this.pomodoro.getTime(), hours = _a[0], minutes = _a[1], seconds = _a[2];
            }
            document.getElementById("second").innerHTML = this.format(seconds);
            document.getElementById("minute").innerHTML = this.format(minutes);
            document.getElementById("hour").innerHTML = this.format(hours);
        };
        App.prototype.format = function (number) {
            return ((number >= 10) ? "" : "0") + number;
        };
        App.prototype.start = function () {
            if (this.pomodoro) {
                this.pomodoro.advance();
            }
            else {
                this.pomodoro = new pomodoro_timer_1.PomodoroTimer();
            }
        };
        App.prototype.togglePause = function () {
            if (this.pomodoro) {
                this.pomodoro.togglePause();
            }
        };
        App.prototype.reset = function () {
            this.pomodoro = null;
        };
        return App;
    }());
    exports.App = App;
});
