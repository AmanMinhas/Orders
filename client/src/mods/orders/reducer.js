const initialState = {
    orders: [],
};

export default function api(state = initialState, action = {}) {
    switch (action.type) {
        case 'FETCH_ORDERS_SUCCESS':
            return {
                orders: action.payload,
            };

        case 'FETCH_ORDERS_FAILURE':
            return {
                orders: [],
            };

        case 'DELETE_ORDER_SUCCESS':
            console.log('DELETE_ORDER_SUCCESS ', action)
            const orderId = action.payload;

            const newOrders = state.orders.filter((order) => {
                return orderId !== order.orderId;
            });

            return {
                ...state,
                orders: newOrders
            };

        default:
            return state;
    }
}
