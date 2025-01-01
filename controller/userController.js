import jwt from 'jsonwebtoken'
import UserSchema from '../models/candidateSchema.js'
import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose';

// Candidate Login
export const candidateLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const candidate = await UserSchema.findOne({ email, role: 'candidate' });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const isMatch = await bcryptjs.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: candidate._id, role: candidate.role }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = candidate._doc;
        const expiryDate = new Date(Date.now() + 3600000);
        res.cookie('Candidate_Token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);

    } catch (error) {
        console.log("error in candidate login ", error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const upload = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { profilePicture } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        if (!profilePicture) {
            return res.status(400).json({ error: "Profile picture is required." });
        }

        const updatedUser = await UserSchema.findByIdAndUpdate(id, { $set: { profilePicture } }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({ success: true, rest });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during image upload." });
    }
};





// signout
export const signout = async (req, res) => {
    try {
        res.clearCookie('Candidate_Token').status(200).json('Signout success!');
    } catch (err) {
        console.error("Candidate Sign out error:", error);
        res.status(500).json({ message: "An error occurred during sign out." });
    }
};
