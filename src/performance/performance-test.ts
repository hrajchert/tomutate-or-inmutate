import {Ordering} from '../qsort'
import pretty from 'pretty-ms';

const now = require('performance-now');

type CmpFunction<T> = (a: T, b: T) => Ordering;
type SortFunction <T>= (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>) => ReadonlyArray<T>;

type Measure = ReturnType<typeof time>;

export function time<T>(fn: () => T) {
    const start = now();
    const result = fn();

    return {
        duration: now() - start as number,
        result
    }
}


function performanceTest(arrayLength: number, samples: number, name: string, sortFn: SortFunction<number>, cmp: CmpFunction<number>) {
    // perform the test many times (samples times) and get the average duration
    function getAvgDuration() {
        const measures = new Array(samples) as Measure[];

        for (let i = 0; i < samples ; i++) {
            const arr = createRandomArray(arrayLength);
            measures[i] = time(
                () => {
                    sortFn(cmp, arr)
                    return {};
                }
            )
        }
        const sum = measures
            .map(measure => measure.duration)
            .reduce((accu, duration) => accu + duration, 0)
        ;
        return sum / samples;
    }

    const avgDurationResult = time(getAvgDuration);
    const totalTime = avgDurationResult.duration;
    const avg = avgDurationResult.result;

    console.log(`${name} :: N ${arrayLength} :: Samples ${samples} :: avg = ${avg}ms :: total time = ${pretty(totalTime)}`);
}


export interface PerformanceSuite {
    // The name of the test
    name: string;
    // The sort function to test
    sortFn: SortFunction<number>
    // How the function compares numbers
    cmp: CmpFunction<number>
    tests: Array<[number, number]>
}

export function performanceSuite(suite: PerformanceSuite) {
    suite.tests.forEach(([arrayLength, samples]) => {
        performanceTest(arrayLength, samples, suite.name, suite.sortFn, suite.cmp);
    });
}


function createRandomArray(n: number) {
    const result = new Array(n);
    for (let i=0; i<n; i++) {
        result[i] = Math.round(Math.random() * 100);
    }
    return result;
}

export function quickTest(arrayLength: number, sortFn: SortFunction<number>, cmpAsc: CmpFunction<number>) {
    const randomArray = createRandomArray(arrayLength);
    const sorted1 = sortFn(cmpAsc, randomArray);
    const sorted2 = randomArray.sort((a, b) => a - b);
    let eq = true;
    for (let i = 0; i < sorted1.length; i ++) {
        if (sorted1[i] !== sorted2[i]) {
            eq = false;
            break;
        }
    }
    if (!eq) {
        console.log('Arrays are diferent');
        console.log('sortFn', sorted1);
        console.log('native sort', sorted2);
    }
}
