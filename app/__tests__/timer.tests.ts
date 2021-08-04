import { NegativeMinutesError } from '../error/negativeMinutesError';
import Timer from './../timer';

describe('Testing Timer object', () => {
    test('creating object', () => {
        expect(new Timer(5)).toBeInstanceOf(Timer);
    });
    test('throwing error when parameter < 0', () => {
        expect(() => {
            var timer = new Timer(-1);
        }).toThrowError(NegativeMinutesError);         
    });
    test('resetting after time is over', () => {
        var timer = new Timer(0);
        timer.start();

        new Promise(() => setTimeout(() => null, 100)).then(() => {
            expect(timer.hasStarted()).toBeFalsy();
        });
    });
});

describe('Testing getTime method', () => {
    test('getTime returning an array of 3 elements', () => {
        var timer = new Timer(5);
        var time = timer.getTime();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test('ranges of minutes returned by getTime', () => {
        var timer = new Timer (100);
        var [_, minutes, _] = timer.getTime();

        expect(minutes).toBeLessThan(60);
        expect(minutes).toBeGreaterThanOrEqual(0);
    });

    test('ranges of seconds returned by getTime', () => {
        var timer = new Timer (100);
        var [_, _, seconds] = timer.getTime();

        expect(seconds).toBeLessThan(60);
        expect(seconds).toBeGreaterThanOrEqual(0);
    });
});

describe('Testing start method', () => {
    test('start returning an array of 3 elements', () => {
        var timer = new Timer(5);
        var time = timer.start();

        expect(time).toBeInstanceOf(Array);
        expect(time).toHaveLength(3);
    });

    test('start() makes Timer to run', () => {
        var timer = new Timer(5);
        timer.start();

        expect(timer.isRunning()).toBeTruthy();
    });

    test('start() after pause() does nothing', () => {
        var timer = new Timer(10);
        timer.start();
        timer.pause();
        timer.start();

        expect(timer.isRunning()).toBeFalsy();
    });
});

describe('Testing pause method', () => {
    test('pauses Timer when called', () => {
        var timer = new Timer(5);

        timer.start();
        var time = timer.pause();
        new Promise(() => setTimeout(() => null, 100)).then(() => {
            expect(time).toBe(timer.getTime());
            expect(timer.isRunning()).toBeFalsy();
        });
    });

    test('calling pause twice has no different effect than calling once', () => {
        var timer = new Timer(5);

        timer.start();
        expect(timer.isRunning()).toBeTruthy();

        timer.pause();
        timer.pause();
        expect(timer.isRunning()).toBeFalsy();
    });

    test('calling pause before starting does nothing', () => {
        var timer = new Timer(5);

        timer.pause();
        expect(timer.hasStarted()).toBeFalsy();
        expect(timer.isRunning()).toBeFalsy();
    });
});