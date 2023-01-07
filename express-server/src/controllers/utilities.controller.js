const { ObjectId } = require('mongodb');
const catchAsync = require('../helpers/catchAsync');
const {
  insertDocument, insertDocuments,
  updateDocument, updateDocuments,
  deleteDocument, deleteDocuments,
  findDocument, findDocuments
} = require('../helpers/MongoDbHelper');
const moment = require('moment')

moment().locale('vi');

const managerGetSalarys = catchAsync(async (req, res) => {
  const { start, end } = req.query;
  console.log(req.query);
  const aggregate = [
    {
      $match: {
        role: { $in: ['employee', 'manager'] }
      }
    },
    { $project: { _id: 1, fullname: 1, avatarUrl: 1, salary: 1 } },
    {
      $lookup: {
        from: 'userShift',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ['$$id', '$userId'] }, { $gte: ["$date", new Date(start)] }, { $lte: ["$date", new Date(end)] }] },
            },
          },
          {
            $project: {
              date: 1,
              in: 1,
              out: 1,
              timeIn: 1,
              timeOut: 1,
            }
          },
        ],
        as: 'userShifts',
      },
    },
    {
      $lookup: {
        from: "bonus_punish",
        localField: "_id",
        foreignField: "userId",
        as: "Bonus"
      }
    },
  ];
  await findDocuments({ aggregate: aggregate }, "users")
    .then((results) => {
      res.json(results)
    })
    .catch((error) => {
      res.status(500).json(error)
    });
});
const managerTimekeeping = catchAsync(async (req, res) => {
  const { start, end } = req.query;
  const aggregate = [
    {
      $match: {
        role: { $in: ['employee', 'manager'] }
      }
    },
    { $project: { _id: 1, fullname: 1, avatarUrl: 1, salary: 1 } },
    {
      $lookup: {
        from: 'userShift',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ['$$id', '$userId'] }, { $gte: ["$date", new Date(start)] }, { $lte: ["$date", new Date(end)] }] },
            },
          },
          {
            $project: {
              date: 1,
              in: 1,
              out: 1,
              timeIn: 1,
              timeOut: 1,
            }
          },
        ],
        as: 'userShifts',
      },
    },
    {
      $lookup: {
        from: "dayOff",
        localField: "_id",
        foreignField: "userId",
        as: "dayOffs"
      }
    },
  ]
  await findDocuments({ aggregate: aggregate }, "users")
    .then((results) => {
      res.json(results)
    })
    .catch((error) => {
      res.status(500).json(error)
    });
});

const userGetSalary = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.query;
  const aggregate = [
    {
      $match: {
        _id: ObjectId(id)
      }
    },
    { $project: { _id: 1, fullname: 1, avatarUrl: 1, salary: 1 } },
    {
      $lookup: {
        from: 'userShift',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ['$$id', '$userId'] }, { $gte: ["$date", new Date(start)] }, { $lte: ["$date", new Date(end)] }] },
            },
          },
          {
            $project: {
              date: 1,
              in: 1,
              out: 1,
              timeIn: 1,
              timeOut: 1,
            }
          },
        ],
        as: 'userShifts',
      },
    },
    {
      $lookup: {
        from: "bonus_punish",
        localField: "_id",
        foreignField: "userId",
        as: "bonus"
      }
    },
    {
      $lookup: {
        from: "dayOff",
        localField: "_id",
        foreignField: "userId",
        as: "dayOff"
      }
    },
  ];
  await findDocuments({ aggregate: aggregate }, "users")
    .then(result => {
      res.json(result[0]);
    })
});


// Hiển thị lịch làm theo ngày
const lookupCalendar = [
  {
    $lookup: {
      from: 'userShift',
      let: { id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$$id', '$calendarId'] },
          },
        },
        {
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
            in: 1,
            out: 1,
            fullname: '$user.fullname'
          }
        },
      ],
      as: 'usersShifts',
    },
  },
  {
    $group: {
      _id: '$date',
      departments: { $push: "$departmentId" },
      shifts: { $first: "$shifts" },
      usersShifts: { $push: "$usersShifts" },
    }
  },
];
const getWorkSchedules = catchAsync(async (req, res) => {
  const { page, pageSize, } = req.query;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const aggregate = [
    ...lookupCalendar,
    { $sort: { _id: -1 } },
    { $skip: skip },
    { $limit: limit },

  ];
  await findDocuments({ aggregate }, 'departmentCalendar')
    .then((calendarList) => {
      res.json({ ok: true, calendarList });
    })
    .catch((error) => {
      res.status(500).json(error);
    });

});

const searchWorkSchedules = catchAsync(async (req, res) => {
  const { search } = req.query;
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
    ...lookupCalendar,
  ];
  await findDocuments({ aggregate }, 'departmentCalendar')
    .then((calendarList) => {
      res.json({ ok: true, calendarList });
    })
    .catch((error) => {
      res.status(500).json(error);
    });

});

module.exports = {
  managerGetSalarys, managerTimekeeping,
  userGetSalary, getWorkSchedules, searchWorkSchedules
};
