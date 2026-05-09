const crypto = require('crypto');

const laws = [
  'Family Code',
  'Investment Law',
  'Consumer Protection Law',
  'Insurance Law',
  'Civil Code',
  'Commercial Code',
  'Labor Law',
  'Penal Code',
  'Real Estate Promotion Law',
  'Leasing Law',
  'Copyright Law',
  'Patent Law',
  'Trademark Law',
  'Competition Law',
  'Land Orientation Law',
  'Town Planning Law',
  'Monetary and Banking Law'
];

function hashString(str) {
  return crypto.createHash('md5').update(str.trim().toLowerCase()).digest('hex');
}

console.log('SQL to update existing entries:');
laws.forEach(law => {
  const hash = hashString(law);
  console.log(`UPDATE article_cache SET law_name = '${law}' WHERE law_name_hash = '${hash}';`);
});
