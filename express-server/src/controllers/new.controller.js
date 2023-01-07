const catchAsync = require('../helpers/catchAsync');
var jwt = require('jsonwebtoken');
const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');
const { ObjectID } = require('bson');

const COLLECTION_NAME = "news";

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
    $project: { title: 1, userId: 1, fullname: "$user.fullname", avatarUrl: "$user.avatarUrl", time: 1, content: 1 }
  },
]

const createNew = catchAsync(async (req, res) => {
  const bearerToken = req.get('Authorization').replace('Bearer ', '');
  const payload = jwt.decode(bearerToken, { json: true });
  const { uid } = payload;
  const data = req.body;
  data.userId = ObjectID(uid);
  data.time = new Date();
  await insertDocument(data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });

});

const getNews = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  let gimList;
  await findDocuments({ aggregate: [{ $match: { pin: true } }, { $sort: { time: -1 } }, { $project: { title: 1, time: 1 } }] }, COLLECTION_NAME)
    .then((results) => {
      gimList = results;
    })
    .catch((error) => {
      res.status(500).json(error);
    });
  await findDocuments({ aggregate: [{ $sort: { time: -1 } }, { $skip: skip }, { $limit: limit }, ...lookupUser] }, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, newsList: results, gimList });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const getNew = catchAsync(async (req, res) => {
  const { id } = req.params;
  await findDocuments({ aggregate: [{ $match: { _id: ObjectID(id) } }, ...lookupUser] }, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const searchPosts = catchAsync(async (req, res) => {
  const { search } = req.query;
  await findDocuments({ query: { $text: { $search: `\"${search}\"` } } }, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


const updateNew = catchAsync(async (req, res) => {
  const { userId, time, ...data } = req.body;
  const { id } = req.params;
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results: results.value });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const deleteNew = catchAsync(async (req, res) => {
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
  createNew,
  getNew,
  getNews,
  searchPosts,
  updateNew,
  deleteNew
};
