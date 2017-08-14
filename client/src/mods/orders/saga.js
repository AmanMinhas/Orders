import { call, put, takeEvery } from 'redux-saga/effects'
import { checkStatus, getJson } from '../fetch-helpers.js';
import * as ordersActions from './action.js';

function fetchOrders() {
	return fetch('/api/orders')
		.then(checkStatus)
		.then(getJson)
		.then(data => data);
}

function deleteOrder(id) {
	return fetch(`/api/order/${id}`, {
			method: 'delete'
		})
		.then(checkStatus)
		.then(getJson)
		.then(data => data);
}

// worker saga
function* callFetchOrders(action) {
	try {
		const orders = yield call(fetchOrders);
		yield put(ordersActions.fetchOrdersSuccess(orders))
	} catch(e) {
		// act on error
		yield put(ordersActions.fetchOrdersFailure())
	}
}

function* callDeleteOrder(action) {
	console.log('Called Delete Order ', action );
	const orderId = action.payload; 

	try {
		yield call(deleteOrder, orderId);
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