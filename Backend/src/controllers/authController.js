const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('express-async-handler');


// @route   POST /api/auth/register

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
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

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please login.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @route   POST /api/auth/login

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        sendTokenResponse(user, 200, res);
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});


// @route   GET /api/auth/me

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
});


// @route   GET /api/auth/logout

const logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
});

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


// @route   POST /api/auth/forgotpassword

const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        // SIMULATION MODE: If email fails, we still allow testing locally
        console.log('--- PASSWORD RESET SIMULATION ---');
        console.log(`Email to: ${user.email}`);
        console.log(`Reset Link: ${resetUrl}`);
        console.log('---------------------------------');

        if (process.env.NODE_ENV === 'development') {
            return res.status(200).json({
                success: true,
                data: 'Email sent (Simulation Mode)',
                devLink: resetUrl // Sending link to frontend for easy testing in dev
            });
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});


// @route   PUT /api/auth/resetpassword/:resettoken

const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = require('crypto')
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logout,
    forgotPassword,
    resetPassword
};
