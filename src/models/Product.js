const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Product', ProductSchema)