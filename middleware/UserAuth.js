import jwt from 'jsonwebtoken';

export const verifyToken = (role) => {
    return (req, res, next) => {
        const token = req.cookies?.Candidate_Token || req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(errorHandler(403, 'Token is not valid!'));
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = user;
            next();
        });
    }
}