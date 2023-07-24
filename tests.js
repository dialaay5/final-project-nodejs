const assert = require('assert')
const expect = require('chai').expect
const config = require('config')
const mongoose = require('mongoose');
const userModel = require("./models/newUser");
const jwt = require('jsonwebtoken');
const authController = require('./controllers/authController');

describe('Testing of the functions login & signup', async () => {
    const testingDbURI = config.mongoDbTest.connection;

    //before running the first test in this block, open a connection to the MongoDB database
    before(async () => {
        try {
            await mongoose.connect(testingDbURI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('connected!');
        }
        catch (err) {
            console.error('Error', err);
        }
    });


    //after running all the tests in this block, cleaning the MongoDB database
    after(async () => {
        try {
            await userModel.deleteMany({});
            console.log('Database cleaned after all the test.');
        } catch (err) {
            console.error('Error', err);
        }
    });

    //1- tesing login
    it('should check if the log-in post function is successful', async () => {
        //create new user 
        const firstName = "yaniv";
        const email = "yaniv@gmail.com";
        const password = "123456321";
        const rememberCheckbox = true;

        const user = await userModel.create({ firstName, email, password });
        const req = {
            body: { email, password, rememberCheckbox }
        };
        const res = {
            status: function (statusCode) {
                this.statusCode = statusCode;
                return this;
            },
            json: function (data) {
                this.data = data;
            },
            cookie: function (name, value, options) {
                this.cookieData = { name, value, options };
            },
        };
        await authController.login_post(req, res);

        const actual = res.statusCode;
        const expected = 200;
        assert.strictEqual(expected, actual)

    });

    //2- tesing signup
    it('should check if the signup post function is successful and prevent inserting the same user multiple times', async () => {
        const firstName = "yaniv";
        const email = "yaniv@gmail.com";
        const password = "123456321";
        const req = {
            body: { email, password, firstName }
        };
        const res = {
            status: function (statusCode) {
                this.statusCode = statusCode;
                return this;
            },
            json: function (data) {
                this.data = data;
            },
            cookie: function (name, value, options) {
                this.cookieData = { name, value, options };
            },
        };

        await authController.signup_post(req, res);

        const actual = res.statusCode;
        const expected = 400;
        assert.strictEqual(expected, actual)

    });
});
