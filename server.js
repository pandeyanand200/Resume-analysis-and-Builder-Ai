const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });
require('./server/index.js');
