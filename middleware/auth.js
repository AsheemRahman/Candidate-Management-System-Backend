import jwt from 'jsonwebtoken'


export const Verify =  (roles) => {
    return (req, res, next) => {

        const token = req.cookies?.Admin_Token || req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = decoded;
            next();
        });
    };
};