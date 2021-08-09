const mongoose = require('mongoose');
//Pass a js object to define how a model should look like
// required attribute must be passes in the request
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

// Export model 'Product' is the name of the model
module.exports = mongoose.model('Product', productSchema);
