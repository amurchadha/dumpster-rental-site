'use client';

import { useState, useEffect } from 'react';

interface Truck {
  id: string;
  lat: number;
  lng: number;
  status: 'available' | 'en-route' | 'delivering' | 'picking-up';
  dumpsterSize: '10' | '20' | '30' | '40';
  eta: string;
  driver: string;
}

interface Dumpster {
  id: string;
  lat: number;
  lng: number;
  size: '10' | '20' | '30' | '40';
  status: 'available' | 'reserved' | 'in-use';
  location: string;
  nextAvailable: string;
}

// Mock data for trucks and dumpsters
const generateMockTrucks = (): Truck[] => [
  {
    id: 'T001',
    lat: 39.9526 + (Math.random() - 0.5) * 0.1,
    lng: -75.1652 + (Math.random() - 0.5) * 0.1,
    status: 'available',
    dumpsterSize: '20',
    eta: 'Available now',
    driver: 'Mike Johnson'
  },
  {
    id: 'T002', 
    lat: 39.9526 + (Math.random() - 0.5) * 0.1,
    lng: -75.1652 + (Math.random() - 0.5) * 0.1,
    status: 'en-route',
    dumpsterSize: '30',
    eta: '45 minutes',
    driver: 'Sarah Chen'
  },
  {
    id: 'T003',
    lat: 39.9526 + (Math.random() - 0.5) * 0.1,
    lng: -75.1652 + (Math.random() - 0.5) * 0.1,
    status: 'available',
    dumpsterSize: '10',
    eta: 'Available now',
    driver: 'Robert Davis'
  },
  {
    id: 'T004',
    lat: 39.9526 + (Math.random() - 0.5) * 0.1,
    lng: -75.1652 + (Math.random() - 0.5) * 0.1,
    status: 'delivering',
    dumpsterSize: '40',
    eta: '2 hours',
    driver: 'Lisa Park'
  }
];

const generateMockDumpsters = (): Dumpster[] => [
  {
    id: 'D001',
    lat: 39.9526 + (Math.random() - 0.5) * 0.05,
    lng: -75.1652 + (Math.random() - 0.5) * 0.05,
    size: '20',
    status: 'available',
    location: 'Center City Depot',
    nextAvailable: 'Now'
  },
  {
    id: 'D002',
    lat: 39.9526 + (Math.random() - 0.5) * 0.05,
    lng: -75.1652 + (Math.random() - 0.5) * 0.05,
    size: '30',
    status: 'in-use',
    location: 'Customer Site',
    nextAvailable: 'Tomorrow 2PM'
  },
  {
    id: 'D003',
    lat: 39.9526 + (Math.random() - 0.5) * 0.05,
    lng: -75.1652 + (Math.random() - 0.5) * 0.05,
    size: '10',
    status: 'available',
    location: 'North Philly Yard',
    nextAvailable: 'Now'
  }
];

export default function AvailabilityMap() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | '10' | '20' | '30' | '40'>('all');
  const [showTrucks, setShowTrucks] = useState(true);
  const [showDumpsters, setShowDumpsters] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Truck | Dumpster | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Initialize with mock data
    setTrucks(generateMockTrucks());
    setDumpsters(generateMockDumpsters());

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to Philadelphia
          setUserLocation({ lat: 39.9526, lng: -75.1652 });
        }
      );
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrucks(prev => prev.map(truck => ({
        ...truck,
        lat: truck.lat + (Math.random() - 0.5) * 0.001,
        lng: truck.lng + (Math.random() - 0.5) * 0.001,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return '#10b981';
      case 'en-route': return '#f59e0b';
      case 'delivering': return '#3b82f6';
      case 'picking-up': return '#8b5cf6';
      case 'in-use': return '#ef4444';
      case 'reserved': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getSizeColor = (size: string) => {
    switch(size) {
      case '10': return '#10b981';
      case '20': return '#3b82f6';
      case '30': return '#f59e0b';
      case '40': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredTrucks = trucks.filter(truck => 
    selectedFilter === 'all' || truck.dumpsterSize === selectedFilter
  );

  const filteredDumpsters = dumpsters.filter(dumpster => 
    selectedFilter === 'all' || dumpster.size === selectedFilter
  );

  const availableCount = trucks.filter(t => t.status === 'available').length;
  const enRouteCount = trucks.filter(t => t.status === 'en-route').length;

  return (
    <div className="availability-map">
      <div className="map-header">
        <h2>🗺️ Real-Time Availability Map</h2>
        <p>Live truck locations and dumpster availability in your area</p>
      </div>

      <div className="map-stats">
        <div className="stat-card available">
          <div className="stat-number">{availableCount}</div>
          <div className="stat-label">Available Now</div>
        </div>
        <div className="stat-card en-route">
          <div className="stat-number">{enRouteCount}</div>
          <div className="stat-label">En Route</div>
        </div>
        <div className="stat-card total">
          <div className="stat-number">{dumpsters.filter(d => d.status === 'available').length}</div>
          <div className="stat-label">Ready to Go</div>
        </div>
      </div>

      <div className="map-controls">
        <div className="filters">
          <button 
            onClick={() => setSelectedFilter('all')} 
            className={selectedFilter === 'all' ? 'active' : ''}
          >
            All Sizes
          </button>
          {['10', '20', '30', '40'].map(size => (
            <button 
              key={size}
              onClick={() => setSelectedFilter(size as any)} 
              className={selectedFilter === size ? 'active' : ''}
              style={{ borderColor: getSizeColor(size) }}
            >
              {size}Y
            </button>
          ))}
        </div>
        
        <div className="toggles">
          <label>
            <input 
              type="checkbox" 
              checked={showTrucks} 
              onChange={(e) => setShowTrucks(e.target.checked)}
            />
            🚛 Trucks
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={showDumpsters} 
              onChange={(e) => setShowDumpsters(e.target.checked)}
            />
            🗑️ Dumpsters
          </label>
        </div>
      </div>

      <div className="map-container">
        <div className="map-placeholder">
          <div className="map-grid">
            {/* User location */}
            {userLocation && (
              <div className="map-item user-location" style={{
                left: '50%',
                top: '50%'
              }}>
                📍 You
              </div>
            )}

            {/* Trucks */}
            {showTrucks && filteredTrucks.map((truck, index) => (
              <div 
                key={truck.id}
                className="map-item truck"
                style={{
                  left: `${30 + index * 15}%`,
                  top: `${25 + (index % 2) * 30}%`,
                  color: getStatusColor(truck.status)
                }}
                onClick={() => setSelectedItem(truck)}
              >
                <div className="truck-icon">🚛</div>
                <div className="truck-size" style={{ backgroundColor: getSizeColor(truck.dumpsterSize) }}>
                  {truck.dumpsterSize}Y
                </div>
              </div>
            ))}

            {/* Dumpsters */}
            {showDumpsters && filteredDumpsters.map((dumpster, index) => (
              <div 
                key={dumpster.id}
                className="map-item dumpster"
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${60 + (index % 2) * 20}%`,
                  color: getStatusColor(dumpster.status)
                }}
                onClick={() => setSelectedItem(dumpster)}
              >
                <div className="dumpster-icon">🗑️</div>
                <div className="dumpster-size" style={{ backgroundColor: getSizeColor(dumpster.size) }}>
                  {dumpster.size}Y
                </div>
              </div>
            ))}
          </div>

          <div className="map-legend">
            <div className="legend-item">
              <span style={{ color: '#10b981' }}>●</span> Available
            </div>
            <div className="legend-item">
              <span style={{ color: '#f59e0b' }}>●</span> En Route/Reserved
            </div>
            <div className="legend-item">
              <span style={{ color: '#3b82f6' }}>●</span> Delivering
            </div>
            <div className="legend-item">
              <span style={{ color: '#ef4444' }}>●</span> In Use
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="item-details">
          {'dumpsterSize' in selectedItem ? (
            // Truck details
            <div className="details-content">
              <h3>🚛 Truck {selectedItem.id}</h3>
              <div className="detail-row">
                <span>Driver:</span>
                <span>{selectedItem.driver}</span>
              </div>
              <div className="detail-row">
                <span>Dumpster Size:</span>
                <span>{selectedItem.dumpsterSize} Yard</span>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span style={{ color: getStatusColor(selectedItem.status) }}>
                  {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                </span>
              </div>
              <div className="detail-row">
                <span>ETA:</span>
                <span>{selectedItem.eta}</span>
              </div>
              {selectedItem.status === 'available' && (
                <button className="reserve-btn">
                  📞 Reserve This Truck
                </button>
              )}
            </div>
          ) : (
            // Dumpster details
            <div className="details-content">
              <h3>🗑️ Dumpster {selectedItem.id}</h3>
              <div className="detail-row">
                <span>Size:</span>
                <span>{selectedItem.size} Yard</span>
              </div>
              <div className="detail-row">
                <span>Location:</span>
                <span>{selectedItem.location}</span>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span style={{ color: getStatusColor(selectedItem.status) }}>
                  {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                </span>
              </div>
              <div className="detail-row">
                <span>Next Available:</span>
                <span>{selectedItem.nextAvailable}</span>
              </div>
              {selectedItem.status === 'available' && (
                <button className="reserve-btn">
                  📞 Reserve This Dumpster
                </button>
              )}
            </div>
          )}
          <button className="close-btn" onClick={() => setSelectedItem(null)}>
            ✕ Close
          </button>
        </div>
      )}

      <style jsx>{`
        .availability-map {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 25px;
          padding: 30px;
          margin: 30px 0;
          color: white;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }

        .map-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .map-header h2 {
          font-size: 32px;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .map-header p {
          opacity: 0.8;
          font-size: 16px;
        }

        .map-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-card.available {
          border-left: 4px solid #10b981;
        }

        .stat-card.en-route {
          border-left: 4px solid #f59e0b;
        }

        .stat-card.total {
          border-left: 4px solid #3b82f6;
        }

        .stat-number {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .map-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filters button {
          padding: 8px 16px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .filters button.active,
        .filters button:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.6);
        }

        .toggles {
          display: flex;
          gap: 15px;
        }

        .toggles label {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .toggles input[type="checkbox"] {
          margin-right: 5px;
        }

        .map-container {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          padding: 20px;
          position: relative;
          min-height: 400px;
          overflow: hidden;
        }

        .map-placeholder {
          position: relative;
          width: 100%;
          height: 400px;
          background: linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 10px;
          border: 2px dashed #cbd5e1;
        }

        .map-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .map-item {
          position: absolute;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .map-item:hover {
          transform: scale(1.1);
          z-index: 10;
        }

        .user-location {
          font-size: 24px;
          z-index: 20;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .truck, .dumpster {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .truck-icon, .dumpster-icon {
          font-size: 32px;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }

        .truck-size, .dumpster-size {
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .map-legend {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255,255,255,0.9);
          padding: 15px;
          border-radius: 10px;
          color: #1e293b;
          backdrop-filter: blur(10px);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .item-details {
          background: rgba(255,255,255,0.95);
          color: #1e293b;
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .details-content h3 {
          margin-bottom: 15px;
          color: #1e293b;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .reserve-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 15px;
          width: 100%;
          transition: all 0.3s ease;
        }

        .reserve-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .close-btn {
          background: #f1f5f9;
          color: #64748b;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .map-stats {
            grid-template-columns: 1fr;
          }

          .map-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .filters {
            justify-content: center;
          }

          .toggles {
            justify-content: center;
          }

          .map-placeholder {
            height: 300px;
          }

          .truck-icon, .dumpster-icon {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}