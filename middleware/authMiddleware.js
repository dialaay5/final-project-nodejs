const jwt = require('jsonwebtoken');
const userModel = require("../models/newUser");

const requireAuth = (req, res, next) => {
  const sessionToken = req.cookies.session;
  const token = req.cookies.jwt;
  const secretTokenKey = 'mypk';
  const secretSessionKey = 'sessionpk';

  if (sessionToken) {
    //verify session token
    jwt.verify(sessionToken, secretSessionKey, (err, decodedToken) => {
      if (err) {
        if (token) {
          //verify jwt token
          jwt.verify(token, secretTokenKey, (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect('/login');
            } else {
              console.log(decodedToken);
              //to get the user id after login
              res.locals.userId = decodedToken.id;
              next();
            }
          });
        } else {
          console.log(err.message);
          res.cookie('session', '', { sessionMaxAge: 1 });
          res.redirect('/login');
        }
      } else {
        console.log(decodedToken);
        res.locals.userId = decodedToken.id;
        next();
      }
    });
  } else if (token) {
    //verify jwt token
    jwt.verify(token, secretTokenKey, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        res.locals.userId = decodedToken.id;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

//checking current user
const checkUser = (req, res, next) => {
  const sessionToken = req.cookies.session;
  const token = req.cookies.jwt;
  const secretTokenKey = 'mypk';
  const secretSessionKey = 'sessionpk';

  if (sessionToken) {
    //verify session token
    jwt.verify(sessionToken, secretSessionKey, async (err, decodedToken) => {
      if (err) {
        if (token) {
          //verify jwt token
          jwt.verify(token, secretTokenKey, async (err, decodedToken) => {
            if (err) {
              res.locals.user = null;
              next();
            } else {
              //get the user information from the database
              let user = await userModel.findById(decodedToken.id);
              //set the user data in res.locals.user
              res.locals.user = user;
              next();
            }
          });
        } else {
          res.cookie('session', '', { sessionMaxAge: 1 });
          res.locals.user = null;
          next();
        }
      } else {
        //get the user information from the database
        let user = await userModel.findById(decodedToken.id);
        //set the user data in res.locals.user
        res.locals.user = user;
        next();
      }
    });
  } else if (token) {
    //verify jwt token
    jwt.verify(token, secretTokenKey, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        //get the user information from the database
        let user = await userModel.findById(decodedToken.id);
        //set the user data in res.locals.user
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };
