import React, { Component } from 'react';
import { connect } from 'react-redux'

class OrderFrequency extends Component {

	render() {
		const { orders } = this.props;

		let itemFrequency = [];

		if (orders.length > 0) {
			let itemFrequencyMap = orders.reduce( (acc, order) => {
				const item = order.orderedItem;
				if (acc.has(item)) {
					acc.set(item, acc.get(item) + 1);
				} else {
					acc.set(item, 1);
				}
				return acc;
			}, new Map() );

			itemFrequency = [ ...itemFrequencyMap ].sort(function(a,b) {
				return b[1] - a[1];
			});
		}

		return (
			<div className="order-frequency">
				<table className="table table-responsive table-striped">
					<caption className="text-center"><h2>Order Frequency</h2></caption>
					<thead className="thead-inverse">
						<tr>
							<th>Item</th>
							<th>Frequency</th>
						</tr>
					</thead>
					<tbody>
						{itemFrequency.map(([item, frequency], key) => {
							return (
								<tr key={key}>
									<td>{item}</td>
									<td>{frequency}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		orders: state.orders.orders,
	}
}

export default connect(mapStateToProps)(OrderFrequency);