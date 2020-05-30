require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db');
const authToken = require('./middlewares/auth-token');

const app = express();

app.use(express.json());

const corsOptions = {
  exposedHeaders: 'token',
};

app.use(cors(corsOptions));

const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const fdRoutes = require('./routes/fd');
const personRoutes = require('./routes/person');
const heirRoutes = require('./routes/heir');

app.use('/api/auth', authRoutes);
app.use('/api/account', authToken, accountRoutes);
app.use('/api/fd', authToken, fdRoutes);
app.use('/api/person', authToken, personRoutes);
app.use('/api/heir', authToken, heirRoutes);

app.listen(5000, () => {
  init();
});
