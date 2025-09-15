'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  main: string;
  description: string;
  icon: string;
  temp: number;
}

interface PriceModifier {
  condition: string;
  modifier: number;
  message: string;
  emoji: string;
}

const priceModifiers: PriceModifier[] = [
  { condition: 'Clear', modifier: 1.1, message: 'High Demand - Sunny Day!', emoji: '☀️' },
  { condition: 'Clouds', modifier: 1.0, message: 'Standard Pricing', emoji: '☁️' },
  { condition: 'Rain', modifier: 0.8, message: 'Rainy Day Discount!', emoji: '🌧️' },
  { condition: 'Drizzle', modifier: 0.85, message: 'Drizzle Discount!', emoji: '🌦️' },
  { condition: 'Snow', modifier: 0.7, message: 'Snow Day Special!', emoji: '❄️' },
  { condition: 'Thunderstorm', modifier: 0.6, message: 'Storm Sale - 40% OFF!', emoji: '⛈️' },
];

export default function WeatherPricing({ basePrice, zipCode }: { basePrice: number; zipCode?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [finalPrice, setFinalPrice] = useState(basePrice);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState<PriceModifier | null>(null);

  useEffect(() => {
    // For demo, use mock weather data
    const mockWeatherConditions = ['Clear', 'Rain', 'Clouds', 'Snow', 'Thunderstorm'];
    const randomCondition = mockWeatherConditions[Math.floor(Math.random() * mockWeatherConditions.length)];
    
    // Simulate API call delay
    setTimeout(() => {
      const mockWeather: WeatherData = {
        main: randomCondition,
        description: randomCondition.toLowerCase(),
        icon: '01d',
        temp: 72
      };
      
      setWeather(mockWeather);
      
      // Calculate price based on weather
      const modifier = priceModifiers.find(m => m.condition === randomCondition) || priceModifiers[1];
      setDiscount(modifier);
      setFinalPrice(Math.round(basePrice * modifier.modifier));
      setLoading(false);
    }, 1000);
  }, [basePrice, zipCode]);

  if (loading) {
    return (
      <div className="weather-pricing-widget">
        <div className="loading">Checking weather conditions...</div>
        <style jsx>{`
          .weather-pricing-widget {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 15px;
            color: white;
            margin: 20px 0;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          .loading {
            text-align: center;
            font-size: 14px;
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  const savings = basePrice - finalPrice;
  const savingsPercent = Math.round((1 - finalPrice / basePrice) * 100);

  return (
    <div className="weather-pricing-widget">
      <div className="weather-header">
        <span className="weather-emoji">{discount?.emoji}</span>
        <span className="weather-status">{weather?.main}</span>
      </div>
      
      <div className="price-display">
        {savings > 0 && (
          <div className="original-price">${basePrice}</div>
        )}
        <div className="final-price">${finalPrice}</div>
        <div className="price-period">per day</div>
      </div>

      <div className="discount-message">
        {discount?.message}
        {savings > 0 && (
          <div className="savings">
            Save ${savings} ({savingsPercent}% OFF!)
          </div>
        )}
      </div>

      <style jsx>{`
        .weather-pricing-widget {
          background: ${
            weather?.main === 'Clear' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
            weather?.main === 'Rain' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
            weather?.main === 'Snow' ? 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' :
            weather?.main === 'Thunderstorm' ? 'linear-gradient(135deg, #495aff 0%, #0acffe 100%)' :
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          };
          padding: 25px;
          border-radius: 20px;
          color: white;
          margin: 20px 0;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          animation: slideIn 0.5s ease-out;
          position: relative;
          overflow: hidden;
        }

        .weather-pricing-widget::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .weather-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .weather-emoji {
          font-size: 40px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .weather-status {
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .price-display {
          margin: 20px 0;
          position: relative;
        }

        .original-price {
          text-decoration: line-through;
          opacity: 0.7;
          font-size: 18px;
        }

        .final-price {
          font-size: 48px;
          font-weight: bold;
          line-height: 1;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .price-period {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 5px;
        }

        .discount-message {
          background: rgba(255,255,255,0.2);
          padding: 12px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          text-align: center;
          font-weight: 500;
        }

        .savings {
          margin-top: 8px;
          font-size: 18px;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}