import io from 'socket.io-client';

class SocketService {
	constructor() {
		this._socket = null;
	}

	connect() {
		this._socket = io('http://localhost:3001');
		return this._socket;
	}

	getConnection() {
		if (!this._socket) {
			throw new Error('Socket conn not established.');
		}
	}

	disconnect() {
		if (!this._socket) {
			throw new Error('Socket conn not established.');
		}

		this._socket.off();
		return this._socket.disconnect();
	}
}

const socketService = new SocketService();
export default socketService;
