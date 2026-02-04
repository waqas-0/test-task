import { createOffer as createOfferService, getActiveOffers } from '../services/offerService.js';

export const createOffer = (req, res) => {
  try {
    const { restaurant_name, start_time, end_time, discount_percent } = req.body;

    // Validation
    if (!restaurant_name || !start_time || !end_time || discount_percent === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: restaurant_name, start_time, end_time, discount_percent'
      });
    }

    // Validate discount_percent is a number between 0 and 100
    if (typeof discount_percent !== 'number' || discount_percent < 0 || discount_percent > 100) {
      return res.status(400).json({
        error: 'discount_percent must be a number between 0 and 100'
      });
    }

    // Validate time format and logic
    const start = new Date(start_time);
    const end = new Date(end_time);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format for start_time or end_time'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        error: 'end_time must be after start_time'
      });
    }

    const offer = createOfferService({
      restaurant_name,
      start_time,
      end_time,
      discount_percent
    });

    res.status(201).json({
      message: 'Offer created successfully',
      offer
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

export const getOffers = (req, res) => {
  try {
    const enableSmartRecommendations = req.query.enable_smart_recommendations === 'true';
    
    const result = getActiveOffers(enableSmartRecommendations);
    
    res.json({
      offers: result.offers,
      count: result.count,
      enable_smart_recommendations: enableSmartRecommendations
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
