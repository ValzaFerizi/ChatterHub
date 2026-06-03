@'
const express = require('express');
const cors = require('cors');

const formRoutes = require('./routes/form.routes');
const sectionRoutes = require('./routes/section.routes');
const questionRoutes = require('./routes/question.routes');
const responseRoutes = require('./routes/response.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend API is running'
  });
});

app.use('/api/forms', formRoutes);
app.use('/api', sectionRoutes);
app.use('/api', questionRoutes);
app.use('/api', responseRoutes);

module.exports = app;
'@ | Set-Content backend\src\app.js