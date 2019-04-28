import {performanceSuite} from './performance/performance-test';
import {suites} from './performance/suites';

// performanceSuite(suites.TS.nativeSort);
performanceSuite(suites.TS.qsortBy);
performanceSuite(suites.TS.mutableQSortBy);
performanceSuite(suites.TS.mutableTOQSortBy);
performanceSuite(suites.TS.iterativeQSortBy);
// performanceSuite(suites.PS.sortBy);
performanceSuite(suites.PS.qsortBy);
performanceSuite(suites.PS.mutableQSortBy);
performanceSuite(suites.PS.mutableTOQSortBy);
performanceSuite(suites.PS.iterativeQSortBy);