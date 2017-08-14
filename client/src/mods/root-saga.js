import { all } from 'redux-saga/effects'
import orderSagas from './orders/saga.js'

export default function* rootSaga() {
	yield all([
		...orderSagas
	]);
}