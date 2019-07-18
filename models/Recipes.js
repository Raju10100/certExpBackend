const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new mongoose.Schema({
    title:{type:String, required:true},
    ingredients:{type:String, required:true},
    instructions:{type:String, required:true},
    time:{type: Number, required:true},
    difficulty: {type:Number, required:true, min:0, max:5}
})


module.exports = mongoose.model('Recipe', recipeSchema)