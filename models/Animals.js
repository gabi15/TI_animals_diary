const mongoose = require('mongoose');

const AnimalSchema = mongoose.Schema({
    user_id : mongoose.ObjectId,
    animal: { type: String, required: true },
    description: String,
    quantity: {type:Number,required:true},
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Animals', AnimalSchema);