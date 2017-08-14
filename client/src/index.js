import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// Import Components
// import App from './App';
import App from './components/App';

// Setup Store
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

// Import reducers
import OrdersReducer from './mods/orders/reducer.js'
import SocketsReducer from './mods/socket/reducer.js'

// Import rootSaga
import rootSaga from './mods/root-saga.js'

const reducers = combineReducers({
	orders: OrdersReducer,
	socket: SocketsReducer,
});


// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// Mount it on the store
let store = createStore(
	reducers,
	applyMiddleware(sagaMiddleware)
);

// run the saga
sagaMiddleware.run(rootSaga);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root')
);

registerServiceWorker();
