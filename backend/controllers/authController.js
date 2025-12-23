const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log('[auth] registerUser called for email:', email);

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('[auth] registerUser - user exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        if (user) {
            console.log('[auth] registerUser - created user:', user._id.toString());
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('[auth] registerUser - invalid user data for:', email);
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('[auth] registerUser error:', error.stack || error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('[auth] loginUser called for email:', email);

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('[auth] loginUser success for:', user._id.toString());
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('[auth] loginUser failed for:', email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('[auth] loginUser error:', error.stack || error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.name) user.name = req.body.name;
        // Allow additional fields in future
        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
        }

        await user.save();

        // Return updated user without password
        const { _id, name, email, role, avatar } = user;
        res.json({ _id, name, email, role, avatar });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, updateMe };
