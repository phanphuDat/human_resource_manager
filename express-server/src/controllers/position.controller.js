const catchAsync = require('../helpers/catchAsync');
const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');

const COLLECTION_NAME = "positions";

const createPosition = catchAsync(async (req, res) => {
  const data = req.body;
  await insertDocument(data, COLLECTION_NAME).then((results) => {
    res.json({ ok: true, results });
  })
    .catch((error) => {
      res.status(500).json(error);
    });

});

const getPositions = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const query = {};
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


const searchPositions = catchAsync(async (req, res) => {
  const { search, page, pageSize } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    {
      $match: {
        $or: [{ name: new RegExp(search, "i") },
          { descriptions: new RegExp(search, "i") }]
      }
    },
  ];
  await findDocuments({ aggregate, limit, skip }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      res.json({ ok: true, results, page, totalPages });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const updatePosition = catchAsync(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results: results.value });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const deletePosition = catchAsync(async (req, res) => {
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
  createPosition,
  getPositions,
  searchPositions,
  updatePosition,
  deletePosition
};
