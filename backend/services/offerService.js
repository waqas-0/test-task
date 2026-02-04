import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data/offers.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read offers from file
const readOffers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading offers file:', error);
    return [];
  }
};

// Helper function to write offers to file
const writeOffers = (offers) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(offers, null, 2));
  } catch (error) {
    console.error('Error writing offers file:', error);
    throw new Error('Failed to save offer');
  }
};

// Helper function to check if an offer is currently active
const isOfferActive = (offer) => {
  const now = new Date();
  const startTime = new Date(offer.start_time);
  const endTime = new Date(offer.end_time);
  return now >= startTime && now <= endTime;
};

export const createOffer = (offerData) => {
  const offers = readOffers();
  
  // Generate ID based on existing offers
  const maxId = offers.length > 0 
    ? Math.max(...offers.map(o => o.id || 0))
    : 0;
  
  const offer = {
    id: maxId + 1,
    restaurant_name: offerData.restaurant_name,
    start_time: offerData.start_time,
    end_time: offerData.end_time,
    discount_percent: offerData.discount_percent,
    created_at: new Date().toISOString()
  };

  offers.push(offer);
  writeOffers(offers);
  
  return offer;
};

export const getActiveOffers = (enableSmartRecommendations = false) => {
  const offers = readOffers();
  
  // Filter active offers
  let activeOffers = offers.filter(isOfferActive);

  // Apply AI toggle logic (LOGIC STUB - NOT REAL ML)
  // This is a simple example to prove architectural thinking.
  // In production, this would call a real ML service.
  if (enableSmartRecommendations) {
    // Logic stub: Sort by highest discount first (descending)
    // This is NOT machine learning - just a simple example of "different sorting"
    // In a real ML system, this would use ML-predicted relevance scores
    // that consider multiple factors: user preferences, location, time remaining,
    // cuisine type, historical engagement, etc.
    activeOffers = activeOffers.sort((a, b) => b.discount_percent - a.discount_percent);
  } else {
    // Default order: by creation time (most recent first)
    activeOffers = activeOffers.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  }

  return {
    offers: activeOffers,
    count: activeOffers.length
  };
};
