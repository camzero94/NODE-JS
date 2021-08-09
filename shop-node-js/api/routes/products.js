const express = require('express');
const router = express.Router();
//Product model Mongoose
const mongoose = require('mongoose');
const Product = require('../model/product');
const multer = require('multer');
const checkAuth = require('../middleware/checkAuth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
//Filter image depending of type
//const fileFilter = (req, file, cb) => {
//  //reject file
//  if (file.mimetype === 'image/jpeg') {
//    cb(null, true);
//  } else {
//    cb(null, false);
//  }
//};

const upload = multer({
  storage: storage,
  //fileFilter: fileFilter,
});
//Register different routes
// Only "/" because otherwise /product/products
// find() method Get all products
//selecte() filter information
router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id,
            },
          };
        }),
      };
      console.log(response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// Post product to the data base /products
//Each handler is executed after the midleware
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Object created in the database',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: 'http//localhost:3000/products/' + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//Get product by ID
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      console.log('From DataBase:', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http//localhost:3000/products/' + doc._id,
          },
        });
      } else {
        res.status(404).json({ message: 'Not valid entry found for ID' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
//Post product by I
router.post('/:productId', checkAuth, (req, res, next) => {
  res.status(200).json({
    message: 'Supports POST',
  });
});
//Patch product by ID
router.patch('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;

  const updateOps = {};

  console.log(req.body);

  //In Postman [
  //  {"nameProp":"name", "value":"Camilo"},{.....}
  // ]
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updateOps })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'PATCH',
          url: 'http://localhost:3000/products/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        description: 'Deleted',
        request: {
          type: 'DELETE',
          url: 'http://localhost:3000/products/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
