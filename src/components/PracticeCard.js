import {Component} from "react";
import {Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";

class PracticeCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			answer: "",
		}

		this.onChange = this.onChange.bind(this)
		this.onKeyPress = this.onKeyPress.bind(this)
	}

	onChange(e) {
		this.setState({answer: e.target.value})
	}

	onKeyPress(e) {
		if (e.key === "Enter") {
			this.props.submitAnswer(this.state.answer)
			this.setState({answer: ""})
		}
	}

	render() {
		return (
			<div>
				<Card elevation={12}>
					<CardContent>
						<Typography variant="h3">
							{this.props.term}
						</Typography>
					</CardContent>
					<CardActions>
						<TextField
							autoFocus
							placeholder="Enter Definition Here"
							value={this.state.answer}
							InputProps={{
								style: {fontSize: "3rem"}
							}}
							onChange={this.onChange}
							onKeyPress={this.onKeyPress}
						/>
					</CardActions>
				</Card>
			</div>
		)
	}
}

export default PracticeCard;