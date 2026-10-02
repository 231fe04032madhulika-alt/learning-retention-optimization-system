const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const bearer = token.split(' ')[1];
        const decoded = jwt.verify(bearer || token, process.env.JWT_SECRET || 'secretkey');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
