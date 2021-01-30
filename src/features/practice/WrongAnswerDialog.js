import {useEffect, useState} from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle, IconButton,
	TextField,
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {submitAnswer, updateEditingPair, deletePair} from "../pairs/pairsSlice";
import {Delete, Edit} from "@material-ui/icons";
import pinyin from "chinese-to-pinyin"
import UIFx from "uifx";
import wrongAudio from "./wrong.mp3"

const wrong = new UIFx(wrongAudio)
const synth = window.speechSynthesis

export const WrongAnswerDialog = () => {
	const dispatch = useDispatch()

	const pair = useSelector(state => state.pairs.solvingPair)
	const status = useSelector(state => state.pairs.status)
	const open = status === 'wrong'

	const [answer, setAnswer] = useState("");
	const [showAnswer, setShowAnswer] = useState(false)

	const onChange = e => setAnswer(e.target.value)

	const onEdit = () => dispatch(updateEditingPair(pair.id))
	const onDelete = () => dispatch(deletePair(pair.id))

	const onKeyPress = e => {
		if (e.key === "Enter") {
			dispatch(submitAnswer(answer))
			setAnswer("")
			setShowAnswer(false)
		}
	}

	useEffect(() => {
		if (open) {

		}
	}, [open])

	useEffect(() => {
		if (open && !showAnswer) {
			let speakText = new SpeechSynthesisUtterance(pair.flip ? pair.definition : pair.id)
			speakText.lang = pair.flip ? 'en' : 'zh'
			synth.speak(speakText)
			speakText = new SpeechSynthesisUtterance(pair.flip ? pair.id : pair.definition)
			speakText.lang = pair.flip ? 'zh' : 'en'
			synth.speak(speakText)
		}
	}, [open, showAnswer, pair])

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
						Term: {
						open
							? pair.flip
								? pair.definition
								: showAnswer
									? pair.id
									: pair.id + ' (' + pinyin(pair.id) + ")"
							: ''
					}
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
								Correct Answer: {
								open
									? pair.flip
										? pair.id + ' (' + pinyin(pair.id) + ")"
										: pair.definition
									: ''
							}
							</DialogContentText>
					}
				</DialogContent>
				<DialogActions>
					<IconButton onClick={onEdit}>
						<Edit/>
					</IconButton>
					<IconButton onClick={onDelete}>
						<Delete/>
					</IconButton>
					{
						showAnswer
							? ""
							: <Button autoFocus onClick={() => setShowAnswer(true)}>Next</Button>
					}
				</DialogActions>
			</Dialog>
		</div>
	);
}