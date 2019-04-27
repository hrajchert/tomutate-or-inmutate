
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

function swap<T>(i: number, j: number, arr: Array<T>) {
    const temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
}

function partition<T>(low: number, high: number, cmp: (a: T, b: T) => Ordering, arr: Array<T>): number {
    // Select the pivot
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        // If current element is smaller than or
        // equal to pivot
        const comparison = cmp(arr[j], pivot);
        if (comparison === 'LT' || comparison === 'EQ') {
            // increment index of smaller element and swap
            i++;
            swap(i, j, arr);
        }
    }
    // Finally swap the pivot
    swap(i + 1, high, arr);
    // And return it's position
    return (i + 1);
}

/**
 * reference: https://www.geeksforgeeks.org/quick-sort/
 */
function mutableQSortBy<T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
    function sort(low: number, high: number, arr: Array<T>): Array<T> {
        if (low >= high) {
            return arr;
        }

        const pivot = partition(low, high, cmp, arr);

        sort(low, pivot - 1, arr);
        sort(pivot + 1, high, arr);
        return arr;
    }

    return sort(0, arr.length - 1, arr.slice(0));
}

/**
 * QSort algorithm with mutable array and Tail Call Optimization
 * reference: https://www.geeksforgeeks.org/quicksort-tail-call-optimization-reducing-worst-case-space-log-n/
 */
function mutableTOQSortBy<T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {

    function sort(low: number, high: number, arr: Array<T>): Array<T> {
        while (low < high) {
            const iPivot = partition(low, high, cmp, arr);
            // If left part is smaller, then recur for left
            // part and handle right part iteratively
            if (iPivot - low < high - iPivot) {
                sort(low, iPivot - 1, arr);
                low = iPivot + 1;
            }
            // Else recur for right part
            else {
                sort(iPivot + 1, high, arr);
                high = iPivot - 1;
            }
        }
        return arr;

    }

    return sort(0, arr.length - 1, arr.slice(0));
}

/**
 * ref: https://www.geeksforgeeks.org/iterative-quick-sort/
 */
function iterativeQSortBy <T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
    function sort(low: number, high: number, arr: Array<T>) {
        // Create an auxiliary stack
        const stack = new Array(high - low + 1);

        // initialize top of stack
        let top = -1;

        // push initial values of low and high to stack
        stack[ ++top ] = low;
        stack[ ++top ] = high;

        // Keep popping from stack while is not empty
        while ( top >= 0 ) {
            // Pop high and low
            high = stack[ top-- ];
            low = stack[ top-- ];

            // Set pivot element at its correct position
            // in sorted array
            const pivot = partition(low, high, cmp, arr);

            // If there are elements on left side of pivot,
            // then push left side to stack
            if ( pivot - 1 > low ) {
                stack[ ++top ] = low;
                stack[ ++top ] = pivot - 1;
            }

            // If there are elements on right side of pivot,
            // then push right side to stack
            if ( pivot + 1 < high ) {
                stack[ ++top ] = pivot + 1;
                stack[ ++top ] = high;
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

function quickTest(arrayLength: number, sortFn: SortFunction<number>, cmpAsc: CmpFunction<number>) {
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

function beep() {
    const vol = 999;
    const freq = 220;
    const duration = 300;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const u = ctx.createGain();
    osc.connect(u);
    osc.frequency.value=freq
    osc.type="square"
    u.connect(ctx.destination)
    u.gain.value=vol*0.01
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime+duration*0.001)
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
    beep();
}
