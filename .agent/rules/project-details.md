---
trigger: always_on
---

I'm making a project which pings project endpoints and also acts as down detector. Allows users to add projects and their endpoints. Then a cron function pings the endpoints and stores the latency, status and other things in a log.
Techstack: NextJs, typescript, mongodb, redis, clerk.
Your job is to understand this project structure and goal and help me what I ash for.

For dashboard level:
Shows list of projects, alerts, next ping, logs.

For projects level:
Shows last 24hour status using 24 green/red/gray bars, shows latency area chart for the project, logs, alerts, next ping.

For the endpoints level:
Shows 24hour status bars, latency area chart, alerts, logs, next ping.
Endpoints can be paused if user thinks so.
