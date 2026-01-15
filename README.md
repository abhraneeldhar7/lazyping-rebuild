# LazyPing 🛰️

![LazyPing Open Graph Image](/app/opengraph-image.png)

LazyPing is a high-performance, real-time server monitoring and uptime detection platform. It allows users to track their project's health, monitor latency, and receive alerts when services are down or degraded.

## 🚀 Features

- **Project Management**: Organize your endpoints by projects.
- **Uptime Monitoring**: Continuous pinging of endpoints at custom intervals.
- **Detailed Analytics**:
    - **Bar Chart Uptime**: 24-hour status visualization (Up, Down, Degraded).
    - **Latency Charts**: Interactive area charts showing response times over time.
- **Incident Detection**: Automatic detection of Major Outages, Partial Outages, and Performance Degradation.
- **Public Status Pages**: Share your service's health with your users via customizable public pages.
- **Smart Alerting**: On-screen alerts with client-side dismissal logic (persisted via `localStorage`).
- **Dashboard Overview**: Quick view of all projects, recent logs, and active alerts.
- **JSON Export**: Export project data and logs for external analysis.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Language**: TypeScript
- **Database**: MongoDB (User data, Projects, Endpoints, Logs)
- **Caching/Queue**: Redis (Upstash) - High-speed caching and set operations
- **Authentication**: [Clerk](https://clerk.com/)
- **UI Components**: Radix UI + Tailwind CSS (Shadcn UI base)
- **Animation**: Framer Motion / Motion
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js / Bun
- MongoDB Atlas account
- Clerk account
- Redis (Upstash) account

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhraneeldhar7/lazyping-rebuild.git
   cd lazyping
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=

   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

   # Cron/System
   HUB_CRON_SECRET=
   ```

4. **Run the development server:**
   ```bash
   bun dev
   ```

## 🏗️ Architecture

LazyPing uses a hybrid approach for data management:
- **MongoDB**: The primary source of truth for persistent data.
- **Redis Cache**: Heavily utilized for fast dashboard reads, project sets, and endpoint details to minimize database load.
- **Clerk Webhooks**: Synchronizes user creation and provides metadata-based onboarding flows.

---

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀
⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀
⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀
⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀
⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢋⡉⠀⠀⠀
⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣆⠀⠀
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀
⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⣿⣿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
