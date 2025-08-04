const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');
const connectDB = require('./config/connectDB');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/list', listRoutes);
app.use('/api/task', taskRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    });