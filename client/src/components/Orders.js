import React, { Component } from 'react';
import { connect } from 'react-redux'
import AutoSuggestWrapper from './AutoSuggestWrapper';
import * as ordersActions from '../mods/orders/action.js';
import '../style/react-autosuggest.css';
// import socketService from '../mods/socket/SocketService';

class Orders extends Component {

	constructor(props) {
		super(props);
		this.state = {
			inputAddress: '',
			inputCompany: '',
			arrAddress: [],
			arrCompanies: []
		};

		this.onAddressChange = this.onAddressChange.bind(this);
		this.onCompanyChange = this.onCompanyChange.bind(this);
		this._setAutoSuggestData = this._setAutoSuggestData.bind(this);
	}

	componentWillMount() {
		this._setAutoSuggestData(this.props.orders);
	}

	componentWillReceiveProps(nextProps) {
		this._setAutoSuggestData(nextProps.orders);
	}

	_setAutoSuggestData(orders) {
		if (orders.length > 0) {
			let arrCompanies = [];
			let arrAddress = [];
			orders.forEach(function(order) {
				if (arrCompanies.indexOf(order.companyName) === -1) {
					arrCompanies.push(order.companyName);
				}
				if (arrAddress.indexOf(order.customerAddress) === -1) {
					arrAddress.push(order.customerAddress);
				}
			});

			this.setState({
				arrCompanies,
				arrAddress
			});
		}
	}

	onAddressChange(e, {newValue}) {
		this.setState({
			inputAddress: newValue
		});
	}

	onCompanyChange(e, {newValue}) {
		this.setState({
			inputCompany: newValue
		});
	}

	deleteOrder(orderId) {
		console.log('Order ID ', orderId);
		this.props.dispatch(ordersActions.deleteOrder(orderId));
	}

	render() {
		const { orders } = this.props;
		const { inputAddress, inputCompany, arrAddress, arrCompanies } = this.state;

		let filteredOrders;
		if (inputAddress !== '' || inputCompany !== '') {
			filteredOrders = orders.filter((order) => {
				return  (order.customerAddress === inputAddress || inputAddress === '') &&
					(order.companyName === inputCompany || inputCompany === '');
			});
		} else {
			filteredOrders = [ ...orders ];
		}

		return (
			<div className='orders'>
				<div className="row">
					<div className="col-md-12">
						<div>
						</div>
						<div className="text-center orders-caption">
							<h2>Orders</h2>
						</div>
						<div className="order-filters">
							<AutoSuggestWrapper
								list={ arrCompanies }
								inputValue={ inputCompany }
								onChange={ this.onCompanyChange }
								placeholder= 'Filter by Company Name'
							/>
							<AutoSuggestWrapper
								list={ arrAddress }
								inputValue={ inputAddress }
								onChange={ this.onAddressChange }
								placeholder= 'Filter by Customer Address'
							/>
						</div>
						<table className="table table-responsive table-striped">
							<thead className="thead-inverse">
								<tr>
									<th>#</th>
									<th>Company</th>
									<th>Address</th>
									<th>Item</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{filteredOrders.map((order, index) => {
									return (
									  <tr key={index}>
										<th scope="row">{order.orderId}</th>
										<td>{order.companyName}</td>
										<td>{order.customerAddress}</td>
										<td>{order.orderedItem}</td>
										<td>
											<button
												className="btn btn-danger"
												onClick={ () => this.deleteOrder(order.orderId) }
												>
												Delete
											</button>
										</td>
									  </tr> 
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		orders: state.orders.orders,
		socket: state.socket.socket
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch: dispatch,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
