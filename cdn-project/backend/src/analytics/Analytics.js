
import { sendAnalytics } from "../websocket/socket.js";

class Analytics {

    constructor() {
        this.totalRequests    = 0;
        this.cacheHits        = 0;
        this.cacheMiss        = 0;
        this.originRequests   = 0;
        this.responseTimes    = [];
        this.trafficHistory   = [];   // [{time, requests, hits, misses}]
        this._lastSnapshot    = 0;
    }

    _snapshot() {
        const now = Date.now();
        if (now - this._lastSnapshot > 5000) {   // every 5s
            this.trafficHistory.push({
                time:     new Date().toLocaleTimeString(),
                requests: this.totalRequests,
                hits:     this.cacheHits,
                misses:   this.cacheMiss
            });
            if (this.trafficHistory.length > 10)
                this.trafficHistory.shift();
            this._lastSnapshot = now;
        }
    }

    request()  { this.totalRequests++;  this._snapshot(); sendAnalytics(this.getStats()); }
    hit()      { this.cacheHits++;      this._snapshot(); sendAnalytics(this.getStats()); }
    miss()     { this.cacheMiss++;      this._snapshot(); sendAnalytics(this.getStats()); }
    origin()   { this.originRequests++; this._snapshot(); sendAnalytics(this.getStats()); }

    responseTime(time) { this.responseTimes.push(time); }

    getStats() {
        const avg = this.responseTimes.length
            ? (this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length).toFixed(2)
            : 0;

        return {
            totalRequests:       this.totalRequests,
            cacheHits:           this.cacheHits,
            cacheMiss:           this.cacheMiss,
            originRequests:      this.originRequests,
            averageResponseTime: avg,
            trafficHistory:      this.trafficHistory
        };
    }
}

export default new Analytics();