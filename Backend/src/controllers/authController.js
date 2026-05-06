const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        // Send welcome email
        const message = `Welcome to our Ecommerce platform, ${user.name}! Your account has been successfully created.`;
        
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Ecommerce MERN',
                message
            });
        } catch (err) {
            console.error('Email could not be sent:', err.message);
            // Don't fail the registration if email fails, but log it
        }

        sendTokenResponse(user, 201, res);
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        sendTokenResponse(user, 200, res);
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logout
};
