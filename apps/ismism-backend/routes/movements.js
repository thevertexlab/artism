const express = require('express');
const router = express.Router();
const { 
  getAllArtMovements,
  getArtMovementById,
  createArtMovement,
  updateArtMovement,
  deleteArtMovement,
  getContemporaryMovements
} = require('../controllers/artMovementController');

// 获取所有艺术运动
router.get('/', getAllArtMovements);

// 获取contemporary_movements数据库中的艺术运动
router.get('/contemporary', getContemporaryMovements);

// 获取单个艺术运动
router.get('/:id', getArtMovementById);

// 创建艺术运动
router.post('/', createArtMovement);

// 更新艺术运动
router.put('/:id', updateArtMovement);

// 删除艺术运动
router.delete('/:id', deleteArtMovement);

module.exports = router; 