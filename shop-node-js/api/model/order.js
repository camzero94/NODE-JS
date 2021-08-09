const mongoose = require('mongoose');
//Pass a js object to define how a model should look like
// required attribute must be passes in the request
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

// Export model 'Product' is the name of the model
module.exports = mongoose.model('Order', orderSchema);
