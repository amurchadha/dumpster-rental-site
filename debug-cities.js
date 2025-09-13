const { generateCitiesForState } = require('./lib/city-generator.ts');

console.log("Cities generated for Pennsylvania:");
const paCities = generateCitiesForState('pennsylvania', 50);
console.log(paCities);
console.log(`Total: ${paCities.length}`);

console.log("\nLooking for Philadelphia:");
console.log("Contains philadelphia?", paCities.includes('philadelphia'));
console.log("Contains phila?", paCities.filter(c => c.includes('phila')));