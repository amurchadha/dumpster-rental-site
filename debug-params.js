// Quick debug script to test parameter structure
const { generateAllCityParams } = require('./lib/city-generator');

console.log('Generated parameters:');
const params = generateAllCityParams();
console.log(JSON.stringify(params, null, 2));