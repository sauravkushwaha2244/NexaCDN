# 🚀 NexaCDN — Smart Content Delivery Network

> A full-stack CDN simulator built for hackathon demonstration featuring intelligent caching, load balancing, real-time analytics, and a live monitoring dashboard.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend Dashboard** | https://nexacdn-frontend.onrender.com |
| **CDN Backend** | https://nexacdn-2.onrender.com |
| **Origin Server 1** | https://nexacdn-origin.onrender.com |
| **Origin Server 2** | https://nexacdn-origin-2.onrender.com |

---

## 📌 What is NexaCDN?

NexaCDN is a **Content Delivery Network** simulation that demonstrates the core principles of how CDNs work in the real world:

- 🔁 **Reverse Proxy** — All client requests go through the CDN backend instead of hitting the origin directly
- ⚡ **Intelligent Caching** — Responses are stored in Redis and served instantly on repeat requests
- ⚖️ **Load Balancing** — Traffic is distributed across multiple origin servers using round-robin
- 📊 **Real-Time Analytics** — Live dashboard shows cache hits, misses, response times via WebSocket
- 🛡️ **Security** — Rate limiting, blocked user agents, API key authentication

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│              nexacdn-frontend.onrender.com                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP + WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  CDN BACKEND (Express.js)                   │
│               nexacdn-2.onrender.com                        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │Rate      │  │Security  │  │Compress  │  │Analytics  │  │
│  │Limiter   │  │Middleware│  │Middleware│  │+ Socket.IO│  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               Cache Layer                           │   │
│  │  ┌─────────────────┐   ┌──────────────────────┐    │   │
│  │  │  Redis Cache     │   │  In-Memory (LRU)     │    │   │
│  │  │  (Primary)       │   │  (Fallback)          │    │   │
│  │  └─────────────────┘   └──────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Load Balancer (Round Robin)               │   │
│  │         + Health Checker (every 10s)                │   │
│  └────────────────┬──────────────────┬─────────────────┘   │
└───────────────────│──────────────────│─────────────────────┘
                    │                  │
          ┌─────────▼───┐        ┌─────▼──────────┐
          │ Origin Srv 1│        │ Origin Server 2 │
          │  (Express)  │        │   (Express)     │
          │ :onrender   │        │  :onrender      │
          └─────────────┘        └─────────────────┘
```

---

## ⚡ How Caching Works

### Cache MISS (First Request)
```
Client → CDN → Check Redis → NOT FOUND → Forward to Origin Server
                                       → Store response in Redis (TTL: 300s)
                                       → Return response to client
                                         [Response Time: ~800-1500ms]
```

### Cache HIT (Repeat Request within 5 minutes)
```
Client → CDN → Check Redis → FOUND ✅ → Return cached response instantly
                                         [Response Time: ~2-5ms]
```

### Performance Comparison
| Scenario | Source | Response Time |
|---|---|---|
| Cache MISS | Origin Server | 800 – 1500 ms |
| Cache HIT | Redis | 2 – 5 ms |
| **Improvement** | **~300x faster** | ⚡ |

---

## 📁 Project Structure

```
NexaCDN/
│
├── cdn-project/                  # Core CDN system
│   ├── backend/                  # Express.js CDN server
│   │   └── src/
│   │       ├── server.js         # Entry point
│   │       ├── app.js            # Express app + middleware
│   │       ├── analytics/        # Request analytics tracker
│   │       ├── cache/            # Redis + Memory cache layer
│   │       │   ├── RedisCache.js
│   │       │   ├── MemoryCache.js
│   │       │   └── CacheManager.js
│   │       ├── compression/      # Response compression
│   │       ├── controllers/      # Proxy controller
│   │       ├── healthCheck/      # Origin server health checker
│   │       ├── loadBalancer/     # Round-robin load balancer
│   │       │   ├── LoadBalancer.js
│   │       │   └── OriginBalancer.js
│   │       ├── middleware/       # Rate limiter, logger, security
│   │       ├── routes/           # API routes
│   │       ├── security/         # Blocked user agents
│   │       ├── services/         # Business logic
│   │       └── websocket/        # Socket.IO real-time events
│   │
│   └── frontend/                 # React dashboard (Vite)
│       └── src/
│           ├── App.jsx           # Root with tab state
│           ├── socket.js         # Socket.IO client
│           └── components/
│               ├── Dashboard.jsx # Main dashboard (all tabs)
│               ├── Navbar.jsx    # Top navigation bar
│               ├── Sidebar.jsx   # Clickable tab navigation
│               ├── StatCard.jsx  # Metric display card
│               ├── ServerCard.jsx# Origin server status card
│               ├── CacheChart.jsx# Doughnut chart (hit/miss ratio)
│               ├── TrafficChart.jsx # Line chart (real traffic history)
│               └── RequestTable.jsx # Live request monitor table
│
├── origin-server/                # Origin Server 1 (Express)
│   ├── server.js
│   └── package.json
│
├── origin-server-2/              # Origin Server 2 (Express)
│   ├── server.js
│   └── package.json
│
└── README.md                     # This file
```

---

## 🔧 Tech Stack

### Backend (CDN Server)
| Technology | Purpose |
|---|---|
| **Node.js + Express.js v5** | HTTP server & routing |
| **Redis (ioredis)** | Primary cache store |
| **LRU Cache** | In-memory fallback cache |
| **Socket.IO** | Real-time analytics push |
| **Axios** | HTTP requests to origin servers |
| **express-rate-limit** | Rate limiting (DDoS protection) |
| **compression** | Gzip response compression |
| **morgan** | HTTP request logging |
| **dotenv** | Environment variable management |

### Frontend (Dashboard)
| Technology | Purpose |
|---|---|
| **React 19 + Vite** | UI framework & bundler |
| **Chart.js + react-chartjs-2** | Cache ratio & traffic charts |
| **Socket.IO Client** | Real-time WebSocket connection |

### Infrastructure
| Service | Provider |
|---|---|
| CDN Backend | Render Web Service |
| Origin Server 1 | Render Web Service |
| Origin Server 2 | Render Web Service |
| Frontend | Render Static Site |
| Redis | Render Managed Redis |

---

## 🛠️ Features

### 1. 🔄 Reverse Proxy
- All requests go through the CDN backend
- Transparently forwards requests to origin servers
- Returns origin response to client

### 2. ⚡ Two-Layer Cache System
- **Layer 1: Redis** — Persistent, shared cache across restarts
- **Layer 2: In-Memory LRU** — Ultra-fast fallback if Redis is unavailable
- **TTL: 300 seconds** (5 minutes) per cached response
- Cache key = request URL path

### 3. ⚖️ Smart Load Balancer
- **Round-Robin** algorithm distributes traffic evenly
- **Health Checker** pings servers every 10 seconds
- Automatically removes unhealthy servers from rotation
- **Failure tracking** — marks server as down after 3 consecutive failures
- **Auto-recovery** — retries downed servers after 10 seconds

### 4. 📊 Real-Time Analytics Dashboard
Four tabs with live data:

| Tab | Content |
|---|---|
| 📊 **Dashboard** | Hackathon demo panel + all metrics + charts + request table |
| 📈 **Analytics** | Full breakdown of all analytics metrics with charts |
| 🖥️ **Servers** | Live health status of each origin server with response times |
| 💾 **Cache** | Cache hit/miss breakdown, Redis status, flush button |

### 5. 🛡️ Security Features
- **Rate Limiting** — max requests per IP per window
- **Blocked User Agents** — blocks known bad bots/scrapers
- **API Key Authentication** — secured via env var
- **CORS** — whitelisted frontend origin only

### 6. 🗜️ Performance
- **Gzip Compression** — reduces response size
- **ETag Support** — browser-level caching
- **Cache-Control Headers** — proper HTTP caching headers

---

## 🚀 Hackathon Demo Mode

The dashboard includes a built-in demo panel for live presentations:

### Steps:
1. Open **https://nexacdn-frontend.onrender.com**
2. Click **`▶ Run Demo (HIT + MISS)`**
3. Watch the demo automatically:

```
Step 1 — Cache cleared (Redis flushed)

━━━━━  SCENARIO 1: Cache MISS  ━━━━━
❌ Request #1: CACHE MISS — fetched from origin (1200ms)

━━━━━  SCENARIO 2: Cache HITs  ━━━━━
✅ Request #2: CACHE HIT (3ms)
✅ Request #3: CACHE HIT (2ms)
✅ Request #4: CACHE HIT (2ms)
✅ Request #5: CACHE HIT (4ms)

🎉 Demo complete!
```

The **animated badge** switches between red (MISS) and green (HIT) in real time.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/proxy/data` | Main CDN proxy — returns cached or origin data |
| `GET` | `/analytics` | Get all analytics stats (JSON) |
| `GET` | `/servers` | Get health status of all origin servers |
| `POST` | `/cache/clear` | Flush all Redis cache (demo tool) |

### Example Responses

**GET `/proxy/data` — Cache MISS:**
```json
{
  "source": "origin",
  "originServer": "https://nexacdn-origin.onrender.com",
  "data": {
    "server": "Origin Server 1",
    "content": "Data from Origin Server 1",
    "time": "2026-08-04T17:00:00.000Z"
  }
}
```

**GET `/proxy/data` — Cache HIT:**
```json
{
  "source": "cache",
  "data": {
    "server": "Origin Server 1",
    "content": "Data from Origin Server 1",
    "time": "2026-08-04T17:00:00.000Z"
  }
}
```

**GET `/analytics`:**
```json
{
  "totalRequests": 27,
  "cacheHits": 26,
  "cacheMiss": 1,
  "originRequests": 1,
  "averageResponseTime": "4.30",
  "trafficHistory": [...]
}
```

**GET `/servers`:**
```json
[
  { "url": "https://nexacdn-origin.onrender.com",   "healthy": true,  "responseTime": 312 },
  { "url": "https://nexacdn-origin-2.onrender.com", "healthy": true,  "responseTime": 289 }
]
```

---

## ⚙️ Environment Variables

### CDN Backend (`cdn-project/backend/.env`)
```env
PORT=5000
ORIGIN_SERVERS=https://nexacdn-origin.onrender.com,https://nexacdn-origin-2.onrender.com
REDIS_HOST=<your-render-redis-host>
REDIS_PORT=6379
REDIS_URL=redis://<your-render-redis-host>:6379
FRONTEND_URL=https://nexacdn-frontend.onrender.com
CACHE_TTL=60
COMPRESSION=true
CACHE_CONTROL=true
ETAG=true
API_KEY=nexacdn-secret-key
NODE_ENV=production
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=https://nexacdn-2.onrender.com
```

---

## 🖥️ Running Locally

### Prerequisites
- Node.js 18+
- Redis running locally (`redis-server`)

### 1. Start Origin Server 1
```bash
cd origin-server
npm install
npm start
# Runs on http://localhost:8000
```

### 2. Start Origin Server 2
```bash
cd origin-server-2
npm install
npm start
# Runs on http://localhost:9000
```

### 3. Start CDN Backend
```bash
cd cdn-project/backend
npm install
# Create .env with local values
npm run dev
# Runs on http://localhost:5000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 📦 Deployment on Render

| Service | Type | Root Dir | Build | Start |
|---|---|---|---|---|
| CDN Backend | Web Service | `cdn-project/backend` | `npm ci --only=production` | `node src/server.js` |
| Origin Server 1 | Web Service | `origin-server` | `npm install` | `node server.js` |
| Origin Server 2 | Web Service | `origin-server-2` | `npm install` | `node server.js` |
| Frontend | Static Site | `frontend` | `npm install && npm run build` | — |
| Redis | Managed Redis | — | — | — |

---

## 👨‍💻 Author

**Saurav Kushwaha**
Built for Hackathon — August 2026

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
