const express = require('express');
const { default: mongoose } = require('mongoose');
const { createProduct } = require('./controller/Product');
const server=express();
const productRouters=require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const usersRouter= require('./routes/Users');
const authRouter=require('./routes/Auth');
const cartRouter=require('./routes/Cart');
const ordersRouter=require('./routes/Order');
const cors=require('cors')
const crypto = require('crypto');
const session = require('express-session');
const passport = require('passport');
const { sanitizeUser, isAuth, cookieExtractor } = require('./services/common');
const LocalStrategy=require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { User } = require('./model/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser=require('cookie-parser');
const SECRET_KEY = 'SECRET_KEY';

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; 

server.use(express.static('build'))
server.use(cookieParser());
server.use(
    session({
      secret: 'keyboard cat',
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
    })
);

server.use(passport.authenticate('session'));
server.use(cors({
    exposedHeaders:['X-Total-Count']
}
))

server.use(express.json());
server.use('/products',isAuth(),productRouters.router)
server.use('/categories',isAuth(), categoriesRouter.router);
server.use('/brands',isAuth(), brandsRouter.router);
server.use('/users',isAuth(), usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart',isAuth(), cartRouter.router);
server.use('/orders',isAuth(), ordersRouter.router);

passport.use(
    'local',
    new LocalStrategy(
        {usernameField:'email'},
        async function (email, password, done) {
      // by default passport uses username
      try {
        const user = await User.findOne({ email: email });
        console.log(email, password, user);
        if (!user) {
          return done(null, false, { message: 'invalid credentials' }); // for safety
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          'sha256',
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: 'invalid credentials' });
            }
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            done(null, {token}); // this lines sends to serializer
          }
        );
      } catch (err) {
        done(err);
      }
    })
  );

  passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log({ jwt_payload });
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, sanitizeUser(user)); // this calls serializer
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );

  passport.serializeUser(function (user, cb) {
    console.log('serialize', user);
    process.nextTick(function () {
      return cb(null, { id: user.id, role: user.role });
    });
  });
  
  // this changes session variable req.user when called from authorized request
  
  passport.deserializeUser(function (user, cb) {
    console.log('de-serialize', user);
    process.nextTick(function () {
      return cb(null, user);
    });
  });

main().catch(err=>console.log(err));
async function main(){
    await mongoose.connect('mongodb+srv://admin:Hritik%40123@cluster0.wr9ar1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
   console.log("connection successful");
}


server.listen(8080,()=>{
    console.log("server started");
})