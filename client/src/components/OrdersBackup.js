import React, { Component } from 'react';
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest';
import AutoSuggestWrapper from './AutoSuggestWrapper';
import '../style/react-autosuggest.css';

// import socketService from '../mods/socket/SocketService';

class Orders extends Component {

	constructor(props) {
		super(props);
		this.state = {
			inputAddress: '',
			inputCompany: '',
			arrAddress: [],
			arrCompanies: [],
			arrAddressSuggestion: [],
			arrCompaniesSuggestion:[]
		};

		this.onAddressChange = this.onAddressChange.bind(this);
		this.onCompanyChange = this.onCompanyChange.bind(this);
		this.getAddressSuggestion = this.getAddressSuggestion.bind(this);
		this.onAddressSuggestionsFetchRequested = this.onAddressSuggestionsFetchRequested.bind(this);
		this.onAddressSuggestionsClearRequested = this.onAddressSuggestionsClearRequested.bind(this);
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

	onAddressSuggestionsFetchRequested({value}) {
		this.setState({
			arrAddressSuggestion: this.getAddressSuggestion(value)
		});
	}

	onAddressSuggestionsClearRequested() {
		this.setState({ arrAddressSuggestion: [] });
	}

	getAddressSuggestion(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		const { arrAddress } = this.state;

		return inputLength === 0 ? [] : arrAddress.filter(address => address.toLowerCase().slice(0, inputLength) === inputValue );
	}

	renderSuggestion(suggestion) {
		return <div>{suggestion}</div>;
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

		const addressInputProps = {
			placeholder: 'Filter by address',
			value: inputAddress,
			onChange: this.onAddressChange
		}

		return (
			<div className='orders'>
				<div className="row">
					<div className="col-md-12">
						<div>
							<AutoSuggestWrapper
								list={ arrAddress }
								inputValue={ inputAddress }
								onChange={ this.onAddressChange }
								placeholder= 'FILTER BY ADDRESS'
							/>
							<AutoSuggestWrapper
								list={ arrCompanies }
								inputValue={ inputCompany }
								onChange={ this.onCompanyChange }
								placeholder= 'FILTER BY Company'
							/>
						</div>
						<table className="table">
							<caption className="text-center"><h2>Orders</h2></caption>
							<thead>
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
												className="btn btn-danger">
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

export default connect(mapStateToProps)(Orders);
