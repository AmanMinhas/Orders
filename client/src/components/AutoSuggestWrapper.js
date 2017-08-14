import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export default class AutoSuggestWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestions: [],
		}

		this.getSuggestion = this.getSuggestion.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
	}

	getSuggestion(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		const { list } = this.props;

		return inputLength === 0 ? [] : list.filter(item => item.toLowerCase().slice(0, inputLength) === inputValue );
	}

	onSuggestionsFetchRequested({value}) {
		this.setState({
			suggestions: this.getSuggestion(value)
		});
	}

	onSuggestionsClearRequested() {
		this.setState({
			suggestions: []
		});
	}

	renderSuggestion(suggestion) {
		return <div>{suggestion}</div>;
	}

	render() {
		const { suggestions } = this.state;

		const inputProps = {
			placeholder: this.props.placeholder,
			value: this.props.inputValue,
			onChange: this.props.onChange
		};

		return (
			<Autosuggest
				suggestions={ suggestions }
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={(suggestion) => suggestion}
				renderSuggestion={this.renderSuggestion}
				inputProps={inputProps}
			/>
		);
	}
}
