const { model } = require("mongoose");

const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  //passport tambien tiene una funcion que se encarga de verificar si existe la sesion del usuario o no. 
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error_msg', 'No esta autorizado')
  res.redirect('/users/signin');
};  
//si el usuario esta authenticado que navegue libremente sino que lo direccione al login 

module.exports = helpers;