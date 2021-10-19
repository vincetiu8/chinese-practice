import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField,} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {deletePair, submitAnswer, updateEditingPair} from "../pairs/pairsSlice";
import {Delete, Edit} from "@material-ui/icons";
import pinyin from "chinese-to-pinyin"
import UIFx from "uifx";
import wrongAudio from "./wrong.mp3"
import {makeStyles} from "@material-ui/core/styles";

const wrong = new UIFx(wrongAudio)
const synth = window.speechSynthesis

const useStyles = makeStyles({
	dialog: {
		flexDirection: "column"
	},
	button: {
		fontSize: "3rem",
		textTransform: "none",
		width: "fit-content",
		whiteSpace: "nowrap"
	}
})

export const WrongAnswerDialog = () => {
	const dispatch = useDispatch()
	const classes = useStyles()

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

	const speak = (term) => {
		const actualTerm = term ? pair.flip : !pair.flip
		const text = actualTerm ? pair.definition : pair.id
		const speakText = new SpeechSynthesisUtterance(text)
		speakText.lang = /^[a-zA-Z0-9 ]*$/.test(text) ? 'en' : 'zh'
		synth.speak(speakText)
	}

	useEffect(() => {
		if (open) {
			wrong.play()
		}
	}, [open])

	useEffect(() => {
		if (open && !showAnswer) {
			speak(true)
			speak(false)
		}
	}, [open, showAnswer, pair])

	return (
		<div>
			<Dialog open={open} maxWidth={false} className={classes.dialog}>
				<DialogTitle>
					{
						showAnswer
							? "Enter Correct Answer"
							: "Wrong Answer"
					}
				</DialogTitle>
				<DialogContent>
					<Button
						className={classes.button}
						onClick={() => speak(true)}
					>
						Term: {
						open
							? pair.flip
							? pair.definition
							: showAnswer
								? pair.id
								: pair.id + ' (' + pinyin(pair.id) + ")"
							: ''
					}
					</Button>
				</DialogContent>
				<DialogContent>
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
							<Button className={classes.button} onClick={() => speak(false)}>
								Correct Answer: {
								open
									? pair.flip
									? pair.id + ' (' + pinyin(pair.id) + ")"
									: pair.definition
									: ''
							}
							</Button>
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
