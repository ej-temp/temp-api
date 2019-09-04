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
  },
}, { 
  timestamps: true
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

temperatureSchema.statics.getMostRecentTemps = function() {
  return this.aggregate([
    { $group: { _id: '$locationId', temps: { $addToSet: { temp: '$temp', createdAt: '$createdAt' } } } }, 
    { $project: { _id: true, temp: { $arrayElemAt: ['$temps', 0] } } }, 
    { $project: { _id: true, temp: '$temp.temp', createdAt: '$temp.createdAt' } },
    { $lookup: { from: 'locations', localField: '_id', foreignField: '_id', as: 'location' } }, 
    { $unwind: { path: '$location', } }, 
    { $project: { _id: true, temp: true, createdAt: true, name: '$location.name' } }]);
};

temperatureSchema.statics.getCurrentLow = function() {
  return this.aggregate([
    { $group: { _id: '$locationId', temps: { $addToSet: { temp: '$temp', createdAt: '$createdAt' } } } }, 
    { $project: { _id: true, temp: { $arrayElemAt: ['$temps', 0] } } }, 
    { $project: { _id: true, temp: '$temp.temp', createdAt: '$temp.createdAt' } },
    { $lookup: { from: 'locations', localField: '_id', foreignField: '_id', as: 'location' } }, 
    { $unwind: { path: '$location', } }, 
    { $project: { _id: true, temp: true, createdAt: true, name: '$location.name' } },
    { $sort: { temp: 1 } }, 
    { $limit: 1 }]);
};


module.exports = mongoose.model('Temperature', temperatureSchema);
