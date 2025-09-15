'use client';

import { useState } from 'react';

const dumpsterPrices = {
  '10': { basePrice: 650, description: 'Small cleanouts, bathroom remodels' },
  '20': { basePrice: 750, description: 'Kitchen remodels, garage cleanouts' },
  '30': { basePrice: 850, description: 'Whole house cleanouts, major projects' },
  '40': { basePrice: 950, description: 'Commercial projects, large construction' }
};

export default function QuoteCalculator() {
  const [size, setSize] = useState<'10' | '20' | '30' | '40'>('20');
  const [days, setDays] = useState(7);
  const [zipCode, setZipCode] = useState('');
  const [total, setTotal] = useState(0);

  const calculateQuote = () => {
    const basePrice = dumpsterPrices[size].basePrice;
    const dailyRate = size === '10' ? 25 : size === '20' ? 30 : size === '30' ? 35 : 40;
    const extraDays = Math.max(0, days - 7); // First 7 days included
    const calculated = basePrice + (extraDays * dailyRate);
    setTotal(calculated);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateQuote();
  };

  return (
    <div className="quote-calculator">
      <h2>Get Instant Quote</h2>
      <p>Calculate your dumpster rental cost</p>

      <form onSubmit={handleCalculate} className="quote-form">
        <div className="form-row">
          <div className="form-group">
            <label>Dumpster Size</label>
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value as any)}
              required
            >
              {Object.entries(dumpsterPrices).map(([s, info]) => (
                <option key={s} value={s}>
                  {s} Yard - {info.description}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Rental Period</label>
            <select 
              value={days} 
              onChange={(e) => setDays(parseInt(e.target.value))}
              required
            >
              <option value={7}>7 days (included)</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              maxLength={5}
              pattern="[0-9]{5}"
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="calculate-btn">
              Calculate Quote
            </button>
          </div>
        </div>
      </form>

      {total > 0 && (
        <div className="quote-result">
          <div className="price-breakdown">
            <h3>Your Quote</h3>
            <div className="price-line">
              <span>{size}-Yard Dumpster (7 days included)</span>
              <span>${dumpsterPrices[size].basePrice}</span>
            </div>
            {days > 7 && (
              <div className="price-line">
                <span>Extra days ({days - 7} days)</span>
                <span>${(days - 7) * (size === '10' ? 25 : size === '20' ? 30 : size === '30' ? 35 : 40)}</span>
              </div>
            )}
            <div className="price-line total">
              <span><strong>Total Cost</strong></span>
              <span><strong>${total}</strong></span>
            </div>
          </div>

          <div className="next-steps">
            <button className="order-btn">
              📞 Call (800) 682-5062 to Order
            </button>
            <p>Same-day delivery available in most areas</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .quote-calculator {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
        }

        .quote-calculator h2 {
          color: #1e293b;
          margin-bottom: 5px;
          font-size: 24px;
        }

        .quote-calculator p {
          color: #64748b;
          margin-bottom: 25px;
        }

        .quote-form {
          margin-bottom: 25px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }

        .form-group select,
        .form-group input {
          padding: 12px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          background: white;
        }

        .form-group select:focus,
        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .calculate-btn {
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          height: fit-content;
          align-self: end;
        }

        .calculate-btn:hover {
          background: #2563eb;
        }

        .quote-result {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .price-breakdown h3 {
          color: #1e293b;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .price-line {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .price-line.total {
          border-bottom: none;
          border-top: 2px solid #e2e8f0;
          font-size: 18px;
          color: #1e293b;
        }

        .next-steps {
          margin-top: 25px;
          text-align: center;
        }

        .order-btn {
          background: #10b981;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 10px;
          transition: all 0.2s;
        }

        .order-btn:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .next-steps p {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .calculate-btn {
            align-self: stretch;
          }
        }
      `}</style>
    </div>
  );
}