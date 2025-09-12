// Count total pages that will be generated
const { getTotalExpectedPages } = require('../lib/city-generator.ts');

try {
  const { cityPages, totalPages } = getTotalExpectedPages();
  
  console.log('📊 Phase 2 Page Count:');
  console.log(`🏙️  City pages: ${cityPages.toLocaleString()}`);
  console.log(`🏛️  State pages: 51`);
  console.log(`📄 Main pages: 6`);
  console.log(`🎯 Total pages: ${totalPages.toLocaleString()}`);
  
  console.log('\n📈 Breakdown by state type:');
  console.log('• Major states (6): 50 cities each = 300 pages');
  console.log('• Regular states (45): 25 cities each = 1,125 pages');
  console.log('• Total city pages: 1,425');
  
} catch (error) {
  // Fallback calculation
  const majorStates = 6;
  const regularStates = 45;
  const cityPages = (majorStates * 50) + (regularStates * 25);
  const totalPages = cityPages + 51 + 6;
  
  console.log('📊 Phase 2 Page Count (calculated):');
  console.log(`🏙️  City pages: ${cityPages.toLocaleString()}`);
  console.log(`🎯 Total pages: ${totalPages.toLocaleString()}`);
}