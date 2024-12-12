class MemData {
    constructor(alloc, sys) {
        this.alloc = alloc;
        this.sys = sys;
    }
}

class Summary {
    constructor(duration, alloc, sys) {
        this.duration = duration;
        this.alloc = alloc;
        this.sys = sys;
    }

    toString() {
        return `{ "Duration":${this.duration}, "Alloc":${this.alloc}, "Sys":${this.sys} }`;
    }
}

main();

function main() {
    const times = 7;
    const res = new Array(times);
    const resMem = new Array(times);
    const n = 10 * 1000 * 1000;
    const [_, v] = singleRun(n);
    console.log(`Sieve Primes (${formatWithUnderscore(n)}): ${formatWithUnderscore(v)}`);

    for (let i = 0; i < times; i++) {
        res[i] = singleRun(n)[0];
        console.log(res[i]);
        resMem[i] = printMemUsage();
    }

    const avg = res.reduce((a, b) => a + b, 0) / times;
    const avgMem = resMem.reduce(
        (a, b) => new MemData(a.alloc + b.alloc, a.sys + b.sys),
        new MemData(0, 0));
    avgMem.alloc /= times;
    avgMem.sys /= times;
    const summary = new Summary(avg, avgMem.alloc, avgMem.sys);
    console.log(summary.toString());
}

function singleRun(n) {
    const start = Date.now();
    const primes = sievePrimes(n);
    const d = Date.now() - start;
    const l = primes.length;
    const last = primes[l - 1];
    return [d, last];
}

function formatWithUnderscore(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
}

function sievePrimes(n) {
    const flag = new Array(n + 1);
    for (let i = 2; i * i <= n; i++) {
        if (!flag[i]) {
            for (let j = i * i; j <= n; j += i) {
                flag[j] = true;
            }
        }
    }
    const primes = [];
    for (let i = 2; i <= n; i++) {
        if (!flag[i]) {
            primes.push(i);
        }
    }
    return primes;
}

function printMemUsage() {
    if (typeof process !== 'undefined' && typeof process.memoryUsage !== 'undefined') {
        const memoryUsage = process.memoryUsage();
        console.log(`Alloc = ${bToMb(memoryUsage.heapUsed)} MiB\tSys = ${bToMb(memoryUsage.rss)} MiB`);
        return new MemData(memoryUsage.heapUsed, memoryUsage.rss);
    }
    if (typeof performance !== 'undefined' && typeof performance.memory !== 'undefined') {
        const memoryUsage = performance.memory;
        console.log(`Alloc = ${bToMb(memoryUsage.usedJSHeapSize)} MiB\tSys = ${bToMb(memoryUsage.totalJSHeapSize)} MiB`);
        return new MemData(memoryUsage.usedJSHeapSize, memoryUsage.totalJSHeapSize);
    }
    console.log(`Alloc = 0 MiB\tSys = 0 MiB`);
    return new MemData(0, 0);
}

function bToMb(b) {
    return (b / 1024 / 1024).toFixed(0);
}

