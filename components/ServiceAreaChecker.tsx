'use client';

import { useState } from 'react';

const serviceAreas = {
  // Major metropolitan areas we serve
  'PA': ['19019', '19020', '19021', '19022', '19023', '19025', '19026', '19027', '19028', '19029', '19030', '19031', '19032', '19033', '19034', '19035', '19036', '19037', '19038', '19039', '19040', '19041', '19042', '19043', '19044', '19045', '19046', '19047', '19048', '19049', '19050', '19051', '19052', '19053', '19054', '19055', '19056', '19057', '19058', '19059', '19060', '19061', '19062', '19063', '19064', '19065', '19066', '19067', '19070', '19071', '19072', '19073', '19074', '19075', '19076', '19077', '19078', '19079', '19080', '19081', '19082', '19083', '19084', '19085', '19086', '19087', '19088', '19089', '19090', '19091', '19092', '19093', '19094', '19095', '19096', '19098', '19099', '19101', '19102', '19103', '19104', '19105', '19106', '19107', '19108', '19109', '19110', '19111', '19112', '19113', '19114', '19115', '19116', '19118', '19119', '19120', '19121', '19122', '19123', '19124', '19125', '19126', '19127', '19128', '19129', '19130', '19131', '19132', '19133', '19134', '19135', '19136', '19137', '19138', '19139', '19140', '19141', '19142', '19143', '19144', '19145', '19146', '19147', '19148', '19149', '19150', '19151', '19152', '19153', '19154', '19155', '19160', '19161', '19162', '19170', '19171', '19172', '19173', '19175', '19176', '19177', '19178', '19179', '19181', '19182', '19183', '19184', '19185', '19187', '19188', '19190', '19191', '19192', '19193', '19194', '19195', '19196', '19197', '19244', '19255'],
  'TX': ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010', '77011', '77012', '77013', '77014', '77015', '77016', '77017', '77018', '77019', '77020', '77021', '77022', '77023', '77024', '77025', '77026', '77027', '77028', '77029', '77030', '77031', '77032', '77033', '77034', '77035', '77036', '77037', '77038', '77039', '77040', '77041', '77042', '77043', '77044', '77045', '77046', '77047', '77048', '77049', '77050', '77051', '77052', '77053', '77054', '77055', '77056', '77057', '77058', '77059', '77060', '77061', '77062', '77063', '77064', '77065', '77066', '77067', '77068', '77069', '77070', '77071', '77072', '77073', '77074', '77075', '77076', '77077', '77078', '77079', '77080', '77081', '77082', '77083', '77084', '77085', '77086', '77087', '77088', '77089', '77090', '77091', '77092', '77093', '77094', '77095', '77096', '77097', '77098', '77099'],
  'CA': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010', '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020', '90021', '90022', '90023', '90024', '90025', '90026', '90027', '90028', '90029', '90030', '90031', '90032', '90033', '90034', '90035', '90036', '90037', '90038', '90039', '90040', '90041', '90042', '90043', '90044', '90045', '90046', '90047', '90048', '90049', '90050', '90051', '90052', '90053', '90054', '90055', '90056', '90057', '90058', '90059', '90060', '90061', '90062', '90063', '90064', '90065', '90066', '90067', '90068', '90069', '90070', '90071', '90072', '90073', '90074', '90075', '90076', '90077', '90078', '90079', '90080', '90081', '90082', '90083', '90084', '90086', '90087', '90088', '90089', '90091', '90093', '90094', '90095', '90096', '90099'],
  'FL': ['33101', '33102', '33106', '33109', '33111', '33112', '33114', '33116', '33119', '33122', '33124', '33125', '33126', '33127', '33128', '33129', '33130', '33131', '33132', '33133', '33134', '33135', '33136', '33137', '33138', '33139', '33140', '33141', '33142', '33143', '33144', '33145', '33146', '33147', '33149', '33150', '33151', '33152', '33153', '33154', '33155', '33156', '33157', '33158', '33159', '33160', '33161', '33162', '33163', '33164', '33165', '33166', '33167', '33168', '33169', '33170', '33172', '33173', '33174', '33175', '33176', '33177', '33178', '33179', '33180', '33181', '33182', '33183', '33184', '33185', '33186', '33187', '33188', '33189', '33190', '33193', '33194', '33195', '33196', '33197', '33199']
};

export default function ServiceAreaChecker() {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState<{
    serves: boolean;
    state?: string;
    message: string;
  } | null>(null);

  const checkServiceArea = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode || zipCode.length !== 5) {
      setResult({
        serves: false,
        message: 'Please enter a valid 5-digit ZIP code'
      });
      return;
    }

    // Check if ZIP code is in our service areas
    for (const [state, zips] of Object.entries(serviceAreas)) {
      if (zips.includes(zipCode)) {
        setResult({
          serves: true,
          state: state,
          message: `Great news! We serve your area in ${state === 'PA' ? 'Pennsylvania' : state === 'TX' ? 'Texas' : state === 'CA' ? 'California' : 'Florida'}.`
        });
        return;
      }
    }

    setResult({
      serves: false,
      message: 'We don\'t currently serve this ZIP code, but call us at (800) 682-5062 - we may have coverage through our partner network.'
    });
  };

  return (
    <div className="service-checker">
      <h2>Check Service Availability</h2>
      <p>Enter your ZIP code to see if we deliver to your area</p>

      <form onSubmit={checkServiceArea} className="checker-form">
        <div className="input-group">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="Enter ZIP code"
            maxLength={5}
            required
          />
          <button type="submit">Check Area</button>
        </div>
      </form>

      {result && (
        <div className={`result ${result.serves ? 'serves' : 'no-service'}`}>
          <div className="result-icon">
            {result.serves ? '✅' : '❌'}
          </div>
          <div className="result-content">
            <p>{result.message}</p>
            {result.serves && (
              <div className="service-details">
                <h4>What's included:</h4>
                <ul>
                  <li>Same-day or next-day delivery</li>
                  <li>7 days rental included</li>
                  <li>Pickup included in price</li>
                  <li>All dumpster sizes available</li>
                </ul>
                <button className="call-btn">
                  📞 Call (800) 682-5062 to Order
                </button>
              </div>
            )}
            {!result.serves && (
              <div className="alternative">
                <p><strong>Try these alternatives:</strong></p>
                <ul>
                  <li>Call us - we may serve through partners</li>
                  <li>Check nearby ZIP codes</li>
                  <li>Ask about special delivery options</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .service-checker {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .service-checker h2 {
          color: #1e293b;
          margin-bottom: 5px;
          font-size: 24px;
        }

        .service-checker p {
          color: #64748b;
          margin-bottom: 25px;
        }

        .checker-form {
          margin-bottom: 25px;
        }

        .input-group {
          display: flex;
          gap: 10px;
          max-width: 400px;
        }

        .input-group input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 18px;
          text-align: center;
          font-weight: 600;
        }

        .input-group input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .input-group button {
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .input-group button:hover {
          background: #2563eb;
        }

        .result {
          display: flex;
          gap: 15px;
          padding: 20px;
          border-radius: 12px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result.serves {
          background: #f0fdf4;
          border: 2px solid #bbf7d0;
        }

        .result.no-service {
          background: #fef2f2;
          border: 2px solid #fecaca;
        }

        .result-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .result-content {
          flex: 1;
        }

        .result-content p {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #374151;
        }

        .service-details h4,
        .alternative p strong {
          color: #1e293b;
          margin-bottom: 10px;
        }

        .service-details ul,
        .alternative ul {
          list-style: none;
          padding: 0;
          margin-bottom: 20px;
        }

        .service-details li,
        .alternative li {
          padding: 5px 0;
          color: #4b5563;
        }

        .service-details li:before {
          content: '✓ ';
          color: #10b981;
          font-weight: bold;
          margin-right: 8px;
        }

        .alternative li:before {
          content: '• ';
          color: #6b7280;
          margin-right: 8px;
        }

        .call-btn {
          background: #10b981;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .call-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .input-group {
            flex-direction: column;
            max-width: none;
          }

          .result {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}