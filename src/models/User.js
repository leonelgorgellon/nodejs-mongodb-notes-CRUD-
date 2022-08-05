const {Schema,model, models} = require('mongoose');
const bcryptj = require('bcryptjs');


const usuarioSchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  }
},{
  timestamps:true
});

//para cifrar las constraseñas
usuarioSchema.methods.encryContraseña = async password => {
  const salt = await bcryptj.genSalt(10);
  return await bcryptj.hash(password, salt);
}

//comprara la contraseña que ingresa el usuario con la que tengo en la base de datos. si devuelve true conincide y entra en la aplicacion sino no entra. 
usuarioSchema.methods.matchPassword = async function(password) {
  return await bcryptj.compare(password,this.password)
}

module.exports = model('User',usuarioSchema);