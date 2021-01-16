import terms from "./data/terms.json"
import {Component} from "react";
import PracticeCard from "./PracticeCard";

class Practice extends Component {
	constructor(props) {
		super(props);

		const term = terms[0]
		this.state = {
			terms: terms,
			currentTerm: term.term,
			currentDefinition: term.definition,
		}
	}

	generateNextTerm() {
		const termNumber = Math.floor(Math.random() * this.state.terms.length)
		const term = this.state.terms[termNumber]

		this.setState({
			currentTerm: term.term,
			currentDefinition: term.definition,
		})
	}

	submitAnswer(answer) {
		console.log(answer === this.state.currentDefinition); // TODO: Create popup if answer is wrong
		this.generateNextTerm();
	}

	render() {
		return (
			<div>
				<PracticeCard
					term={this.state.currentTerm}
					submitAnswer={(answer) => this.submitAnswer(answer)}
				/>
			</div>
		)
	}
}

export default Practice;