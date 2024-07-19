const { Op } = require('sequelize');
const {v4: uuidv4} = require('uuid');
const User = require('../model/User');
const {generateAccessToken} = require('./authService');
const {hashPassword, comparePassword} = require('./passwordHashService');
const {validateUser} = require('../utils/validation');

const getUser = async (username="", email) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email }
                ]
            },
        });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

const registerUser = async (user) => {
    try {
        validateUser(user);

        const existingUser = await getUser(user.username, user.email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        user.id = uuidv4();
        user.password = hashPassword(user.password);
        await User.create(user);
        return {success: "User registered successfully"}
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

const loginUser = async (user) => {
    try {
        const existingUser = await getUser(null, user.email);
        if (!existingUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        if(!comparePassword(user.password, existingUser.password)) {
            const error = new Error('Incorrect password');
            error.statusCode = 401;
            throw error;
        }
        return { jwtToken: generateAccessToken(existingUser.id) };
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

module.exports = { registerUser, loginUser };