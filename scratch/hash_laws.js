const crypto = require('crypto');

function hashString(str) {
  return crypto.createHash('md5').update(str.trim().toLowerCase()).digest('hex');
}

const laws = [
  'administrative-procedure-2008',
  'communal-code-2011',
  'wilaya-code-2012',
  'public-contracts-2015',
  'civil-service-2006'
];

laws.forEach(law => {
  console.log(`${law}: ${hashString(law)}`);
});
