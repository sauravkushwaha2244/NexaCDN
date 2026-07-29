const origins = [
    "http://localhost:8000",
    "http://localhost:9000"
];

let current = 0;

// Track failures so we don't keep hammering a dead origin
const failCount = {};
origins.forEach(o => failCount[o] = 0);

const MAX_FAILS = 3;       // after 3 failures, mark as down
const RETRY_AFTER_MS = 10000; // try again after 10s
const downSince = {};

function isHealthy(origin) {
    if (failCount[origin] < MAX_FAILS) return true;
    // allow retry after cooldown
    return Date.now() - downSince[origin] > RETRY_AFTER_MS;
}

function getOrigin() {
    for (let i = 0; i < origins.length; i++) {
        const origin = origins[current];
        current = (current + 1) % origins.length;
        if (isHealthy(origin)) return origin;
    }
    // all origins unhealthy — return one anyway, let the caller fail properly
    return origins[current];
}

function reportSuccess(origin) {
    failCount[origin] = 0;
}

function reportFailure(origin) {
    failCount[origin]++;
    if (failCount[origin] >= MAX_FAILS) downSince[origin] = Date.now();
}

export default getOrigin;
export { reportSuccess, reportFailure };