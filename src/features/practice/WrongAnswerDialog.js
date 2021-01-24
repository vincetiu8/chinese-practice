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
import {useDispatch, useSelector} from "react-redux";
import {submitAnswer} from "../pairs/pairsSlice";

export const WrongAnswerDialog = () => {
	const dispatch = useDispatch()

	const pair = useSelector(state => state.pairs.solvingPair)
	const status = useSelector(state => state.pairs.status)
	const open = status === 'wrong'

	const [answer, setAnswer] = useState("");
	const [showAnswer, setShowAnswer] = useState(false)

	const onChange = e => setAnswer(e.target.value)

	const onKeyPress = e => {
		if (e.key === "Enter") {
			dispatch(submitAnswer(answer))
			setAnswer("")
			setShowAnswer(false)
		}
	}

	return (
		<div>
			<Dialog open={open}>
				<DialogTitle>
					{
						showAnswer
							? "Enter Correct Answer"
							: "Wrong Answer"
					}
				</DialogTitle>
				<DialogContent>
					<DialogContentText variant="h3" color="textPrimary">
						Term: {open ? pair.id : ''}
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
								Correct Answer: {open ? pair.definition : ''}
							</DialogContentText>
					}
				</DialogContent>
				{
					showAnswer
						? ""
						:
						<DialogActions>
							<Button autoFocus onClick={() => setShowAnswer(true)}>
								Next
							</Button>
						</DialogActions>
				}
			</Dialog>
		</div>
	);
}