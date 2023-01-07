var jwt = require("jsonwebtoken");
const { findDocuments, findDocument } = require("../helpers/MongoDbHelper");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");

// CHECK ROLES
const allowRoles = (...roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get("Authorization").replace("Bearer ", "");

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const { uid } = payload;
    // FING BY _id
    findDocument(uid, "users")
      .then((user) => {
        if (user && user.role) {
          let ok = false;
          roles.forEach((role) => {
            if (role === user.role) {
              ok = true;
              return;
            }
          });
          if (ok) {
            next();
          } else {
            response.status(403).json({ message: "Forbidden" }); // user is forbidden
          }
        } else {
          response.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
      })
      .catch(() => {
        response.sendStatus(500);
      });
  };
};

const isResetTokenValid = async (req, res, next) => {
  const { id, token } = req.query;
  if (!id || !token)
    return res.status(403).json({ message: "Invalid request" });

  const user = await User.findById(id);
  if (!user) return res.status(403).json({ message: "User not found" });

  const resetToken = await Token.findOne({ id: user._id });
  if (!resetToken) return res.status(403).json({ message: " not found" });

  const isValid = await bcrypt.compare(token, resetToken.token);
  if (!isValid) {
    console.log("Invalid token");
    res.status(300).json({ message: "Invalid token" });
  } else {
    req.user = user;
    req.resetToken = resetToken;
    next();
  }
};

const isValidDataShift = async (req, res, next) => {
  const { id } = req.params;
  if(id) {
    
  }
  let randomKey = ''
  const time = await setInterval(() => {
    randomKey = randomString.generate(20)
    soket.emit('stringRandom', randomKey)
    console.log('stringRandom')
  }, 1000)
  
};
module.exports = { allowRoles, isResetTokenValid };
