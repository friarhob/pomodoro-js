import { NegativeMinutesError } from "../errors/negativeMinutesError";
import PomodoroTimer from "../pomodoro-timer";

jest.useFakeTimers();

describe("Testing PomodoroTimer constructor", () => {
    test("creating object with parameter", () => {
        expect(new PomodoroTimer(30)).toBeInstanceOf(PomodoroTimer);
    });
    test("creating object without parameter", () => {
        expect(new PomodoroTimer()).toBeInstanceOf(PomodoroTimer);
    });
    test("creating object with negative value should throw NegativeMinutesError", () => {
        expect(() => {
            new PomodoroTimer(-1);
        }).toThrowError(NegativeMinutesError);
    });
});

describe("Testing getTime method", () => {
    test("returns an array of three elements", () => {
        var pomodoroTimer = new PomodoroTimer();
        var time = pomodoroTimer.getTime();
        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });
});

describe("Testing isRunning method", () => {
    test("timer created running", () => {
        var pomodoroTimer = new PomodoroTimer();

        expect(pomodoroTimer.isRunning()).toBeTruthy();
    });
});

describe("Testing togglePause method", () => {
    test("toggle pause once stops timer", () => {
        var pomodoroTimer = new PomodoroTimer();
        pomodoroTimer.togglePause();

        expect(pomodoroTimer.isRunning()).toBeFalsy();
    });

    test("toggle pause twice restarts timer", () => {
        var pomodoroTimer = new PomodoroTimer();
        pomodoroTimer.togglePause();
        pomodoroTimer.togglePause();

        expect(pomodoroTimer.isRunning()).toBeTruthy();
    })
});

