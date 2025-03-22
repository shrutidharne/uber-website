
const captainController = require('../controllers/captain.controller');
 const express = require('express');
 const router = express.Router();
const { body } = require("express-validator")
const authMiddleware = require('../middlewares/auth.middleware');
const CaptainModel = require("../models/captain.model");  // ✅ Import the correct model



router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
],
    captainController.registerCaptain
)


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    captainController.loginCaptain
)


 router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

router.get('/', async (req, res) => {
    try {
        const captains = await CaptainModel.find();  // Fetch all captains from MongoDB
        res.json(captains);
    } catch (error) {
        res.status(500).json({ message: "Error fetching captains", error });
    }
});

 module.exports = router;
