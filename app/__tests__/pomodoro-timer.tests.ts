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