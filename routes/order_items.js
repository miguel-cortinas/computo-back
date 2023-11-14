const express = require('express');
const router = express.Router();
const controller = require('../controllers/order_items');

router.get('/',controller.list);
router.get('/:id',controller.get);
router.delete('/:id/:item_id',controller.destroy);
router.post('/',controller.create);
router.put('/:id/:item_id',controller.update);

module.exports = router;