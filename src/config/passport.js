const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User')

//cuando autenticamos recibimos un campo que tiene como nombre un email y recibe una contraseña. 
//una vez q se ejecute recibo los datos y esas funcion una vez q lo recibe consulta a la base de datos. 
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email,password, done) => {
  
  //comprobamos si existe el email del usuario
  const user = await User.findOne({email})
  if(!user) {
    return done(null, false, {message: 'No se encontro usuario'});
  }else{
    //en caso de que existe el email del usuario validamos la contraseña
    //matchPassword es la funcion traida desde el modelo la cual se ejecuta al ingresar un usuario
    const match= await user.matchPassword(password)
    if(match){
      return done(null, user);
    }else{
      return done(null, false, {message: 'Contraseña incorrecta'});

    }
  }

}));

//metodo que recibe una funcion y esa funcion recibe un usuario y un done. 
//el done recibe un error, y el usuario solo la ID. 
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//y por cada vez que navegamos el va a tratar de deserializar el usuario a partir de la id que guardamos y luego tambien recibimos un callback para terminar. 
passport.deserializeUser((id,done) => {
  User.findById(id, (err,user) => {
    done(err, user);
  })
})

//lo que hace es que cuando el usuario se haya registrado vamos a guardarlo en la sesion de nuestro servidor y cuando el usuario empiece a navegar y esta registrado passport va a ser una consulta en la base de datos para ver si ese ID tiene autorizacion, si es encontrado al final va a terminar con la sesion del usuario, va a obtener los datos relacionado con el usuario. 
