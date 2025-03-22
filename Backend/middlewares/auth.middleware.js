const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
 const captainModel = require('../models/captain.model');


 module.exports.authUser = async (req, res, next) => {
const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
         return res.status(401).json({ message: 'Unauthorized' });
     }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Auth User Middleware: Decoded Token:", decoded); // Debugging log
        const user = await userModel.findById(decoded._id);
        // console.log("Auth User Middleware: Found User:", user); // Debugging log

        req.user = user;
        console.log("✅ User authenticated:", req.user._id);
        return next();

    } catch (err) {
//  console.error("Auth User Middleware: JWT Error:", err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
   }

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    
    console.log("Auth Captain Middleware: Received Token:", token); // Debugging log


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });



    if (isBlacklisted) {
        console.log("Auth Captain Middleware: Token is blacklisted"); // Debugging log
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}
