const { ObjectId } = require('mongodb');
const catchAsync = require('../helpers/catchAsync');
const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');

const COLLECTION_NAME = "bonus_punish";


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
    $project: { userId: "$user._id", fullname: "$user.fullname", avatarUrl: "$user.avatarUrl", date: 1, money: 1, reason: 1, _id: 1 }
  },
];

const createbonuspunishs = catchAsync(async (req, res) => {
  const list = req.body;
  list.forEach(item => {
    item.userId = ObjectId(item.userId);
    item.date = new Date(item.date);
  });
  await insertDocuments(list, COLLECTION_NAME).then((results) => {
    res.json({ ok: true, results });
  })
    .catch((error) => {
      res.status(500).json(error);
    });

});

const searchBonusPunishs = catchAsync(async (req, res) => {
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

const getBonusPunishs = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    ...lookupUser,
  ];
  await findDocuments({ limit, skip, aggregate }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      res.json({ ok: true, results, page, totalPages });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const updateBonusPunish = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { date, money, reason } = req.body;
  // date = new Date(date)
  const data = { date, money, reason };
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const deleteBonusPunish = catchAsync(async (req, res) => {
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
  createbonuspunishs,
  getBonusPunishs,
  searchBonusPunishs,
  updateBonusPunish,
  deleteBonusPunish
};
