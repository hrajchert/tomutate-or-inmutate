import * as TSQSort from '../qsort';
import { PerformanceSuite } from './performance-test';
const PS = {
    "Data.Array": require('../../output/Data.Array'),
    "QSort": require('../../output/QSort')
};

export const suites = {
    TS: {
        nativeSort: {
            name: 'Native Mutable Sort',
            sortFn: (cmp, arr) => (arr as Array<number>).sort(cmp as any),
            cmp: (a, b) => a - b as any,
            tests: [
                // [100,      500000], // avg = 0.014391836729999921ms :: total time = 8.5s
                // [1000,     50000],  // avg = 0.207881510439997ms :: total time = 11.7s
                // [10000,    10000],  // avg = 2.3479686859999886ms :: total time = 26.3s
                // [50000,    5000],   // avg = 12.53175328280003ms :: total time = 1m 10.1s
                // [100000,   2500],   // avg = 28.958178617999902ms :: total time = 1m 20.9s
                // [5000000,  1000],   // avg = 1446.6268290499997ms :: total time = 26m 35.6s
                // [10000000, 500]     // avg = 2949.357555032006ms :: total time = 27m 13.1s
                [10000000, 1]
            ]
        } as PerformanceSuite,
        qsortBy: {
            name: 'TS Inmutable qsort',
            sortFn: TSQSort.qsortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.024585823266000006ms :: total time = 13.5s
                // [1000,     50000],  // avg = 0.22402573488000013ms :: total time = 12.3s
                // [10000,    10000],  // avg = 2.2227689862999993ms :: total time = 24.4s
                // [50000,    5000],   // avg = 14.359102919399866ms :: total time = 1m 18.6s
                [100000,   1], // expected 81.49765300000001ms
                [5000000,  1], // expected 5034.370191ms
                [10000000, 1]  // expected 7504.152556999999ms
            ]
        } as PerformanceSuite,
        mutableQSortBy: {
            name: 'TS Mutable qsort',
            sortFn: TSQSort.mutableQSortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.006281435388007696ms :: total time = 4.4s
                // [1000,     50000],  // avg = 0.09221440418004058ms :: total time = 5.7s
                // [10000,    10000],  // avg = 2.397657678600072ms :: total time = 26.2s
                // [50000,    5000],   // avg = 41.94226541220003ms :: total time = 3m 36.6s
                [100000,   1], // expected 218.70696400000088ms
                // [5000000,  1], // max call stack?
                // [10000000, 1]
            ]
        } as PerformanceSuite,
        mutableTOQSortBy: {
            name: 'TS Mutable qsort TO',
            sortFn: TSQSort.mutableTOQSortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.005930607046007761ms :: total time = 4.2s
                // [1000,     50000],  // avg = 0.08635866791981738ms :: total time = 5.4s
                // [10000,    10000],  // avg = 2.259230091999797ms :: total time = 24.8s
                // [50000,    5000],   // avg = 41.27189204340059ms :: total time = 3m 33.1s
                [100000,   1],
                [5000000,  1],
                [10000000, 1]
            ]
        } as PerformanceSuite,
        iterativeQSortBy: {
            name: 'TS Iterative Mutable qsort',
            sortFn: TSQSort.iterativeQSortBy,
            cmp: TSQSort.cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.00854764542787918ms :: total time = 5.6s
                // [1000,     50000],  // avg = 0.09122519116003067ms :: total time = 5.8s
                // [10000,    10000],  // avg = 2.4369451034001424ms :: total time = 26.7s
                // [50000,    5000],   // avg = 42.765754255000736ms :: total time = 3m 40.8s
                [100000,   1],
                [5000000,  1],
                [10000000, 1]
            ]
        } as PerformanceSuite,
    },
    PS: {
        sortBy: {
            name: 'PS SortBy',
            sortFn: (cmp, arr) => PS["Data.Array"].sortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      500000], // avg = 0.03312913349399809ms :: total time = 17.9s
                [1000,     50000],  // avg = 0.5093360571800042ms :: total time = 26.7s
                [10000,    10000],  // avg = 6.005861303899992ms :: total time = 1m 2.4s
                [50000,    5000],   // avg = 32.100295705600324ms :: total time = 2m 47.3s
                [100000,   2500],   // avg = 75.41643207920212ms :: total time = 3m 16.1s
                [5000000,  1000],   // avg = 3683.310326197996ms :: total time = 1h 4m 31.1s
                [10000000, 500]     // avg = 7660.2936004839985ms :: total time = 1h 7m 5.2s
            ]
        } as PerformanceSuite,
        qsortBy: {
            name: 'PS Inmutable qsort',
            sortFn: (cmp, arr) => PS["QSort"].qsortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.09876919935212518ms :: total time = 50.8s
                // [1000,     50000],  // avg = 0.84463810898002ms :: total time = 43.5s
                // [10000,    10000],  // avg = 7.787293387600209ms :: total time = 1m 20.3s
                // [50000,    5000],   // avg = 41.89767043900089ms :: total time = 3m 36.9s
                [100000,   1],
                [5000000,  1],
                [10000000, 1]
            ]
        } as PerformanceSuite,
        mutableQSortBy: {
            name: 'PS Mutable qsort',
            sortFn: (cmp, arr) => PS["QSort"].mutableQSortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.22319740276203026ms :: total time = 1m 53.2s
                // [1000,     50000],  // avg = 4.715367079520635ms :: total time = 3m 57.2s
                // [10000,    10000],  // avg = 243.54070292590265ms :: total time = 40m 38.1s
                // [50000,    5000],   // avg = 6078.587318380225ms :: total time = 8h 26m 42.2s
                [100000,   1], // expected 25947.284059ms
                [5000000,  1], // Maximum call exceeded
                [10000000, 1]
            ]
        } as PerformanceSuite,
        mutableTOQSortBy: {
            name: 'PS Mutable qsort TO',
            sortFn: (cmp, arr) => PS["QSort"].mutableTOQSortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                // [100,      500000], // avg = 0.27565721434621515ms :: total time = 2m 19.9s
                // [1000,     50000],  // avg = 6.0142023343989255ms :: total time = 5m 2.4s
                // [10000,    10000],  // avg = 309.98827713219225ms :: total time = 51m 43s
                // [50000,    5000], // colgó acá
                [100000,   1],
                [5000000,  1],
                [10000000, 1]
            ]
        } as PerformanceSuite,
        iterativeQSortBy: {
            name: 'PS Iterative qsort',
            sortFn: (cmp, arr) => PS["QSort"].iterativeQSortBy(cmp)(arr),
            cmp: PS["QSort"].cmpNumberAsc,
            tests: [
                [100,      500000],
                [1000,     50000],
                [10000,    10000],
                [50000,    5000],
                [100000,   1],
                [5000000,  1],
                [10000000, 1]
            ]
        } as PerformanceSuite,
    }
}