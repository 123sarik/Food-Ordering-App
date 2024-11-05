const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwtSecret = "Mynameissarikadubey#$"

router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('location').notEmpty() // Ensure location is not empty
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
        return res.status(400).json({errors: errors.array() });
    }


        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt);
        try {
        await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location
        }).then(res.json({success: true}))

    } catch (error) {
        console.log(error)
        res.json({ success: false });
    }
})

// Route for user login
router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5})]
    , async (req, res) => { 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email; 

    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ error: "Try logging with correct credentials" });
        }

        const pwdcompare = await bcrypt.compare(req.body.password, userData.password);
        if (!pwdcompare) {
            return res.status(400).json({ error: "Try logging with correct credentials" });
        }

        const data = {
            user: {
                id: userData.id
            }
        }

        const authToken = jwt.sign(data, jwtSecret);
        return res.json({ success: true, authToken:authToken});
        
    } catch (error) {
        console.log(error)
        res.json(500).json({ success: false });
    }
})

module.exports = router; 

