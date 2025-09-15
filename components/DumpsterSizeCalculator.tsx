'use client';

import { useState, useRef } from 'react';

interface SizeRecommendation {
  size: '10' | '20' | '30' | '40';
  confidence: number;
  reasoning: string;
  estimatedVolume: string;
  price: number;
  projects: string[];
}

const dumpsterSpecs = {
  '10': { 
    volume: '10-12 cubic yards', 
    price: 650, 
    projects: ['Small bathroom remodel', 'Garage cleanout', 'Small deck removal'],
    dimensions: '12\' × 8\' × 4\''
  },
  '20': { 
    volume: '20-22 cubic yards', 
    price: 750, 
    projects: ['Kitchen remodel', 'Large room cleanout', 'Roofing project'],
    dimensions: '20\' × 8\' × 4.5\''
  },
  '30': { 
    volume: '30-32 cubic yards', 
    price: 850, 
    projects: ['Whole house cleanout', 'Large addition demo', 'Major landscaping'],
    dimensions: '20\' × 8\' × 6\''
  },
  '40': { 
    volume: '40-42 cubic yards', 
    price: 950, 
    projects: ['Commercial demo', 'Large construction project', 'Multi-room remodel'],
    dimensions: '20\' × 8\' × 8\''
  }
};

const mockAnalyzePhoto = (imageSrc: string): Promise<SizeRecommendation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI analysis - randomly pick a size with reasoning
      const sizes: Array<keyof typeof dumpsterSpecs> = ['10', '20', '30', '40'];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const spec = dumpsterSpecs[randomSize];
      
      const recommendations: Record<string, SizeRecommendation> = {
        '10': {
          size: '10',
          confidence: 0.87,
          reasoning: 'I can see a moderate pile of household items. Based on the volume of furniture, boxes, and debris visible, this looks like a small to medium cleanout project.',
          estimatedVolume: '8-10 cubic yards',
          price: spec.price,
          projects: spec.projects
        },
        '20': {
          size: '20',
          confidence: 0.92,
          reasoning: 'This appears to be a substantial renovation project with construction debris, old appliances, and multiple furniture pieces. The volume suggests a medium-large project.',
          estimatedVolume: '18-20 cubic yards',
          price: spec.price,
          projects: spec.projects
        },
        '30': {
          size: '30',
          confidence: 0.89,
          reasoning: 'I can identify significant amounts of debris including large furniture, construction materials, and extensive household items. This volume requires our larger container.',
          estimatedVolume: '25-30 cubic yards',
          price: spec.price,
          projects: spec.projects
        },
        '40': {
          size: '40',
          confidence: 0.94,
          reasoning: 'This is clearly a major project with extensive debris, large construction materials, and substantial volume. Our largest container is recommended.',
          estimatedVolume: '35-40 cubic yards',
          price: spec.price,
          projects: spec.projects
        }
      };
      
      resolve(recommendations[randomSize]);
    }, 2000);
  });
};

export default function DumpsterSizeCalculator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [history, setHistory] = useState<Array<{image: string, rec: SizeRecommendation}>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      // Request camera with fallback options
      let stream;
      try {
        // Try back camera first (better for photos)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
      } catch {
        // Fallback to any camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }
      
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        setIsCamera(true);
        
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Camera access denied or not available. Please use file upload instead.');
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
        analyzePhoto(image);
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
        analyzePhoto(image);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = async (image: string) => {
    setLoading(true);
    setRecommendation(null);
    
    const rec = await mockAnalyzePhoto(image);
    setRecommendation(rec);
    setHistory(prev => [{image, rec}, ...prev].slice(0, 3)); // Keep last 3
    setLoading(false);
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

  return (
    <div className="size-calculator">
      <div className="calculator-header">
        <h2>📏 AI Dumpster Size Calculator</h2>
        <p>Upload a photo of your junk pile and get an instant size recommendation!</p>
      </div>

      {!isCamera && !imageSrc && (
        <div className="upload-section">
          <div className="upload-buttons">
            <button onClick={startCamera} className="camera-btn">
              📷 Take Photo
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
          
          <div className="tips">
            <h4>📋 Photo Tips for Best Results:</h4>
            <ul>
              <li>📐 Include something for scale (person, door, car)</li>
              <li>🔆 Take photo in good lighting</li>
              <li>📏 Capture the entire pile from multiple angles if possible</li>
              <li>🏠 Include surrounding area for context</li>
            </ul>
          </div>
        </div>
      )}

      {isCamera && (
        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline />
          <div className="camera-controls">
            <button onClick={capturePhoto} className="capture-btn">
              📸 Capture Photo
            </button>
            <button onClick={stopCamera} className="cancel-btn">
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {imageSrc && (
        <div className="photo-preview">
          <img src={imageSrc} alt="Junk pile for analysis" />
          <button onClick={() => {
            setImageSrc(null);
            setRecommendation(null);
          }} className="retake-btn">
            📷 Take Another Photo
          </button>
        </div>
      )}

      {loading && (
        <div className="analysis-loading">
          <div className="spinner-container">
            <div className="spinner"></div>
            <div className="analysis-text">
              <h3>🤖 AI Analysis in Progress...</h3>
              <p>Measuring pile dimensions...</p>
              <p>Identifying debris types...</p>
              <p>Calculating volume requirements...</p>
            </div>
          </div>
        </div>
      )}

      {recommendation && (
        <div className="recommendation">
          <div className="rec-header" style={{ borderColor: getSizeColor(recommendation.size) }}>
            <div className="size-badge" style={{ backgroundColor: getSizeColor(recommendation.size) }}>
              {recommendation.size} YARD
            </div>
            <div className="confidence">
              {Math.round(recommendation.confidence * 100)}% Confident
            </div>
          </div>

          <div className="rec-content">
            <div className="price-section">
              <div className="price">${recommendation.price}/day</div>
              <div className="volume">{dumpsterSpecs[recommendation.size].volume}</div>
              <div className="dimensions">{dumpsterSpecs[recommendation.size].dimensions}</div>
            </div>

            <div className="reasoning">
              <h4>🧠 AI Analysis:</h4>
              <p>{recommendation.reasoning}</p>
              <p><strong>Estimated Volume:</strong> {recommendation.estimatedVolume}</p>
            </div>

            <div className="projects">
              <h4>✅ Perfect for projects like:</h4>
              <ul>
                {recommendation.projects.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            </div>

            <div className="action-buttons">
              <button className="order-btn" style={{ backgroundColor: getSizeColor(recommendation.size) }}>
                📞 Order {recommendation.size}-Yard Dumpster
              </button>
              <button className="compare-btn">
                📊 Compare All Sizes
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>📜 Recent Calculations</h3>
          <div className="history-grid">
            {history.map((item, index) => (
              <div key={index} className="history-item" onClick={() => {
                setImageSrc(item.image);
                setRecommendation(item.rec);
              }}>
                <img src={item.image} alt={`Analysis ${index + 1}`} />
                <div className="history-overlay">
                  <div className="history-size">{item.rec.size} Yard</div>
                  <div className="history-confidence">{Math.round(item.rec.confidence * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .size-calculator {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 25px;
          padding: 30px;
          margin: 30px 0;
          color: white;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .calculator-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .calculator-header h2 {
          font-size: 32px;
          margin-bottom: 15px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .calculator-header p {
          font-size: 18px;
          opacity: 0.9;
        }

        .upload-section {
          text-align: center;
        }

        .upload-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .camera-btn, .upload-btn, .capture-btn, .cancel-btn, .retake-btn, .order-btn, .compare-btn {
          padding: 15px 30px;
          font-size: 18px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .camera-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .upload-btn {
          background: rgba(255,255,255,0.3);
          color: white;
          backdrop-filter: blur(10px);
        }

        .capture-btn {
          background: #10b981;
          color: white;
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
        }

        .retake-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          margin-top: 15px;
          backdrop-filter: blur(10px);
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        .tips {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          text-align: left;
          max-width: 400px;
          margin: 0 auto;
        }

        .tips h4 {
          margin-bottom: 15px;
          color: #fff;
        }

        .tips ul {
          list-style: none;
          padding: 0;
        }

        .tips li {
          padding: 5px 0;
          opacity: 0.9;
        }

        .camera-section {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          margin: 20px 0;
        }

        .camera-section video {
          width: 100%;
          height: 300px;
          border-radius: 15px;
          object-fit: cover;
          background: #000;
        }

        .camera-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
        }

        .photo-preview {
          text-align: center;
          margin: 20px 0;
        }

        .photo-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .analysis-loading {
          text-align: center;
          padding: 40px;
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(255,255,255,0.3);
          border-top: 6px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .analysis-text p {
          margin: 5px 0;
          opacity: 0.8;
        }

        .recommendation {
          background: rgba(255,255,255,0.95);
          color: #1e293b;
          border-radius: 20px;
          padding: 25px;
          margin: 20px 0;
          animation: slideUp 0.5s ease-out;
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

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 3px solid;
        }

        .size-badge {
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 24px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .confidence {
          background: #f1f5f9;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          color: #475569;
        }

        .price-section {
          text-align: center;
          margin-bottom: 25px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 15px;
        }

        .price {
          font-size: 48px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .volume {
          font-size: 18px;
          color: #64748b;
          margin-bottom: 5px;
        }

        .dimensions {
          font-size: 16px;
          color: #94a3b8;
        }

        .reasoning {
          margin-bottom: 25px;
        }

        .reasoning h4 {
          color: #1e293b;
          margin-bottom: 10px;
        }

        .reasoning p {
          color: #475569;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .projects {
          margin-bottom: 25px;
        }

        .projects h4 {
          color: #1e293b;
          margin-bottom: 10px;
        }

        .projects ul {
          list-style: none;
          padding: 0;
        }

        .projects li {
          padding: 8px 0;
          color: #475569;
          border-bottom: 1px solid #e5e7eb;
        }

        .projects li:before {
          content: '✅ ';
          margin-right: 8px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .order-btn {
          color: white;
          flex: 1;
          max-width: 250px;
        }

        .compare-btn {
          background: #f1f5f9;
          color: #475569;
          flex: 1;
          max-width: 200px;
        }

        .history-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid rgba(255,255,255,0.3);
        }

        .history-section h3 {
          margin-bottom: 20px;
          text-align: center;
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .history-item {
          position: relative;
          cursor: pointer;
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .history-item:hover {
          transform: scale(1.05);
        }

        .history-item img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .history-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 10px;
          color: white;
          text-align: center;
        }

        .history-size {
          font-weight: bold;
        }

        .history-confidence {
          font-size: 12px;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .upload-buttons {
            flex-direction: column;
            align-items: center;
          }

          .rec-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .action-buttons {
            flex-direction: column;
          }

          .camera-controls {
            width: 90%;
          }

          .tips {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}