const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


//creating Mongodb schema 
const newUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        lowercase: true,
        minlength: [4, 'Minimum name length is 4 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Minimum password length is 8 characters'],
    },
    friendsList: {
        type: Array,
    }
});

//encrypting passwords before saving to the database
newUserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to login user
newUserSchema.statics.login = async function (email, password) {

    //find the user by email
    const user = await this.findOne({ "email": email });
    if (user) {

        //check if the provided password matches the user's password
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Invalid password!');
    }
    throw Error('User not found!');
};

//creating a model from the schema
const userModel = mongoose.model('faceBookUsers', newUserSchema);

module.exports = userModel;
