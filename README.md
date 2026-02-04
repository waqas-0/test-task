# Restaurant Offers API - Developer Qualification Test

## Overview

This is a mini full-stack application that manages restaurant offers with a Node.js backend (proper structure) and a React frontend with Axios. The system includes an "AI toggle" feature that demonstrates architectural thinking for future ML integration.

**Important:** The AI toggle is a **logic stub**, not actual machine learning. As per the requirements: *"This is not ML — it's a logic stub to prove architectural thinking."*

## Project Structure

```
/
├── backend/                    # Node.js Backend
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   ├── routes/                # API routes
│   │   └── offerRoutes.js     # Offer endpoints
│   ├── controllers/           # Request handlers
│   │   └── offerController.js # Offer controller
│   ├── services/              # Business logic
│   │   └── offerService.js    # Offer service
│   └── data/                  # JSON file storage
│       └── offers.json        # Offers data file
│
├── frontend/                   # React Frontend
│   ├── package.json           # Frontend dependencies
│   ├── public/                # Static files
│   │   └── index.html
│   └── src/                   # React source code
│       ├── index.js           # React entry point
│       ├── index.css          # Global styles
│       ├── App.js             # Main App component
│       └── App.css            # App styles
│
└── README.md                   # This file
```

## How to Run Locally

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Quick Start (Recommended - Run Both Projects with One Command)

**Step 1: Install all dependencies**
```bash
npm run install:all
```

**Step 2: Start both backend and frontend**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:2323`
- React app on `http://localhost:3001` (or next available port)

### Manual Setup (Alternative)

If you prefer to run projects separately:

**Step 1: Install Backend Dependencies**

```bash
cd backend
npm install
```

**Step 2: Start the Backend Server**

**For development (with auto-reload):**
```bash
npm run dev
```

**For production:**
```bash
npm start
```

The backend server will start on `http://localhost:2323`

**Note:** `npm run dev` uses nodemon which automatically restarts the server when you make code changes.

**Step 3: Install Frontend Dependencies**

Open a new terminal window:

```bash
cd frontend
npm install
```

**Step 4: Start the Frontend Development Server**

```bash
npm start
```

The React app will start on `http://localhost:3001` (or another port if 3001 is taken) and automatically open in your browser.

### Root-Level Commands

From the root directory, you can use:

- `npm run install:all` - Install dependencies for root, backend, and frontend
- `npm run dev` - Start both backend and frontend in development mode
- `npm start` - Start both backend and frontend in production mode
- `npm run dev:backend` - Start only backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run start:backend` - Start only backend in production mode
- `npm run start:frontend` - Start only frontend
- `npm run build` - Build frontend for production

### Step 5: Test the API

You can test the API using curl or any HTTP client:

**Create an offer:**
```bash
curl -X POST http://localhost:2323/api/offers \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_name": "Pizza Palace",
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T22:00:00Z",
    "discount_percent": 20
  }'
```

**Get all active offers:**
```bash
curl http://localhost:2323/api/offers
```

**Get offers with smart recommendations:**
```bash
curl http://localhost:2323/api/offers?enable_smart_recommendations=true
```

## Architecture Explanation

### Backend Structure (Node.js)

The backend follows a proper MVC-like structure:

- **server.js**: Entry point, sets up Express server and middleware
- **routes/**: Define API endpoints and route requests to controllers
- **controllers/**: Handle HTTP requests/responses, validation, error handling
- **services/**: Contain business logic and data operations
- **data/**: JSON file storage for persistence (`offers.json`)

**Data Storage:**
- Uses a JSON file (`backend/data/offers.json`) instead of a database
- Data persists between server restarts
- Automatically creates the file and directory if they don't exist
- All offers are stored in a simple JSON array format

This separation of concerns makes the code:
- **Maintainable**: Easy to find and modify specific functionality
- **Testable**: Each layer can be tested independently
- **Scalable**: Easy to add new features without affecting existing code
- **Simple**: No database setup required - perfect for a demo/qualification test

### Frontend Structure (React)

The frontend is built with React and uses Axios for API calls:

- **App.js**: Main component that manages state and renders the UI
- **Axios**: Used for making HTTP requests to the backend API
- **State Management**: Uses React hooks (useState, useEffect) for state management
- **Auto-refresh**: Automatically refreshes offers every 30 seconds

### AI Toggle Implementation (Logic Stub)

**Important:** This is NOT actual machine learning. It is a **logic stub** designed to prove architectural thinking and demonstrate how a toggle pattern would work in a real ML system.

The `enable_smart_recommendations` toggle is implemented as a query parameter on the GET /api/offers endpoint:

**When disabled (default):**
- Offers are sorted by creation time (most recent first)
- This represents the baseline ordering

**When enabled (logic stub):**
- Offers are sorted by discount percentage (highest first)
- This is a simple example of "different sorting" - NOT real ML
- In production, this would call an ML service that considers multiple factors (user preferences, location, historical data, etc.)

## Where the AI Toggle Would Plug Into a Real ML System

### Current Implementation (Logic Stub - NOT Real ML)

**This is a logic stub, not actual machine learning.** The purpose is to demonstrate architectural thinking by showing:

1. **How a toggle pattern works** - The toggle controls behavior without changing the API structure
2. **Where ML would integrate** - The code structure makes it clear where real ML would be added
3. **Architectural separation** - Business logic is separated, making ML integration straightforward

Currently, the toggle simply changes the sorting algorithm:
- **Disabled**: Sort by `created_at` (chronological) - baseline behavior
- **Enabled**: Sort by `discount_percent` (value-based) - simple example of "different sorting"

This proves the architectural pattern works. In production, the enabled state would call a real ML service.

### Real ML Integration Architecture

In a production ML system, the AI toggle would integrate as follows:

#### 1. **Feature Engineering Layer**
```
Location: backend/services/ml/features.js (hypothetical)
```
- Extract user context (location, preferences, order history)
- Extract offer features (discount, cuisine type, time remaining)
- Create feature vectors for ML model input

#### 2. **ML Model Service**
```
Location: backend/services/ml/recommendationService.js (hypothetical)
```
- When `enable_smart_recommendations=true`, call ML service
- ML service would:
  - Take user context + offer features
  - Run through trained model (e.g., collaborative filtering, neural network)
  - Return relevance scores for each offer
- Sort offers by ML-predicted relevance score

#### 3. **Integration Point in Current Code**

In `backend/services/offerService.js`, the `getActiveOffers` function would be modified:

```javascript
// Current (stub):
if (enableSmartRecommendations) {
    activeOffers = activeOffers.sort((a, b) => b.discount_percent - a.discount_percent);
}

// Real ML integration:
if (enableSmartRecommendations) {
    const userContext = extractUserContext(req); // From auth/session
    const relevanceScores = await mlService.predictRelevance(
        userContext, 
        activeOffers
    );
    activeOffers = activeOffers
        .map((offer, idx) => ({ ...offer, relevance: relevanceScores[idx] }))
        .sort((a, b) => b.relevance - a.relevance);
}
```

#### 4. **ML Infrastructure Components**

- **Model Training Pipeline**: Separate service that trains models on historical data
- **Model Registry**: Stores trained models (versioned)
- **Feature Store**: Centralized storage for features used across services
- **A/B Testing Framework**: Compare ML recommendations vs. baseline
- **Monitoring**: Track recommendation quality, user engagement metrics

#### 5. **Architectural Benefits of the Toggle**

The toggle pattern allows:
- **Gradual Rollout**: Enable ML for specific user segments
- **Fallback**: If ML service fails, fall back to default sorting
- **A/B Testing**: Compare ML vs. non-ML performance
- **Feature Flags**: Control ML features without code deployment

### Summary

**Key Point:** This is a **logic stub**, not real machine learning. The requirement explicitly states: *"This is not ML — it's a logic stub to prove architectural thinking."*

The current implementation proves the architectural pattern:
- ✅ Toggle pattern works correctly
- ✅ Code structure supports easy ML integration
- ✅ Clear separation of concerns (routes → controllers → services)
- ✅ Demonstrates where and how ML would be added

In production, the toggle would route requests to a real ML service that uses trained models to predict offer relevance based on user context and offer features, rather than simple discount-based sorting.

The proper backend structure makes it easy to add the ML service layer without disrupting existing functionality - you would simply add a new service in `backend/services/ml/` and update the `offerService.js` to call it when the toggle is enabled.

**Remember:** This is a qualification test to demonstrate architectural thinking, not to build actual ML. The logic stub proves the pattern works and shows where real ML would integrate.
