const express = require('express');
const router = express.Router();
const controller = require('../controllers/customers');

router.get('/',controller.list);
router.get('/:id',controller.get);
router.post('/',controller.create);
router.put('/:id',controller.update);
router.delete('/:id/:region',controller.destroy);

module.exports = router;