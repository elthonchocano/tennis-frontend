# Tennis League Manager Frontend App

A modern, highly responsive, and high-performance user interface built with **React**, **TypeScript**, and **Vite**. This single-page application (SPA) serves as the control panel for players and administrators of the Tennis League, featuring real-time tournament brackets, matchmaking stats, and secure profile management.

## 🚀 Architectural & UX Features

* **Lightning-Fast Bundling:** Powered by **Vite** for near-instantaneous Hot Module Replacement (HMR) during development and heavily optimized production builds.
* **Global Content Delivery (CDN):** Hosted serverless on **AWS S3** and distributed worldwide via **AWS CloudFront** to guarantee sub-millisecond asset loading and native HTTPS termination.
* **Secure Enterprise Authentication:** Native integration with **AWS Cognito Hosted UI** and Google OAuth 2.0 Client Federation for seamless, secure social sign-in.
* **Strict Type Safety:** Fully typed with **TypeScript** to ensure codebase maintainability, clean data structures, and fewer runtime exceptions.

---

## 🛠️ Tech Stack & Dependencies

* **Core Framework:** React 18+ (Functional Components & Hooks)
* **Build Tool:** Vite
* **Language:** TypeScript
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS (or your preferred styling engine)
* **State Management:** Context API / Axios for API orchestration

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**

### 1. Install Dependencies
Clone the repository, navigate to the root directory, and install the required node modules:

```bash
npm install
```

### 2. Configure Environment Variables
Create a .env file in the root directory to map your local context to the backend API and auth gateways:

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_COGNITO_DOMAIN=your-cognito-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your_aws_client_id
VITE_REDIRECT_URI=http://localhost:5173
```

### 3. Run the Development Server
Launch the local Vite server:

```bash
npm run dev
```

Open your browser and navigate to http://localhost:5173 to view the app.

---

## 📦 Production Compiles & Hosting Architecture

### Manual Production Build
To test the bundling engine locally and generate the production assets inside the `dist/` directory, run:

```bash
npm run build
```

## 🤖 CI/CD Edge Automation

This repository incorporates zero-touch deployment using AWS CodePipeline coupled with AWS CodeBuild.

```bash
[ Git Push to main ] ➔ [ GitHub Webhook ] ➔ [ AWS CodeBuild (Vite Build) ] ➔ [ Sync to S3 + Invalidate CloudFront ]
```

1. Any push or pull-request merge into the main branch immediately notifies AWS.

2. AWS CodeBuild spins up a Node.js container, installs dependencies, and compiles the optimized build (npm run build).

3. The resulting static assets inside dist/ are automatically synced into the target private AWS S3 Bucket.

4. A CloudFront cache invalidation request is dynamically triggered to ensure global users instantly receive the newest web version without caching delays.

