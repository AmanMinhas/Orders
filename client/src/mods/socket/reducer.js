const initialState = {
    socket: null,
};

export default function api(state = initialState, action = {}) {
    switch (action.type) {
        case 'SET_SOCKET':
            return {
                socket: action.payload,
            };

        default:
            return state;
    }
}
