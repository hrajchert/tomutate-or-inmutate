import * as TSQSort from '../qsort';
import { PerformanceSuite } from './performance-test';
const PS = {
    "Data.Array": require('../../output/Data.Array'),
    "QSort": require('../../output/QSort')
};
// const psMutableQSortBy = ;
// const psMutableTOQSortBy = ;



// performanceTest(100, 5000, "", mutableQSortBy, cmpNumberAsc);
// performanceTest(100, 5000, "", mutableTOQSortBy, cmpNumberAsc);
// performanceTest(100, 5000, "PS sortBy", psSortBy, PS["QSort"].cmpNumberAsc);
// performanceTest(100, 5000, "PS Mutable qsort", psMutableQSortBy, PS["QSort"].cmpNumberAsc);
export const suites = {
    TS: {
        nativeSort: {
            name: 'Native Mutable Sort',
            sortFn: (cmp, arr) => (arr as Array<number>).sort(cmp as any),
            cmp: (a, b) => a - b as any,
            tests: [
                [100,      500000], // avg = 0.014391836729999921ms :: total time = 8.5s
                [1000,     50000],  // avg = 0.207881510439997ms :: total time = 11.7s
                [10000,    10000],  // avg = 2.3479686859999886ms :: total time = 26.3s
                [50000,    5000],   // avg = 12.53175328280003ms :: total time = 1m 10.1s
                [100000,   2500],   // avg = 28.958178617999902ms :: total time = 1m 20.9s
                [5000000,  1000],   // avg = 1446.6268290499997ms :: total time = 26m 35.6s
                [10000000, 500]
            ]
        } as PerformanceSuite,
        qsortBy: {
            name: 'TS Inmutable qsort',
            sortFn: TSQSort.qsortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
        mutableQSortBy: {
            name: 'TS Mutable qsort',
            sortFn: TSQSort.mutableQSortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
        mutableTOQSortBy: {
            name: 'TS Mutable qsort TO',
            sortFn: TSQSort.mutableTOQSortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
        iterativeQSortBy: {
            name: 'TS Iterative Mutable qsort',
            sortFn: TSQSort.iterativeQSortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
    },
    PS: {
        sortBy: {
            name: 'Native Mutable Sort',
            sortFn: (cmp, arr) => PS["Data.Array"].sortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      500000], // avg = 0.03312913349399809ms :: total time = 17.9s
                [1000,     50000],  // avg = 0.5093360571800042ms :: total time = 26.7s
                [10000,    10000],  // avg = 6.005861303899992ms :: total time = 1m 2.4s
                [50000,    5000],   // avg = 32.100295705600324ms :: total time = 2m 47.3s
                [100000,   2500],
                [5000000,  1000],
                [10000000, 500]
            ]
        } as PerformanceSuite,
        qsortBy: {
            name: 'PS Inmutable qsort',
            sortFn: (cmp, arr) => PS["QSort"].qsortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
        mutableQSortBy: {
            name: 'PS Mutable qsort',
            sortFn: (cmp, arr) => PS["QSort"].mutableQSortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
        mutableTOQSortBy: {
            name: 'PS Mutable qsort TO',
            sortFn: (cmp, arr) => PS["QSort"].mutableTOQSortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,
        iterativeQSortBy: {
            name: 'PS Iterative qsort',
            sortFn: (cmp, arr) => PS["QSort"].iterativeQSortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      1],
                // [100,      500000],
                // [1000,     50000],
                // [10000,    10000],
                // [50000,    5000],
                // [100000,   2500],
                // [5000000,  1000],
                // [10000000, 500]
            ]
        } as PerformanceSuite,

    }
}







// Native Mutable Sort :: N 1000 :: Samples 1 :: avg = 1.8611210000000042ms :: total time = 3ms
// Native Mutable Sort :: N 10000 :: Samples 1 :: avg = 3.2164670000000015ms :: total time = 7ms
// Native Mutable Sort :: N 50000 :: Samples 1 :: avg = 14.826555999999997ms :: total time = 20ms
// Native Mutable Sort :: N 100000 :: Samples 1 :: avg = 39.31070199999999ms :: total time = 47ms
// Native Mutable Sort :: N 5000000 :: Samples 1 :: avg = 1424.038499ms :: total time = 1.6s
// Native Mutable Sort :: N 10000000 :: Samples 1 :: avg = 2854.1402769999995ms :: total time = 3.2s

