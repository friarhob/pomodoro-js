import { PomodoroTimer } from "./pomodoro-timer";

export class App {
    private pomodoro: PomodoroTimer;
    private cron: NodeJS.Timer;

    constructor() {
        this.pomodoro = null;
        this.cron = setInterval(() => {
            this.updateTimer();
        }, 20);
    }

    private updateTimer(): void {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        if(this.pomodoro) {
            [hours, minutes, seconds] = this.pomodoro.getTime();
        }
        
        document.getElementById("second").innerHTML = this.format(seconds);
        document.getElementById("minute").innerHTML = this.format(minutes);
        document.getElementById("hour").innerHTML = this.format(hours);
    }

    private format(number: number): string {
        return ((number >= 10)?"":"0")+number;
    }

    start(): void {
        if(this.pomodoro) {
            this.pomodoro.advance();
        } else {
            this.pomodoro = new PomodoroTimer();
        }
    }

    togglePause(): void {
        if(this.pomodoro) {
            this.pomodoro.togglePause();
        }
    }

    reset(): void {
        this.pomodoro = null;
    }
}
