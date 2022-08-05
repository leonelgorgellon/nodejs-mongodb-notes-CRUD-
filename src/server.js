//aca tendremos el codigo del servidor
//el codigo de express ya que este es el frameworks del servidor

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//inicializaciones
const app = express();
require('./config/passport');

//configuraciones
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, 'views')); //indicamos donde esta la carpeta views

//config view engine 
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}); //configuramos en handlebars e indicamos donde esta el layouts y partials 
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs');

//MIDDLEWARES, funciones que se ejecutan a medida que van llegando peticiones.
app.use(express.urlencoded({ extended: false })); //lo que hace es decirle al servidor que cada vez que llegan datos a travez de un formulario transformamos esos datos en un formato json.
app.use(morgan('dev'));
app.use(methodOverride('_method')); //para enviar una consulta, en este caso lo utilizamos para el form de delete 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
//tiene q ir dsp de session passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());





//global variables
app.use((req, res, netx)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  netx();
});

//rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));

//archivos estaticos.
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
