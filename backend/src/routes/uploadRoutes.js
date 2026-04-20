const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const router = express.Router();

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File nahi mili" });
        }
        res.status(200).json({ url: req.file.path });
    } catch (error) {
        // Ye error terminal mein print hoga
        console.error("UPLOAD_ERROR ===>", error); 
        res.status(500).send(error.message);
    }
});

module.exports = router;