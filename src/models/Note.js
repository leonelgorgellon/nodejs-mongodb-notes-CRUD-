const {Schema, model} = require('mongoose');

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user:{
    type: String,
    required: true,
  }
},{
  //cuando fue creado o actualizado por ultima vez
  timestamps:true
});

module.exports = model('Note', noteSchema);