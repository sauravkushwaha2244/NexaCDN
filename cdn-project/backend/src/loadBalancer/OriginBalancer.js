const origins = [
    "http://localhost:8000",
    "http://localhost:9000"
];

let current = 0;
const failCount = {};
origins.forEach(o => failCount[o] = 0);

const MAX_FAILS = 3;
const RETRY_AFTER_MS = 10000;
const downSince = {};

function isHealthy(origin) {
    if (failCount[origin] < MAX_FAILS) return true;
    return Date.now() - downSince[origin] > RETRY_AFTER_MS;
}

function getOrigin() {
    for (let i = 0; i < origins.length; i++) {
        const origin = origins[current];
        current = (current + 1) % origins.length;
        if (isHealthy(origin)) return origin;
    }
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