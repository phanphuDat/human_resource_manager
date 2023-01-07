const catchAsync = require('../helpers/catchAsync');
// const randomString = require('randomstring')

const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { ObjectId } = require('mongodb');
const moment = require('moment');
moment.locale('vi')

const COLLECTION_NAME = "userShift";

// Employee
const createUserShift = catchAsync((req, res) => {
  // console.log(req.body);
  let list = req.body.map(item => {
    return {
      calendarId: ObjectId(item.calendarId),
      userId: ObjectId(item.userId),
      departmentId: ObjectId(item.departmentId),
      date: new Date(item.date),
      in: new Date(item.in),
      out: new Date(item.out)
    }
  });
  findDocument(
    list[0].calendarId
    , 'departmentCalendar')
    .then(async (findCalendar) => {
      if (findCalendar) {
        let calendar = { ...findCalendar };
        let insert = [];
        await list.forEach((item) => {
          findCalendar?.shifts?.forEach((i, ind) => {
            if (
              moment(item.in).get('hour') === moment(i.in).get('hour') &&
              moment(item.in).get('minute') === moment(i.in).get('minute') &&
              moment(item.out).get('hour') === moment(i.out).get('hour') &&
              moment(item.out).get('minute') === moment(i.out).get('minute') &&
              i.still > 0
            ) {
              let newStill = i.still - 1;
              calendar.shifts[ind].still = newStill;
              insert.push(item)
              return;
            };
          });
        });
        // await console.log('calendar', calendar);
        // await console.log('insert', insert);
        if (insert.length > 0) {
          await updateDocument(calendar._id, calendar, 'departmentCalendar');
          await insertDocuments(insert, COLLECTION_NAME);
          res.json({ message: 'đăng kí thành công', insert })
        } else res.json({ message: 'Kín lịch làm' })
      }
    })
    .catch((error) => {
      console.log('Lỗi findcalendar', error);
    });
});

const employeeGetShift = catchAsync(async (req, res) => {
  const id = req.params;
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    {
      $match: {
        userId: ObjectId(id),
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

// Manager
const aggregateGet = [{
  $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user"
  }
},
{
  $unwind: "$user"
},
{
  $project: {
    _id: 1,
    date: 1,
    calendarId: 1,
    in: 1,
    out: 1,
    timeIn: 1,
    timeOut: 1,
    fullname: '$user.fullname',
    avatarUrl: '$user.avatarUrl',
  }
},
{
  $group: {
    _id: '$date',
    userShifts: {
      $push:
      {
        _id: '$_id',
        calendarId: '$calendarId',
        in: '$in',
        out: '$out',
        timeIn: '$timeIn',
        timeOut: '$timeOut',
        fullname: '$fullname',
        avatarUrl: '$avatarUrl',
      }
    },
  }
},
{ $sort: { _id: -1 } }
];
const getAllUserShifts = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  await findDocuments({ aggregate: aggregateGet, limit, skip }, COLLECTION_NAME)
    .then((results) => {
      let totalPages = 1;
      totalPages = Math.ceil(results.length / pageSize);
      res.json({ ok: true, results, page, totalPages });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const updateUserShift = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.timeIn = new Date(data.timeIn);
  data.timeOut = new Date(data.timeOut);
  await updateDocument(id, data, COLLECTION_NAME)
    .then((results) => {
      res.json({ updateDocument: true, results });
    })
    .catch((error) => {
      res.status(500).json({ updateDocument: false, error });
    });
});

const getUserShifts = catchAsync(async (req, res) => {
  let { date } = req.query;
  date = new Date(date);
  const aggregate = [
    {
      $match: {
        $expr: {
          $and: [
            { $eq: [{ $year: date }, { $year: '$date' }] },
            { $eq: [{ $dayOfYear: date }, { $dayOfYear: '$date' }] },
          ]
        }
      }
    },
    ...aggregateGet
  ];
  await findDocuments({ aggregate }, COLLECTION_NAME)
    .then((results) => {
      res.json(results)
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Dùng chung
const deleteUserShift = catchAsync((req, res) => {
  const { id } = req.params;
  console.log(id);
  const { calendarId, out, int } = req.query;
  deleteDocument(id, COLLECTION_NAME)
    .then((results) => {
      res.json({ deleteDocument: true, results });
    })
    .catch((error) => {
      res.status(500).json({ deleteDocument: false, error });
    });
  findDocument(calendarId, 'departmentCalendar')
    .then(async (results) => {
      let calendar = results;
      await results.shifts.forEach((item, index) => {
        if (
          moment(item.in).get('hour') === moment(int).get('hour') &&
          moment(item.in).get('minute') === moment(int).get('minute') &&
          moment(item.out).get('hour') === moment(out).get('hour') &&
          moment(item.out).get('minute') === moment(out).get('minute')
        ) {
          let newStill = item.still + 1;
          calendar.shifts[index].still = newStill;
          return;
        };
      })
      await updateDocument(calendar._id, calendar, 'departmentCalendar');
    })
    .catch((error) => {
      console.log(error);
    });
});

// const reqInoutShift = async (req, res, next) => {



// }

// const updateQrcode = async (req, res) => {
//   const { id } = req.params;
//   const data = req.body;

//   const randomKey = randomString.generate(8)
//   const result = await updateDocument(id, data, COLLECTION_NAME)
// }

module.exports = {
  createUserShift,
  getAllUserShifts,
  getUserShifts,
  employeeGetShift,
  updateUserShift,
  deleteUserShift,
};
