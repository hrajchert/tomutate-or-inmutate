import {performanceSuite} from './performance/performance-test';
import {suites} from './performance/suites';

performanceSuite(suites.TS.nativeSort);
performanceSuite(suites.PS.sortBy);