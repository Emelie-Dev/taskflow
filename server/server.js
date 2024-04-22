// Core Modules

// Custom Modules

// Third Party Modules
import { config } from 'dotenv';

config({ path: './config.env' });

import app from './app.js';

app.listen(process.env.PORT || 2005, () => {
  console.log('Server has started....');
});
