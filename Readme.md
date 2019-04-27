# To mutate or inmutate
This repository holds the examples for the blog with the same name.

To build the examples you need to have installed bower and pulp.

```
$ bower install
$ npm install
$ tsc
$ pulp build --to dist/ps.js
```

The performance test is very manual. I could eventually use something like Benchmark.js and the purescript-benchmark port, but the performance was not the main point of the article so I didn't want to invest too much time there.

To run the performance test you need to use an environment that has the `performance` API available, for example a modern browser. I first build the code, paste the js output in a chrome snippet, execute it and then run the performance as following

```
const nativeSort = (cmp, arr) => arr.sort(cmp);
const psMutableQSortBy = (cmp, arr) => PS["QSort"].mutableQSortBy(cmp)(arr);
const psMutableTOQSortBy = (cmp, arr) => PS["QSort"].mutableTOQSortBy(cmp)(arr);
const psQSortBy = (cmp, arr) => PS["QSort"].qsortBy(cmp)(arr);
const psSortBy = (cmp, arr) => PS["Data.Array"].sortBy(cmp)(arr);


performanceTest(100, 5000, "Native Sort", nativeSort, (a, b) => a - b);
performanceTest(100, 5000, "TS Inmutable qsort", qsortBy, cmpNumberAsc);
performanceTest(100, 5000, "TS Mutable qsort", mutableQSortBy, cmpNumberAsc);
performanceTest(100, 5000, "TS Mutable qsort TO", mutableTOQSortBy, cmpNumberAsc);
performanceTest(100, 5000, "PS sortBy", psSortBy, PS["QSort"].cmpNumberAsc);
performanceTest(100, 5000, "PS Mutable qsort", psMutableQSortBy, PS["QSort"].cmpNumberAsc);
performanceTest(100, 5000, "PS Inmutable qsort", psQSortBy, PS["QSort"].cmpNumberAsc);
```
