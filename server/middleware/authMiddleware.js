const {verifyToken} = require('../service/authService')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).send({error: 'Unauthorized'});
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send({error: 'Unauthorized'});
    }

    try {
        const id = verifyToken(token);
        req.user = id;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).send({error: 'Invalid token'});
    }
}

module.exports = authenticateToken;