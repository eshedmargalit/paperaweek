import mongoose from 'mongoose';

import createApp from './utils';

import { getEnvironmentVariable } from './config/keys';
import './models/User';
import './models/Paper';
import './models/Review';

// Mongoose 8.x - deprecated options and methods removed
mongoose.connect(getEnvironmentVariable('MONGO_URI'));

// Google Auth requires port 5000
const PORT = 5000;
const HOST = '0.0.0.0';

createApp().listen(PORT, HOST, () => {
  console.log(`📝 Listening on ${HOST}:${PORT}`);
});
