const { Router } = require('express');
const itemControllers = require('../controllers/itemControllers');

const router = Router();

router.get('/items', itemControllers.getItems)
router.post('/item',itemControllers.setItem)
router.put('/item/:id',itemControllers.UpdateItems)
router.delete('/item/:id',itemControllers.DeleteItems)

module.exports = router;
