const userCtrl = {};
const passport = require('passport');
const User = require("../models/User");

//REGISTRARSE
userCtrl.renderSignUpForm = (req, res, next) => {
  res.render('users/signup');
};

userCtrl.signup = async (req,res) => {
  //validamos la contraseña e imprimimos el text errors
  const errors = [];
  const {name, email, password, confirm_password} = req.body;
  if(password != confirm_password) {
    errors.push({text:'Contraseñas no coinciden.'});
  }
  if(password.length < 4){
    errors.push({text:'Contraseña debe estar compuesta por al menos 4 caracteres.'})
  }
  if(errors.length > 0) {
    res.render('users/signup',{
      //devolvemos el error, el nombre y email.
      errors,
      name,
      email
    })
  }else {
    //hacemos busqueda en la base de datos para ver si el usuario ya existe. 
    const emailUser = await User.findOne({email: email});
    if(emailUser){
      req.flash('error_msg', 'El correo ya está en uso.')
      res.redirect('/users/signup')
    }else{
      const newUser = new User({name, email, password});
      //antes de guardar ciframos la contraseña
      newUser.password = await newUser.encryContraseña(password);
      req.flash('success_msg', 'Usted se ha registrado')
      await newUser.save();
      res.redirect('/users/signin');
    }
  }
};
//-----------------------------------


//VUELVE A ENTRAR EN LA APLICACIÓN
userCtrl.renderSignInForm = (req, res) => {
  res.render('users/signin');

};

userCtrl.signin = passport.authenticate('local',{
  //aca ponemos las dos opciones, una cuando hay algun error donde lo direccionamos y la otra si esta todo ok a donde la redireccionamos. 
  failureRedirect: '/users/signin',
  successRedirect: '/notes',
  //cuando exista un msj de error indicamos q utilice flash. 
  failureFlash: true,
});


//---------------------------------

//SALIR DE LA APLICACION
userCtrl.logout = (req,res, next) => {
  req.logout((err) => {
    if(err) return next(err);
  req.flash('success_msg', 'Tu sesión ha sido cerrada');
  res.redirect('/users/signin');
});
};


module.exports = userCtrl;