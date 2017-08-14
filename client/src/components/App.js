import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ordersActions from '../mods/orders/action.js';
import * as socketActions from '../mods/socket/action.js';
import socketService from '../mods/socket/SocketService';

import Orders from './Orders';
import OrderFrequency from './OrderFrequency';

class App extends Component {
	componentWillMount() {
		this.props.dispatch(ordersActions.fetchOrders());
	}

	componentDidMount() {
		this._connect();
	}

	_connect() {
		const socket = socketService.connect();
		this.props.dispatch(socketActions.setSocket(socket));
		// socket.emit('test', {
		// 	id: 123
		// });

		this._setSocketListeners(socket);
	}

	_setSocketListeners(socket) {
		socket.on('se_delete_order', ({ orderId }) => {
			// const { orderId } = data;
			this.props.dispatch(ordersActions.deleteOrderSuccess(orderId));
		})
	}

	render() {
		return (
			<div className='app-layout container'>
				<Orders />
				<OrderFrequency />
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: dispatch,
	};
}

export default connect(null, mapDispatchToProps)(App);
