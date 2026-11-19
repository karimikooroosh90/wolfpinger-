# WOLFPINGER

Free-tier hybrid network diagnostics starter for all-game users.

## Current features
- Phone/browser-to-Render HTTP round-trip measurement.
- Render outbound TCP connection probes to a small fixed allowlist.
- Health endpoint and responsive Persian dashboard.
- No database, paid API, VPN, or packet tunnel.

## Important limitations
This does not modify game traffic and does not promise lower in-game ping. Browser HTTP RTT is not ICMP ping or game-server latency. Server probes measure from Render's datacenter, not from the player's device. Render free web services can sleep after inactivity; cold starts can add delay. This app is a diagnostic dashboard, not a UDP relay or VPN.

## Deploy to Render
1. Push this repository to a GitHub repository.
2. In Render, create a new Blueprint and select the repository containing `render.yaml`.
3. Review the plan and confirm the `wolfpinger` web service uses the Free plan and Frankfurt region.
4. Deploy. Health check: `/api/health`.

## Local run
```bash
npm install
npm start
```
Open http://localhost:10000
