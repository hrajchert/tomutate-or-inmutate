import * as TSQSort from './qsort';
import {Ordering} from './qsort'
import pretty from 'pretty-ms';
const now = require('performance-now');

type CmpFunction<T> = (a: T, b: T) => Ordering;
type SortFunction <T>= (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>) => ReadonlyArray<T>;

type Measure = ReturnType<typeof time>;

function time<T>(fn: () => T) {
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

// const psMutableQSortBy = (cmp, arr) => PS["QSort"].mutableQSortBy(cmp)(arr);
// const psMutableTOQSortBy = (cmp, arr) => PS["QSort"].mutableTOQSortBy(cmp)(arr);
// const psQSortBy = (cmp, arr) => PS["QSort"].qsortBy(cmp)(arr);
// const psSortBy = (cmp, arr) => PS["Data.Array"].sortBy(cmp)(arr);


// performanceTest(100, 5000, "Native Sort", nativeSort, ;
// performanceTest(100, 5000, "TS Inmutable qsort", qsortBy, cmpNumberAsc);
// performanceTest(100, 5000, "TS Mutable qsort", mutableQSortBy, cmpNumberAsc);
// performanceTest(100, 5000, "TS Mutable qsort TO", mutableTOQSortBy, cmpNumberAsc);
// performanceTest(100, 5000, "PS sortBy", psSortBy, PS["QSort"].cmpNumberAsc);
// performanceTest(100, 5000, "PS Mutable qsort", psMutableQSortBy, PS["QSort"].cmpNumberAsc);
// performanceTest(100, 5000, "PS Inmutable qsort", psQSortBy, PS["QSort"].cmpNumberAsc);
export const suites = {
    TS: {
        nativeSort: {
            name: 'Native Mutable Sort',
            sortFn: (cmp, arr) => (arr as Array<number>).sort(cmp as any),
            cmp: (a, b) => a - b as any,
            tests: [
                // [100,      500000], // 0.014470194415999189ms - 8.9s
                // [1000,     50000], // avg = 0.207881510439997ms :: total time = 11.7s
                // [10000,    10000], // avg = 2.3479686859999886ms :: total time = 26.3s
                // [50000,    5000], // avg = 12.53175328280003ms :: total time = 1m 10.1s
                // [100000,   2500], // avg = 28.958178617999902ms :: total time = 1m 20.9s
                [5000000,  1000],
                // [10000000, 1]
            ]
        } as PerformanceSuite
    }
}

// Native Mutable Sort :: N 1000 :: Samples 1 :: avg = 1.8611210000000042ms :: total time = 3ms
// Native Mutable Sort :: N 10000 :: Samples 1 :: avg = 3.2164670000000015ms :: total time = 7ms
// Native Mutable Sort :: N 50000 :: Samples 1 :: avg = 14.826555999999997ms :: total time = 20ms
// Native Mutable Sort :: N 100000 :: Samples 1 :: avg = 39.31070199999999ms :: total time = 47ms
// Native Mutable Sort :: N 5000000 :: Samples 1 :: avg = 1424.038499ms :: total time = 1.6s
// Native Mutable Sort :: N 10000000 :: Samples 1 :: avg = 2854.1402769999995ms :: total time = 3.2s



interface PerformanceSuite {
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
