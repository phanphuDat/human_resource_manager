const { ObjectId } = require('mongodb');
const catchAsync = require('../helpers/catchAsync');
const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');

const COLLECTION_NAME = "dayOff";


const lookupUser = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: "$user"
  },
  {
    // $project: { "$user.fullname": 1, "$user.avatarUrl": 1, date: 1, money: 1, reason: 1, _id: 1 }
    $project: {
      userId: "$user._id",
      fullname: "$user.fullname",
      avatarUrl: "$user.avatarUrl",
      dateStart: 1,
      dateEnd: 1,
      status: 1,
      reason: 1,
      _id: 1
    }
  },
];

// employee controller
const createDayOff = catchAsync(async (req, res) => {
  let data = req.body;
  //ép kiểu trước khi lưu
  data.userId = ObjectId(data.userId);
  data.dateStart = new Date(data.dateStart);
  data.dateEnd = new Date(data.dateEnd);
  data.status = 'Chưa duyệt'; //default value
  await insertDocument(data, COLLECTION_NAME)
    .then((results) => {
      res.json({ insertDocument: true, results });
    })
    .catch((error) => {
      res.status(500).json({ insertDocument: false, error });
    });

});

const empGetDayOffs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    { $match: { userId: ObjectId(id) } },
    { $sort: { dateEnd: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      res.json({ findDocuments: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const userUpdateDayOff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { dateStart, dateEnd, reason } = req.body;
  // date = new Date(date)
  const data = {
    dateStart: new Date(dateStart),
    dateEnd: new Date(dateEnd),
    reason: reason,
    status: 'Chưa duyệt'
  };
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ updateDocument: true, results });
    })
    .catch((error) => {
      res.status(500).json({ updateDocument: false, error });
    });
});

const userSearchDayOffs = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { search, page, pageSize } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    {
      $match: {
        $and: [{ reason: new RegExp(search, "i") },
        { userId: ObjectId(id) }]
      }
    },
  ];
  await findDocuments({ aggregate, limit, skip }, COLLECTION_NAME)
    .then((results) => {
      res.json({ search: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//share controller
const deleteDayOff = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteDocument(id, COLLECTION_NAME)
    .then((results) => {
      res.json({ deleteDocument: true, results });
    })
    .catch((error) => {
      res.status(500).json({ updateDocument: false, error });
    });
});
// Manager Route
const getAllDayOffs = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    { $sort: { dateEnd: -1 } },
    { $skip: skip },
    { $limit: limit },
    ...lookupUser,
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      res.json({ findDocuments: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const managerSearchDayOffs = catchAsync(async (req, res) => {
  const { search, page, pageSize } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    ...lookupUser,
    {
      $match: {
        $or: [{ reason: new RegExp(search, "i") },
        { fullname: new RegExp(search, "i") }]
      }
    },
  ];
  await findDocuments({ aggregate, limit, skip }, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const managerUpdateDayOff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = { status };
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


module.exports = {
  createDayOff,
  getAllDayOffs,
  empGetDayOffs,
  userSearchDayOffs,
  managerSearchDayOffs,
  managerUpdateDayOff,
  userUpdateDayOff,
  deleteDayOff
};
