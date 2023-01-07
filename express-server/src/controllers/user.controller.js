const catchAsync = require("../helpers/catchAsync");
const {
  insertDocument,
  insertDocuments,
  updateDocument,
  updateDocuments,
  deleteDocument,
  deleteDocuments,
  findDocument,
  findDocuments,
} = require("../helpers/MongoDbHelper");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../config/jwtSettings");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const sendEmail = require("../utils/email/sendEmail");

const COLLECTION_NAME = "users";
const AVATAR_DIRECTORY = "/images/avatars/";



const createUser = catchAsync(async (req, res) => {
  const data = req.body;
  data.role = "employee";
  data.departmentId = ObjectId(data.departmentId);
  data.positionId = ObjectId(data.positionId);
  await insertDocument(data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// admin getUsers
const getAllUsers = catchAsync(async (req, res) => {
  const { page, pageSize } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const query = { role: { $in: ["employee", "manager"] } };
  await findDocuments({ query, limit, skip }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      // console.log(totalPages);
      res.json({ ok: true, results, page, totalPages });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Search
const getUsers = catchAsync(async (req, res) => {
  const { search, page, pageSize } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const query = {
    $and: [
      { role: { $in: ["employee", "manager"] } },
      { $text: { $search: `\"${search}\"` } },
    ],
  };
  await findDocuments({ query, limit, skip }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      res.json({ ok: true, results, page, totalPages });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// employee getUser
const getUser = catchAsync(async (req, res) => {
  const bearerToken = req.get("Authorization").replace("Bearer ", "");
  const payload = jwt.decode(bearerToken, { json: true });
  const { uid } = payload;
  // res.json({ uid })
  const aggregate = [
    { $match: { _id: ObjectId(uid) } },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "departments",
      },
    },
    {
      $unwind: "$departments",
    },
    {
      $lookup: {
        from: "positions",
        localField: "positionId",
        foreignField: "_id",
        as: "positions",
      },
    },
    {
      $unwind: "$positions",
    },
    {
      $project: {
        fullname: 1,
        avatarUrl: 1,
        email: 1,
        CCCD: 1,
        salary: 1,
        phone: 1,
        degree: 1,
        department: "$departments.name",
        position: "$positions.name",
        gender: 1,
        skill: 1,
        address: 1,
        birthday: 1,
        bank: 1,
        dateStart: 1,
      },
    },
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const adminUpdateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  const avatarUrl = AVATAR_DIRECTORY + req.file.filename;
  const data = { avatarUrl, ...user };
  data.departmentId = ObjectId(data.departmentId);
  data.positionId = ObjectId(data.positionId);
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, avatarUrl });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const employeeUpdateUser = catchAsync(async (req, res) => {
  const bearerToken = req.get("Authorization").replace("Bearer ", "");
  const payload = jwt.decode(bearerToken, { json: true });
  const { uid } = payload;
  let {
    role,
    salary,
    positionId,
    departmentId,
    email,
    fullname,
    active,
    ...data
  } = req.body;

  if (req.file.filename) data.avatarUrl = AVATAR_DIRECTORY + req.file.filename;
  // const avatarUrl = AVATAR_DIRECTORY + req.file.filename;
  await updateDocument(uid, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteDocument(id, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = {
  createUser,
  getAllUsers,
  getUsers,
  getUser,
  adminUpdateUser,
  employeeUpdateUser,
  deleteUser,
};
