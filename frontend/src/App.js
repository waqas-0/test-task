import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:2323/api';

// Helper functions for default form values
const getCurrentDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() - 1); // Set to 1 hour ago to ensure it's active
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getFutureDateTime = () => {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);
  const year = future.getFullYear();
  const month = String(future.getMonth() + 1).padStart(2, '0');
  const day = String(future.getDate()).padStart(2, '0');
  const hours = String(future.getHours()).padStart(2, '0');
  const minutes = String(future.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function App() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enableSmartRecommendations, setEnableSmartRecommendations] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    restaurant_name: '',
    start_time: getCurrentDateTime(),
    end_time: getFutureDateTime(),
    discount_percent: ''
  });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/offers`, {
        params: {
          enable_smart_recommendations: enableSmartRecommendations
        }
      });
      setOffers(response.data.offers || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not connect to API. Make sure the backend server is running.');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, [enableSmartRecommendations]);

  useEffect(() => {
    loadOffers();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOffers, 30000);
    return () => clearInterval(interval);
  }, [loadOffers]);

  const toggleAI = () => {
    setEnableSmartRecommendations(!enableSmartRecommendations);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      // Convert datetime-local to ISO string properly
      // datetime-local gives us "YYYY-MM-DDTHH:mm" format
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setFormError('Invalid date format. Please check your dates.');
        setFormLoading(false);
        return;
      }
      
      if (endDate <= startDate) {
        setFormError('End time must be after start time.');
        setFormLoading(false);
        return;
      }

      const payload = {
        restaurant_name: formData.restaurant_name,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        discount_percent: Number(formData.discount_percent)
      };

      await axios.post(`${API_BASE_URL}/offers`, payload);
      
      // Reset form with default values
      setFormData({
        restaurant_name: '',
        start_time: getCurrentDateTime(),
        end_time: getFutureDateTime(),
        discount_percent: ''
      });
      setShowForm(false);
      
      // Reload offers immediately and clear any errors
      setError(null);
      await loadOffers();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create offer. Please check your inputs.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };


  return (
    <div className="App">
      <div className="container">
        <h1>Restaurant Offers</h1>
        
        <div className="controls">
          <div className="toggle-container">
            <label htmlFor="aiToggle">Enable Smart Recommendations:</label>
            <div 
              className={`toggle-switch ${enableSmartRecommendations ? 'active' : ''}`}
              onClick={toggleAI}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAI();
                }
              }}
              aria-label="Toggle smart recommendations"
            >
              <div className="toggle-slider"></div>
            </div>
            <span>{enableSmartRecommendations ? 'Enabled' : 'Disabled'}</span>
          </div>
          <button 
            className="add-offer-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add New Offer'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h2>Add New Offer</h2>
            {formError && (
              <div className="error">{formError}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="restaurant_name">Restaurant Name:</label>
                <input
                  type="text"
                  id="restaurant_name"
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Pizza Palace"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="start_time">Start Time:</label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                  defaultValue={getCurrentDateTime()}
                />
                <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                  Set to past time to make offer active immediately
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="end_time">End Time:</label>
                <input
                  type="datetime-local"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                  defaultValue={getFutureDateTime()}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="discount_percent">Discount Percent:</label>
                <input
                  type="number"
                  id="discount_percent"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  placeholder="e.g., 25"
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={formLoading}>
                {formLoading ? 'Creating...' : 'Create Offer'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="offers-container">
          {loading ? (
            <div className="loading">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="no-offers">No active offers at this time</div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="restaurant-name">{offer.restaurant_name}</div>
                <div className="discount">{offer.discount_percent}% OFF</div>
                <div className="time-window">
                  <strong>Active:</strong> {formatDateTime(offer.start_time)} - {formatDateTime(offer.end_time)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
