
/**
 * Recursive inmutable implementation of the Quick Sort algorithm fixed for numbers
 * @param arr The array to sort
 * @returns The sorted array
 */
function qsort (arr: ReadonlyArray<number>): ReadonlyArray<number> {
    if (arr.length === 0) {
        return [];
    }

    const [head, ...tail] = arr;

    const small = tail.filter(x => x <  head);
    const mid   = tail.filter(x => x == head);
    const large = tail.filter(x => x >  head);
    return [...qsort(small), ...mid, head, ...qsort(large)];
}

/**
 *
 * @param cmp
 * @param arr
 */
function qsortBy <T>(cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
    if (arr.length === 0) {
        return [];
    }

    const [head, ...tail] = arr;

    const small = tail.filter(x => cmp(x, head) == 'LT');
    const mid   = tail.filter(x => cmp(x, head) == 'EQ');
    const large = tail.filter(x => cmp(x, head) == 'GT');
    return [...qsortBy(cmp, small), ...mid, head, ...qsortBy(cmp, large)];
}

function mutableQSortBy<T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
    function swap(arr: Array<T>, i: number, j: number) {
        const temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    function partition(maxLeft: number, minRight: number, arr: Array<T>): number {
        let iPivot = maxLeft;
        let iLeft = maxLeft;
        let iRight = minRight;

        while (iRight > iLeft) {
            if (iPivot === iLeft) {
                const comparison = cmp(arr[iPivot], arr[iRight]);
                if (comparison === 'LT' || comparison === 'EQ') {
                    iRight--;
                } else {
                    swap(arr, iPivot, iRight);
                    iPivot = iRight;
                }
            } else {
                const comparison = cmp(arr[iPivot], arr[iLeft]);
                if (comparison === 'GT' || comparison === 'EQ') {
                    iLeft++;
                } else {
                    swap(arr, iPivot, iLeft);
                    iPivot = iLeft;
                }
            }
        }
        return iPivot;
    }
    function sort(maxLeft: number, minRight: number, arr: Array<T>): Array<T> {
        if (minRight - maxLeft <= 1) {
            return arr;
        }

        const iPivot = partition(maxLeft, minRight, arr);

        sort(maxLeft, iPivot - 1, arr);
        sort(iPivot + 1, minRight, arr);
        return arr;
    }

    return sort(0, arr.length - 1, arr.slice(0));
}

/**
 * QSort algorithm with mutable array and Tail Call Optimization
 */
function mutableTOQSortBy<T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
    function swap(arr: Array<T>, i: number, j: number) {
        const temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    function partition(maxLeft: number, minRight: number, arr: Array<T>): number {
        let iPivot = maxLeft;
        let iLeft = maxLeft;
        let iRight = minRight;

        while (iRight > iLeft) {
            if (iPivot === iLeft) {
                const comparison = cmp(arr[iPivot], arr[iRight]);
                if (comparison === 'LT' || comparison === 'EQ') {
                    iRight--;
                } else {
                    swap(arr, iPivot, iRight);
                    iPivot = iRight;
                }
            } else {
                const comparison = cmp(arr[iPivot], arr[iLeft]);
                if (comparison === 'GT' || comparison === 'EQ') {
                    iLeft++;
                } else {
                    swap(arr, iPivot, iLeft);
                    iPivot = iLeft;
                }
            }
        }
        return iPivot;
    }

    function sort(maxLeft: number, minRight: number, arr: Array<T>): Array<T> {
        let iLeft = maxLeft;
        let iRight = minRight;
        while (iLeft < iRight) {
            const iPivot = partition(iLeft, minRight, arr);
             // If left part is smaller, then recur for left
            // part and handle right part iteratively
            if (iPivot - iLeft < iRight - iPivot) {
                sort(iLeft, iPivot - 1, arr);
                iLeft = iPivot + 1;
            }
            // Else recur for right part
            else {
                sort(iPivot + 1, iRight, arr);
                iRight = iPivot - 1;
            }
        }
        return arr;

    }

    return sort(0, arr.length - 1, arr.slice(0));
}

type Ordering = 'LT' | 'GT' | 'EQ';
type CmpFunction<T> = (a: T, b: T) => Ordering;
type SortFunction <T>= (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>) => ReadonlyArray<T>;



// console.log(qsort([1, 2, 3, -1]))

function cmpNumberAsc (a: number, b: number): Ordering {
    return a < b ? 'LT'
        : a == b ? 'EQ'
        : 'GT'
}

function cmpNumberDesc (a: number, b: number): Ordering {
    return a > b ? 'LT'
        : a == b ? 'GT'
        : 'EQ'
}

// console.log(qsortBy(cmpNumberDesc, [1, 2, 3, -1]))


function createRandomArray(n: number) {
    const result = new Array(n);
    for (let i=0; i<n; i++) {
        result[i] = Math.round(Math.random() * 100);
    }
    return result;
}


function performanceTest(arrayLength: number, samples: number, name: string, sortFn: SortFunction<number>, cmp: CmpFunction<number>) {
    // perform the test many times (samples times) and get the average duration
    function getAvgDuration(startMark: string, endMark: string) {
        for (let i = 0; i < samples ; i++) {
            const arr = createRandomArray(arrayLength);

            performance.mark(startMark);
            sortFn(cmp, arr);
            performance.mark(endMark);
            performance.measure(name, startMark, endMark);
        }
        const measures = performance.getEntriesByName(name);
        const sum = measures
            .map(entry => entry.duration)
            .reduce((accu, duration) => accu + duration, 0)
        ;
        return sum / samples;
    }

    performance.mark('Performance test start');
    const avg = getAvgDuration(`${name} - start`, `${name} - end`);
    performance.mark('Performance test end');
    performance.measure('Total time', 'Performance test start', 'Performance test end');
    const totalTime = performance.getEntriesByName('Total time')[0].duration;

    console.log(`${name} :: N ${arrayLength} :: avg = ${avg}ms :: total time = ${totalTime}ms`);

    performance.clearMarks();
    performance.clearMeasures();
}
