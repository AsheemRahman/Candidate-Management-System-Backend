import jwt from 'jsonwebtoken'
import UserSchema from '../models/candidateSchema.js'
import bcryptjs from 'bcryptjs'


export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(404).json({ message: "All fields are required" });
            return;
        }

        const admin = await UserSchema.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcryptjs.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let jwtSecretKey = process.env.JWT_SECRET || '';
        let token = jwt.sign({ id: admin._id, role: admin.role }, jwtSecretKey, { expiresIn: '1h' });
        res.cookie('Admin_Token', token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 }).status(200).json({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


export const allCandidate = async (req, res) => {
    try {
        const candidates = await UserSchema.find({ role: 'candidate' });
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching candidates' });
    }
};


export const createCandidate = async (req, res) => {
    const { name, email, password, mobile, address } = req.body;
    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newCandidate = new UserSchema({
            name,
            email,
            password: hashedPassword,
            role: 'candidate',
            mobile,
            address,
        });
        await newCandidate.save();
        res.json({ message: 'Candidate created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating candidate' });
    }
};


export const deleteCandidate = async (req, res) => {
    try {
        await UserSchema.findByIdAndDelete(req.params.id);
        res.json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting candidate' });
    }
};


export const candidateDetail = async (req, res) => {
    try {
        const candidate = await UserSchema.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const signout = (req, res) => {
    try {
        res.clearCookie('Admin_Token').status(200).json('Signout success!');
    } catch (error) {
        console.error("Sign out error:", error);
        res.status(500).json({ message: "An error occurred during sign out." });
    }
};