import UrlController from './controllers/UrlController.js';
import UserController from './controllers/UserController.js';
import CodeController from './controllers/CodeController.js';
import AdminController from "./controllers/AdminController.js";
import DashboardController from "./controllers/DashboardController.js";
import RateLimit from './middlewares/RateLimit.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import redisClient from "./redis/redisClient.js";
import express from "express";




let redisStore = new RedisStore({
    client: redisClient,
});


const rateLimitInstance = new RateLimit(redisClient);
const userController = new UserController(redisClient);
const urlController = new UrlController(redisClient);
const codeController = new CodeController(redisClient, rateLimitInstance);
const adminController = new AdminController(redisClient);
const dashboardController =  new DashboardController(redisClient);



function initMiddlewares(app) {
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.SECRET_KEY,
            store: redisStore,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                domain: process.env.DOMAIN,
                maxAge: 3600000,
            },
        })
    );
}

function initControllers(app) {
    app.use('/url', urlController);
    app.use('/code', codeController);
    app.use('/user', userController);
    app.use('/admin', adminController);
    app.use('/dashboard', dashboardController);
    app.use(express.static("D:/NodeJS/Lessons/HW10/dash/"));
}

function initViews(app) {
    app.set('views', 'view');
    app.set('view engine', 'ejs');
}

export default function (app) {
    initMiddlewares(app)
    initControllers(app)
    initViews(app);
}


