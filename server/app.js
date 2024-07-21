const cors = require('cors');
const app = require('./config/express');
const authenticateToken = require('./middleware/authMiddleware');
const userRoute = require('./route/userRoute');
const noteRoute = require('./route/noteRoute');
const labelRoute = require('./route/labelRoute');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the Notes API.');
});

app.use('/api/user', userRoute);
app.use('/api/notes', authenticateToken, noteRoute);
app.use('/api/labels', authenticateToken, labelRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\x1b[34m%s\x1b[0m', `Server is running on http://localhost:${PORT}`);
});