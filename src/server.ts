import express from 'express';
const app = express();

import authRoutes from './entities/user/authRoutes.js';
import boardRoutes from './entities/board/boardRoutes.js';
import listRoutes from './entities/list/listRoutes.js';
import taskRoutes from './entities/task/taskRoutes.js';
import connectDB from './config/connectDB.js';

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