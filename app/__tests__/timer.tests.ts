import { NegativeMinutesError } from "../errors/negativeMinutesError";
import Timer from "../timer";

describe("Testing Timer constructor", () => {
    test("creating object", () => {
        expect(new Timer(5)).toBeInstanceOf(Timer);
    });
    test("throwing error when parameter < 0", () => {
        expect(() => {
            new Timer(-1);
        }).toThrowError(NegativeMinutesError);
    });
    test("resetting after time is over", () => {
        var timer = new Timer(0);
        timer.start();

        new Promise(() => setTimeout(() => null, 100)).then(() => {
            expect(timer.hasStarted()).toBeFalsy();
        });
    });
});

describe("Testing getTime method of class Timer", () => {
    test("getTime returning an array of 3 elements", () => {
        var timer = new Timer(5);
        var time = timer.getTime();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test("ranges of minutes returned by getTime", () => {
        var timer = new Timer(100);
        var [_, minutes, _] = timer.getTime();

        expect(minutes).toBeLessThan(60);
        expect(minutes).toBeGreaterThanOrEqual(0);
    });

    test("ranges of seconds returned by getTime", () => {
        var timer = new Timer(100);
        var [_, _, seconds] = timer.getTime();

        expect(seconds).toBeLessThan(60);
        expect(seconds).toBeGreaterThanOrEqual(0);
    });

    test("getTime returns zero after time is over", () => {
        var timer = new Timer(0);
        timer.start();

        new Promise(() => setTimeout(() => null, 100)).then(() => {
            var time = timer.getTime();

            expect(time).toBe([0, 0, 0]);
        });
    });
});

describe("Testing start method of class Timer", () => {
    test("start returning an array of 3 elements", () => {
        var timer = new Timer(5);
        var time = timer.start();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test("start() makes Timer to run", () => {
        var timer = new Timer(5);
        timer.start();

        expect(timer.isRunning()).toBeTruthy();
    });

    test("start() after pause() does nothing", () => {
        var timer = new Timer(10);
        timer.start();
        timer.pause();
        timer.start();

        expect(timer.isRunning()).toBeFalsy();
    });
});

describe("Testing pause method of class Timer", () => {
    test("pause returning an array of 3 elements", () => {
        var timer = new Timer(5);
        var time = timer.pause();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test("pauses Timer when called", () => {
        var timer = new Timer(5);

        timer.start();
        var time = timer.pause();
        new Promise(() => setTimeout(() => null, 100)).then(() => {
            expect(time).toBe(timer.getTime());
            expect(timer.isRunning()).toBeFalsy();
        });
    });

    test("calling pause twice has no different effect than calling once", () => {
        var timer = new Timer(5);

        timer.start();
        expect(timer.isRunning()).toBeTruthy();

        timer.pause();
        timer.pause();
        expect(timer.isRunning()).toBeFalsy();
    });

    test("calling pause before starting does nothing", () => {
        var timer = new Timer(5);

        timer.pause();
        expect(timer.hasStarted()).toBeFalsy();
        expect(timer.isRunning()).toBeFalsy();
    });

    test("calling pause after ending just resets Timer", () => {
        var timer = new Timer(0);
        timer.start();

        new Promise(() => setTimeout(() => null, 100)).then(() => {
            var time = timer.pause();
            expect(time).toBe([0, 0, 0]);
            expect(timer.hasStarted()).toBeFalsy();
        });
    });
});

describe("Testing unpause method of class Timer", () => {
    test("unpause returning an array of 3 elements", () => {
        var timer = new Timer(5);
        var time = timer.unpause();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test("calling unpause after pause keeps the Timer running", () => {
        var timer = new Timer(5);

        timer.start();
        timer.pause();
        expect(timer.isRunning()).toBeFalsy();

        timer.unpause();
        expect(timer.isRunning()).toBeTruthy();
    });

    test("calling unpause twice has no different effect than calling once", () => {
        var timer = new Timer(5);

        timer.start();
        timer.pause();
        expect(timer.isRunning()).toBeFalsy();

        timer.unpause();
        timer.unpause();
        expect(timer.isRunning()).toBeTruthy();
    });

    test("calling unpause before starting does nothing", () => {
        var timer = new Timer(5);

        timer.unpause();
        expect(timer.hasStarted()).toBeFalsy();
        expect(timer.isRunning()).toBeFalsy();
    });

    test("calling unpause after ending just resets Timer", () => {
        var timer = new Timer(0);
        timer.start();

        new Promise(() => setTimeout(() => null, 100)).then(() => {
            var time = timer.unpause();
            expect(time).toBe([0, 0, 0]);
            expect(timer.hasStarted()).toBeFalsy();
        });
    });
});

describe("Testing reset method of class Timer", () => {
    test("reset returning an array of 3 elements", () => {
        var timer = new Timer(5);
        var time = timer.reset();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test("calling reset after start resets the Timer", () => {
        var timer = new Timer(5);
        timer.start();
        timer.reset();

        expect(timer.hasStarted()).toBeFalsy();
        expect(timer.isRunning()).toBeFalsy();
    });

    test("calling reset while paused resets the Timer", () => {
        var timer = new Timer(5);
        timer.start();
        timer.pause();
        timer.reset();

        expect(timer.hasStarted()).toBeFalsy();
        expect(timer.isRunning()).toBeFalsy();
    });

    test("calling reset before start does nothing", () => {
        var timer = new Timer(0);
        timer.reset();

        expect(timer.hasStarted()).toBeFalsy();
        expect(timer.isRunning()).toBeFalsy();
    });
});
