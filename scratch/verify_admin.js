const bcrypt = require('bcrypt');
const hashFromDB = '$2b$10$KVr31eYqyMHpeHirOvd2B.RlMtN7ccf/Fnkls7IL66xgNCpFdfhbe';
const passwordToTest = 'justivia_admin_2026';

bcrypt.compare(passwordToTest, hashFromDB).then(match => {
  console.log(`Password: ${passwordToTest}`);
  console.log(`Hash: ${hashFromDB}`);
  console.log(`Match: ${match}`);
});
