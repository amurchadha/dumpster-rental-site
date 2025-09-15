'use client';

import { useState, useRef } from 'react';

interface IdentifiedItem {
  name: string;
  category: 'regular' | 'recyclable' | 'hazardous' | 'not-allowed';
  confidence: number;
  instructions: string;
}

const mockIdentifyItems = (imageSrc: string): Promise<IdentifiedItem[]> => {
  // Mock AI response - in real app would call vision API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockItems: IdentifiedItem[] = [
        {
          name: 'Old Couch',
          category: 'regular',
          confidence: 0.92,
          instructions: '✅ Can go in dumpster. Break down if possible to save space.'
        },
        {
          name: 'Cardboard Boxes',
          category: 'recyclable',
          confidence: 0.88,
          instructions: '♻️ Recyclable! Flatten boxes and place in recycling bin if available.'
        },
        {
          name: 'Paint Cans',
          category: 'hazardous',
          confidence: 0.75,
          instructions: '⚠️ Hazardous waste! Take to local hazardous waste facility. Do NOT put in dumpster.'
        },
        {
          name: 'Car Battery',
          category: 'not-allowed',
          confidence: 0.95,
          instructions: '🚫 NOT allowed in dumpster! Return to auto parts store for recycling.'
        },
        {
          name: 'Wood Debris',
          category: 'regular',
          confidence: 0.83,
          instructions: '✅ Perfect for dumpster. Stack neatly to maximize space.'
        }
      ];
      
      // Randomly return 2-4 items to simulate different photos
      const numItems = Math.floor(Math.random() * 3) + 2;
      const shuffled = mockItems.sort(() => Math.random() - 0.5);
      resolve(shuffled.slice(0, numItems));
    }, 1500);
  });
};

export default function JunkIdentifier() {
  const [isCamera, setIsCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [items, setItems] = useState<IdentifiedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<IdentifiedItem[][]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCamera(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Camera access denied. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const image = canvasRef.current.toDataURL('image/jpeg');
        setImageSrc(image);
        stopCamera();
        identifyItems(image);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = event.target?.result as string;
        setImageSrc(image);
        identifyItems(image);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifyItems = async (image: string) => {
    setLoading(true);
    setItems([]);
    const identified = await mockIdentifyItems(image);
    setItems(identified);
    setHistory(prev => [[...identified], ...prev].slice(0, 5)); // Keep last 5 scans
    setLoading(false);
  };

  const getCategoryEmoji = (category: string) => {
    switch(category) {
      case 'regular': return '✅';
      case 'recyclable': return '♻️';
      case 'hazardous': return '⚠️';
      case 'not-allowed': return '🚫';
      default: return '❓';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'regular': return '#10b981';
      case 'recyclable': return '#3b82f6';
      case 'hazardous': return '#f59e0b';
      case 'not-allowed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="junk-identifier">
      <div className="identifier-header">
        <h2>🤖 AI Junk Identifier</h2>
        <p>Take a photo to instantly identify what can go in your dumpster!</p>
      </div>

      {!isCamera && !imageSrc && (
        <div className="action-buttons">
          <button onClick={startCamera} className="camera-btn">
            📷 Open Camera
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="upload-btn">
            📁 Upload Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {isCamera && (
        <div className="camera-view">
          <video ref={videoRef} autoPlay playsInline />
          <div className="camera-controls">
            <button onClick={capturePhoto} className="capture-btn">
              📸 Capture
            </button>
            <button onClick={stopCamera} className="cancel-btn">
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {imageSrc && (
        <div className="preview">
          <img src={imageSrc} alt="Captured junk" />
          <button onClick={() => {
            setImageSrc(null);
            setItems([]);
          }} className="retake-btn">
            📷 Take Another
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-analysis">
          <div className="spinner"></div>
          <p>🤖 Analyzing your junk...</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="results">
          <h3>Identified Items:</h3>
          {items.map((item, index) => (
            <div key={index} className="item-card" style={{
              borderLeft: `4px solid ${getCategoryColor(item.category)}`
            }}>
              <div className="item-header">
                <span className="item-emoji">{getCategoryEmoji(item.category)}</span>
                <span className="item-name">{item.name}</span>
                <span className="confidence">{Math.round(item.confidence * 100)}% sure</span>
              </div>
              <div className="item-instructions">
                {item.instructions}
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <button onClick={() => setShowHistory(!showHistory)} className="history-toggle">
            📜 {showHistory ? 'Hide' : 'Show'} Scan History ({history.length})
          </button>
          {showHistory && (
            <div className="history-list">
              {history.map((scan, scanIndex) => (
                <div key={scanIndex} className="history-scan">
                  <h4>Scan #{history.length - scanIndex}</h4>
                  {scan.map((item, itemIndex) => (
                    <div key={itemIndex} className="history-item">
                      {getCategoryEmoji(item.category)} {item.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .junk-identifier {
          background: #f8fafc;
          border-radius: 20px;
          padding: 25px;
          margin: 30px 0;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .identifier-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .identifier-header h2 {
          font-size: 28px;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .identifier-header p {
          color: #64748b;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 30px 0;
        }

        .camera-btn, .upload-btn, .capture-btn, .cancel-btn, .retake-btn {
          padding: 15px 30px;
          font-size: 18px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .camera-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .upload-btn {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .capture-btn {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
        }

        .retake-btn {
          background: #6366f1;
          color: white;
          margin-top: 15px;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .camera-view {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          margin: 20px 0;
        }

        .camera-view video {
          width: 100%;
          border-radius: 15px;
        }

        .camera-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
        }

        .preview {
          text-align: center;
          margin: 20px 0;
        }

        .preview img {
          max-width: 100%;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .loading-analysis {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #e5e7eb;
          border-top: 5px solid #6366f1;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .results {
          margin-top: 30px;
        }

        .results h3 {
          font-size: 22px;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .item-card {
          background: white;
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }

        .item-card:hover {
          transform: translateX(5px);
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .item-emoji {
          font-size: 28px;
        }

        .item-name {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          flex: 1;
        }

        .confidence {
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .item-instructions {
          color: #475569;
          font-size: 15px;
          line-height: 1.6;
          padding-left: 40px;
        }

        .history-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }

        .history-toggle {
          background: #f1f5f9;
          color: #475569;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          text-align: left;
        }

        .history-list {
          margin-top: 15px;
        }

        .history-scan {
          background: white;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
        }

        .history-scan h4 {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .history-item {
          padding: 5px 0;
          color: #475569;
        }

        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }

          .camera-controls {
            width: 90%;
          }

          .item-instructions {
            padding-left: 0;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}