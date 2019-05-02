import {performanceSuite, time} from './performance/performance-test';
import {suites} from './performance/suites';
import pretty from 'pretty-ms';

const allTests = time(() => {
    performanceSuite(suites.TS.qsortBy);
    performanceSuite(suites.TS.mutableQSortBy); // Max call stack
    performanceSuite(suites.TS.mutableTOQSortBy);
    performanceSuite(suites.TS.iterativeQSortBy);
    performanceSuite(suites.PS.sortBy);
    performanceSuite(suites.PS.qsortBy);
    performanceSuite(suites.PS.mutableQSortBy); // Max call stack
    performanceSuite(suites.PS.mutableTOQSortBy);
    performanceSuite(suites.PS.iterativeQSortBy);
});

console.log(`Total test time ${pretty(allTests.duration)}`);