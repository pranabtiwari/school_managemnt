const express = require('express');
const app = express();
const schoolRoutes = require('./routes/school');

app.use(express.json()); 

app.use('/api', schoolRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
