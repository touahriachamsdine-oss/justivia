const bcrypt = require('bcrypt');
bcrypt.hash('justivia_admin_2026', 10).then(hash => console.log('Hash:', hash));
