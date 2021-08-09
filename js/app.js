"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pomodoro_timer_1 = __importDefault(require("./pomodoro-timer"));
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
            this.pomodoro = new pomodoro_timer_1.default();
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
