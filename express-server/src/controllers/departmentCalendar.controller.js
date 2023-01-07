const catchAsync = require('../helpers/catchAsync');
const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = "departmentCalendar";

const groupDepartmentCalendar = {
  $group: {
    _id: '$date',
    departments: { $push: "$departmentId" },
    shifts: { $first: "$shifts" },
    shiftsList: { $push: "$shifts" },
    date: { $first: "$date" },
    uid: { $push: "$_id" }
  }
};

const createDepartmentCalendar = catchAsync(async (req, res) => {
  let list = req.body;
  //ép kiểu trước khi lưu
  list.forEach(element => {
    element.date = new Date(element.date);
    element.departmentId = ObjectId(element.departmentId);
    element.shifts.forEach(item => {
      item.in = new Date(item.in);
      item.out = new Date(item.out);
    });
  });
  // kiểm tra xem tồn tại thì update, chưa có thì insert
  list.forEach(async element => {
    const aggregate =
      [{
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $dayOfYear: '$date' }, { $dayOfYear: element.date }] },
              { $eq: [{ $year: '$date' }, { $year: element.date }] },
              { $eq: ["$departmentId", element.departmentId] },
            ]
          }
        }
      },
      ];
    var insert = [];
    var update = [];
    var err = [];
    await findDocuments({ aggregate }, COLLECTION_NAME)
      .then((findResults) => {
        if (findResults.length !== 0) {
          findResults.forEach(async item => {
            await updateDocument(item._id, element, COLLECTION_NAME)
              .then((updateResults) => {
                // console.log('update', element);
                update.push(updateResults.value);
              })
              .catch((error) => {
                err.push({ date: element.date, error })
              });
          })
        } else {
          insertDocument(element, COLLECTION_NAME)
            .then((results) => {
              // console.log('insert', element);
              insert.push(element);
            })
            .catch((error) => {
              err.push({ date: element.date, error });
            });
        }
      })
      .catch((error) => {
        console.log({ findError: error });
      });
  });
  res.status(200).json({ insert: insert.length, update: update.length });
});


const getAllDepartmentCalendars = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    groupDepartmentCalendar,
    { $sort: { date: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      res.json({
        // ok: true, 
        results, page, totalPages
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const employeeGetCalendars = catchAsync(async (req, res) => {
  const id = req.params;
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    {
      $match: {
        departmentId: ObjectId(id),
        // date: { $gt: new Date }
      }
    },
    {
      $unwind: "$shifts"
    },
    {
      $match: {
        $expr:
          { $gt: ['$shifts.still', 0] }
      }
    },
    {
      $lookup: {
        from: 'userShift',
        let: {
          id: '$_id'
          , in: '$shifts.in', out: '$shifts.out',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$$id', '$calendarId'] },
                  { $eq: [{ $hour: '$$in' }, { $hour: '$in' }] },
                  { $eq: [{ $hour: '$$out' }, { $hour: '$out' }] },
                ]
              },
            },
          },
        ],
        as: 'usersShifts',
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [[], '$usersShifts'] },
          ]
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        shifts: { $push: "$shifts" },
        date: { $first: "$date" },
      }
    },
    { $sort: { date: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      res.json({
        results, page, totalPages
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Search
const getDepartmentCalendars = catchAsync(async (req, res) => {
  const { search } = req.query;
  console.log(new Date(search)
  );
  const aggregate = [
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $dayOfYear: '$date' }, { $dayOfYear: new Date(search) }] },
            { $eq: [{ $year: '$date' }, { $year: new Date(search) }] },
          ]
        }
      }
    },
    groupDepartmentCalendar
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, results });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


const updateDepartmentCalendar = catchAsync(async (req, res) => {
  let { data, uid } = req.body;
  let listId = uid.map(element => ObjectId(element))
  console.log(listId);
  data.forEach(element => {
    element.date = new Date(element.date);
    element.departmentId = ObjectId(element.departmentId);
    element.shifts.forEach(item => {
      item.in = new Date(item.in);
      item.out = new Date(item.out);
    });
  });
  let query = { _id: { $in: listId } }
  await deleteDocuments(query, COLLECTION_NAME).then((results) => {
    console.log(results);
  })
    .catch((error) => {
      console.log(error);
    });
  await insertDocuments(data, COLLECTION_NAME)
    .then((results) => {
      res.json({ ok: true, message: 'cập nhật thành công' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'cập nhật thât bại', error });
    });
});

const deleteDepartmentCalendar = catchAsync(async (req, res) => {
  let { uid } = req.query;
  let listId = uid.split(' ').filter(item => item !== '').map(element => ObjectId(element));
  // console.log(listId);
  let query = { _id: { $in: listId } }
  await deleteDocuments(query, COLLECTION_NAME).then((results) => {
    res.status(200).json({ results });
  })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

module.exports = {
  createDepartmentCalendar,
  getAllDepartmentCalendars,
  employeeGetCalendars,
  getDepartmentCalendars,
  updateDepartmentCalendar,
  deleteDepartmentCalendar,
};
