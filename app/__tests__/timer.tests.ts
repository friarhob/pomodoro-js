import Timer from './../timer';

describe('Testing Timer object', () => {
    test('creating object', () => {
        var timer = new Timer(5);
        expect(timer).toBeInstanceOf(Timer);
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