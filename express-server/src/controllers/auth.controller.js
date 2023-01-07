const catchAsync = require("../helpers/catchAsync");
const { findDocuments } = require("../helpers/MongoDbHelper");
var { authValidation } = require("../validations/index");
var validateSchema = require("../middleware/validate");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../config/jwtSettings");
const User = require("../models/user.model");
const { ObjectId } = require("mongodb");
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");

const COLLECTION_NAME = "users";

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

// admin getUsers
const auth = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { role } = req.params;
  let query;

  if (role === "manager") {
    query = {
      email: { $eq: email },
      password: { $eq: password },
      role: { $in: ["manager", "admin"] },
    };
  } else {
    if (role === "employee") {
      query = {
        email: { $eq: email },
        password: { $eq: password },
      };
    } else {
      res.status(400);
    }
  }

  const login = await findDocuments({ query }, COLLECTION_NAME);
  if (login.length > 0) {
    // jwt - payload là thông tin mà ta đưa vào băm tạo token và sau khi giải mã token ra ta sẽ biết được
    var payload = {
      uid: login[0]._id,
      role: login[0].role,
      departmentId: login[0].departmentId,
      avatarUrl: login[0].avatarUrl,
      fullname: login[0].fullname,
    };

    // .sign băm thông tin payload với mã SECRET theo các thông số
    var token = jwt.sign(payload, jwtSettings.SECRET, {
      expiresIn: 86400, // expires in 24 hours - thời gian hết hạn token tính theo giây
      issuer: jwtSettings.ISSUER, //thông tin người phát hành token
      audience: jwtSettings.AUDIENCE, // thông tin người sử dụng token
      algorithm: "HS512", // loại thuật toán băm (hash)
    });

    // var authInfo = await User.findById()

    res.status(200).json({
      _id: login[0]._id,
      token,
      fullname: login[0].fullname,
      email: login[0].email,
      avatarUrl: login[0].avatarUrl,
      payload,
    });
    return;
  }

  res.status(401).json({
    message: "Unauthorized",
  });
});

const userChangePassword = catchAsync(async (req, res) => {
  const bearerToken = req.get("Authorization").replace("Bearer ", "");
  const payload = jwt.decode(bearerToken, { json: true });
  const { uid } = payload;
  let { password, newPassword } = req.body;
  await findDocuments(
    { query: { _id: ObjectId(uid) }, password: password },
    COLLECTION_NAME
  )
    .then((results) => {
      if (results !== []) {
        updateDocument(uid, { password: newPassword }, COLLECTION_NAME)
          .then((results) => {
            res.json({ ok: true, message: "Đổi mật khẩu thành công" });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const searchUser = async (req, res) => {
  const { fullname } = req.query;

  const user = await User.find({
    fullname: { $regex: fullname, $options: "i" },
  }).select("fullname avatarUrl _id email");

  res.status(200).json(user);
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (!oldUser) throw new Error("Email does not exist");

  let token = await Token.findOne({ userId: oldUser._id });
  if (token) await token.deleteOne();

  let resetToken = await crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: oldUser._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${oldUser._id}`;

  sendEmail(
    oldUser.email,
    "Password reset Request",
    {
      name: oldUser.name,
      link: link,
    },
    "./template/requestResetPassword.handlebars"
  );
  res.json(link);
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  // const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await User.updateOne(
    { _id: req.user._id },
    { $set: { password: password } },
    { new: true }
  );

  const user = await User.findById({ _id: req.user._id });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );

  await req.resetToken.deleteOne();
  res.status(201).json(true)
};

module.exports = {
  auth,
  userChangePassword,
  searchUser,
  requestPasswordReset,
  resetPassword
};
