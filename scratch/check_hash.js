const bcrypt = require('bcrypt');
const hash = '$2b$10$gec7AJ8hPRr01TElrzEc3eeh1ogM.ytIpQ4GWG2Nzwbp5qY/80pHe';
bcrypt.compare('admin123', hash).then(res => console.log('Match admin123:', res));
bcrypt.compare('admin', hash).then(res => console.log('Match admin:', res));
bcrypt.compare('password', hash).then(res => console.log('Match password:', res));
bcrypt.compare('justivia123', hash).then(res => console.log('Match justivia123:', res));
