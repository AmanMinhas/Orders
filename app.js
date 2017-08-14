var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();
var socket = require('socket.io');
var io = socket();
app.io = io;

sequelize = new Sequelize('sqlite://' + path.join(__dirname, 'orders.sqlite'), {
	dialect: 'sqlite',
	storage: path.join(__dirname, 'orders.sqlite')
});

Orders = sequelize.define('orders', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	orderId: {
		type: Sequelize.STRING
	},
	companyName: {
		type: Sequelize.STRING
	},
	customerAddress: {
		type: Sequelize.STRING
	},
	orderedItem: {
		type: Sequelize.STRING
	},
});

/* Populate db when server starts */
sequelize.sync().then(function() {
	Orders.findAll().then(function(orders) {
		console.log('Existing orders ', orders.length);
		if (orders.length === 0) {
			var arrOrders = [
				['001', 'SuperTrader', 'Steindamm 80', 'Macbook'],
				['002', 'Cheapskates', 'Reeperbahn 153', 'Macbook'],
				['003', 'MegaCorp', 'Steindamm 80', 'Book "Guide to Hamburg"'],
				['004', 'SuperTrader', 'Sternstrasse  125', 'Book "Cooking  101"'],
				['005', 'SuperTrader', 'Ottenser Hauptstrasse 24', 'Inline Skates'],
				['006', 'MegaCorp', 'Reeperbahn 153', 'Playstation'],
				['007', 'Cheapskates', 'Lagerstrasse  11', 'Flux compensator'],
				['008', 'SuperTrader', 'Reeperbahn 153', 'Inline Skates']
			];

			arrOrders.forEach(function(arrOrder) {
				Orders.create({
					id: arrOrder[0],
					orderId: arrOrder[0],
					companyName: arrOrder[1],
					customerAddress: arrOrder[2],
					orderedItem: arrOrder[3]
				});
			})
		} else {
			console.log('Orders already exist');
		}
	});

})

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

// API
app.route('/api/orders')
	.get(function(req, res) {
		Orders.findAll().then(function(orders) {
			res.json(orders);
		})
	});

app.route('/api/order/:order_id')
	.delete(function(req,res) {
		Orders.findAll({ where: { orderId: req.params.order_id }, limit: 1 }).then(function(order) {
			if (order.length === 1) {
				order = order[0];
				order.destroy().then(function(order) {
					io.emit('se_delete_order', {orderId: req.params.order_id});
					res.json(order);
				});
			} else {
				res.json({});
			}
		})
	});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Socket events
io.on('connection', (socket) => {
	console.log('Connected');
	// socket.on('test', (data) => {
	// 	console.log('test data ', data);
	// })
});

module.exports = app;
