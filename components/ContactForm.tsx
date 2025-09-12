'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // For static export, we'll show a message directing to phone contact
    // In production, you can integrate with Cloudflare Workers or external service
    setSubmitMessage('Please call us directly at (800) 682-5062 for immediate service!');
    setFormData({ name: '', phone: '', email: '', address: '' });
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-center mb-4">Rent A Dumpster</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">Phone: *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">Email: *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">Address:</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        
        {submitMessage && (
          <p className="text-center text-sm mt-2">{submitMessage}</p>
        )}
      </form>
    </div>
  );
}