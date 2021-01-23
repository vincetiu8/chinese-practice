import {useState} from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@material-ui/core";

export default function WrongAnswerDialog(props) {
	const [answer, setAnswer] = useState("");
	const [showAnswer, setShowAnswer] = useState(false)

	function onToggle() {
		setShowAnswer(true)
	}

	function onChange(e) {
		setAnswer(e.target.value)
	}

	function onKeyPress(e) {
		if (e.key === "Enter") {
			props.submitAnswer(answer)
			setAnswer("")
			setShowAnswer(false)
		}
	}

	return (
		<div>
			<Dialog open={props.open}>
				<DialogTitle>
					{
						showAnswer
						? "Enter Correct Answer"
						: "Wrong Answer"
					}
				</DialogTitle>
				<DialogContent>
					<DialogContentText variant="h3" color="textPrimary">
						Term: {props.pair.term}
					</DialogContentText>
					{
						showAnswer
						?
							<TextField
								autoFocus
								placeholder="Enter Definition Here"
								value={answer}
								InputProps={{
									style: {fontSize: "3rem"}
								}}
								onChange={onChange}
								onKeyPress={onKeyPress}
							/>
						:
							<DialogContentText variant="h3">
								Correct Answer: {props.pair.definition}
							</DialogContentText>
					}
				</DialogContent>
				{
					showAnswer
					? ""
					:
						<DialogActions>
							<Button autoFocus onClick={onToggle}>
								Next
							</Button>
						</DialogActions>
				}
			</Dialog>
		</div>
	);
}