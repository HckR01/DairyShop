const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Chacha, aap admin nahi ho!" });
    }
};

module.exports = { admin };