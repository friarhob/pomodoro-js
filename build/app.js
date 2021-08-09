import { PomodoroTimer } from "./pomodoro-timer";
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
            this.pomodoro = new PomodoroTimer();
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
