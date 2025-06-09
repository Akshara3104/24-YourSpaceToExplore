const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await UserModel.findOne({ email });
        const nameExists = await UserModel.findOne({ name });
        
        if (!exists && !nameExists) {
            const hashPwd = await bcrypt.hash(password, 10)
            const user = await UserModel.create({ name, email, password: hashPwd });
            const token = jwt.sign({ id: user._id.toString() }, "JWT_SECRET");
            return res.send({ success: true, message: "User created", token });
        }

        return res.json({ success: false, message: "User already exists!" });
    } catch (error) {
        console.error(error.message);
        return res.send({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body.data;
        const findUser = await UserModel.findOne({ email });

        if (!findUser) {
            return res.send({ success: false, message: 'No user exists' });
        }

        if (await bcrypt.compare(password, findUser.password)) {
            const token = jwt.sign({ id: findUser._id }, "JWT_SECRET");
            return res.send({ 
                success: true, 
                message: 'Login success', 
                token, 
                name: findUser.name, 
                email: findUser.email, 
                userId: findUser._id.toString(),
                profilePicture: findUser.profilePicture
            });
        } 

        return res.send({ success: false, message: 'Wrong password' });
    } catch (error) {
        return res.send({ success: false, message: error.message });
    }
};
