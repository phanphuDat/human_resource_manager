const fs = require('fs');
const multer = require('multer');
const { PUBLIC_URL } = require('../config/config');

const UPLOAD_DIRECTORY = './public/images/avatars';

//cấu hình lưu trữ file khi upload xong
var storage = multer.diskStorage({
  contentType: multer.AUTO_CONTENT_TYPE,
  destination: function (req, file, callback) {
    if (!fs.existsSync(UPLOAD_DIRECTORY)) {
      // Create a directory
      fs.mkdirSync(UPLOAD_DIRECTORY);
    }
    //files khi upload xong sẽ nằm trong thư mục UPLOAD_DIRECTORY
    callback(null, UPLOAD_DIRECTORY);
  },
  // tạo tên file
  filename: function (req, file, callback) {
    // Xử lý tên file
    const filename = req.params.id + file.originalname;
    // return
    callback(null, filename); // file.originalname là tên gốc của file
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(null, false);
  }
}
// image path
// limit: 5mb
// filter : png, jpeg,jpg

//Khởi tạo middleware với cấu hình storage, lưu trên local của server khi dùng multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
//Lưu ý: upload.single('file') - tên của thuộc tính name trong input phải giống với 'file" trong hàm upload.single

module.exports = upload;