// eslint-disable-next-line
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { checkStatus, getJson } from '../fetch-helpers.js';
import * as ordersActions from './action.js';

function fetchOrders() {
	// console.log('FETCH_ORDERS api called');
	return fetch('/api/orders')
		.then(checkStatus)
		.then(getJson)
		.then(data => data);
}

function deleteOrder(id) {
	// return fetch('/api/delete');
	// app.route('/api/order/:order_id')
	return fetch(`/api/order/${id}`, {
			method: 'delete'
		})
		.then(checkStatus)
		.then(getJson)
		.then((data) => {
			console.log('Deleted Data ', data);
			return data;
		})
}

// worker saga
function* callFetchOrders(action) {
	// console.log ('FETCH_ORDERS called');
	try {
		const orders = yield call(fetchOrders);
		// yield put({ type: 'FETCH_ORDERS_SUCCESS', orders })
		yield put(ordersActions.fetchOrdersSuccess(orders))
	} catch(e) {
		// act on error
		yield put(ordersActions.fetchOrdersFailure())
		// yield put({ type: 'FETCH_ORDERS_FAILURE' })
	}
}

function* callDeleteOrder(action) {
	console.log('Called Delete Order ', action );
	const orderId = action.payload; 

	try {
		yield call(deleteOrder, orderId);
		// yield put(ordersActions.deleteOrderSuccess(orderId));
	} catch(e) {
		// act on error
	}
}

// watcher saga
function* watchFetchOrders() {
	console.log('Watching for FETCH_ORDERS');
	yield takeEvery('FETCH_ORDERS', callFetchOrders)
}

function* watchDeleteOrder() {
	console.log('Watching for DELETE_ORDER')
	yield takeEvery('DELETE_ORDER', callDeleteOrder)
}

export default [
	watchFetchOrders(),
	watchDeleteOrder()
];