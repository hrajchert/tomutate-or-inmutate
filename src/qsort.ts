
/**
 * Recursive inmutable implementation of the Quick Sort algorithm fixed for numbers
 * @param arr The array to sort
 * @returns The sorted array
 */
export function qsort (arr: ReadonlyArray<number>): ReadonlyArray<number> {
    if (arr.length === 0) {
        return [];
    }

    const [head, ...tail] = arr;

    const small = tail.filter(x => x <  head);
    const mid   = tail.filter(x => x == head);
    const large = tail.filter(x => x >  head);
    return [...qsort(small), ...mid, head, ...qsort(large)];
}

export type Ordering = 'LT' | 'GT' | 'EQ';

export function cmpNumberAsc (a: number, b: number): Ordering {
    return a < b ? 'LT'
        : a == b ? 'EQ'
        : 'GT'
}

export function cmpNumberDesc (a: number, b: number): Ordering {
    return a > b ? 'LT'
        : a == b ? 'GT'
        : 'EQ'
}

/**
 *
 * @param cmp
 * @param arr
 */
export function qsortBy <T>(cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
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
    // Create a mutable reference to the smaller item
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
export function mutableQSortBy<T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
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
export function mutableTOQSortBy<T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {

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
export function iterativeQSortBy <T> (cmp: (a: T, b: T) => Ordering, arr: ReadonlyArray<T>): ReadonlyArray<T> {
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






