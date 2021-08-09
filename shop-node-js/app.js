//Import dependencies
const express = require('express');
const app = express();
const morgan = require('morgan');
//const bodyParser = require('body-parser');

//Routes Middleware
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const { json } = require('body-parser');
const mongoose = require('mongoose');

// Conecting MongoDB Atlas
mongoose.connect(
  'mongodb+srv://camzero:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0.mk5uk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
);
//
// Login data
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Create /uploads public middleware to see image
app.use('/uploads', express.static('uploads'));

app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Acess-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept , Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

//Anything that start with /products will be routed to the
// products.js file
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', userRoutes);
//Make a middleware /uploads public  to see the image
//Handling Errors
//404  Not find middleware
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

//500 Error data base
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
