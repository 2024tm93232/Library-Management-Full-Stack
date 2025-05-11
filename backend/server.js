const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const exchangeRequestsRoutes = require('./routes/exchangeRequestsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors({
    origin: '*', 
    // origin: 'http://localhost:4200', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true 
  }));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', exchangeRequestsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/', (req, res) => {
    res.send('Hello World!')
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
