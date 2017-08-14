// import { checkStatus, getJson } from '../fetch-helpers.js';

export function fetchOrdersSuccess(orders) {
	return {
		type: 'FETCH_ORDERS_SUCCESS',
		payload: orders
	};
}

export function fetchOrdersFailure() {
	return {
		type: 'FETCH_ORDERS_FAILURE',
	};
}

export function fetchOrders() {
	return {
		type: 'FETCH_ORDERS'
	};
}

export function deleteOrder(orderId) {
	return {
		type: 'DELETE_ORDER',
		payload: orderId
	}
}

export function deleteOrderSuccess(orderId) {
	console.log('Delete order success ', orderId);
	return {
		type: 'DELETE_ORDER_SUCCESS',
		payload: orderId	
	}
}