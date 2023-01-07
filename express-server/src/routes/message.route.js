var router = require('express').Router();
var { allMessages, sendMessage } = require('../controllers/message.controller')

router.get('/:chatId', allMessages)
router.route('/').post(sendMessage)

module.exports = router;