const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  temp: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Temperature', temperatureSchema);
