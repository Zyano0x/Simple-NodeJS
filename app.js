const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const photoRouter = require('./routes/photoRoutes');
const likeRouter = require('./routes/likeRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');

const ErrorHandle = require('./utils/errorHandle');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', viewRouter);
app.use('/api/v1/photos', photoRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/users', userRouter);

app.all('*', function (req, res, next) {
  next(new ErrorHandle(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
