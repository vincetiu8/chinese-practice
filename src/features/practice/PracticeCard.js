import {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {selectPairIds, submitAnswer, updateSolvingPair} from "../pairs/pairsSlice";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import UIFx from "uifx";
import correctAudio from "./correct.mp3"

const synth = window.speechSynthesis

const useStyles = makeStyles({
	actions: {
		justifyContent: 'center'
	}
})

const correct = new UIFx(correctAudio)

export const PracticeCard = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const pairIds = useSelector(selectPairIds)
	const solvingPair = useSelector(state => state.pairs.solvingPair)
	const status = useSelector(state => state.pairs.status)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		if (pairIds.length > 0 && status === 'idle') {
			dispatch(updateSolvingPair())
		}
	}, [status, dispatch, pairIds.length])

	useEffect(() => {
		if (solvingPair !== null) {
			if (loaded) {
				correct.play()
			} else {
				setLoaded(true)
			}
			let speakText = new SpeechSynthesisUtterance(solvingPair.flip ? solvingPair.definition : solvingPair.id)
			speakText.lang = solvingPair.flip ? 'en' : 'zh'
			synth.speak(speakText)
		}
	}, [solvingPair, loaded])

	const [answer, setAnswer] = useState("")

	const onChange = e => setAnswer(e.target.value)

	function onKeyPress(e) {
		if (e.key === "Enter") {
			dispatch(submitAnswer(answer))
			setAnswer("")
		}
	}

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<Typography variant="h3">
						{
							status === "invalidLearningMode"
							? "You need to learn some terms first!"
							: pairIds.length > 0
								? (
									solvingPair !== null
										? solvingPair.flip
											? solvingPair.definition
											: solvingPair.id
										: ''
								)
								: 'No terms found, add some first!'
						}

					</Typography>
				</CardContent>
				{status === "invalidLearningMode"
					? ""
					: (
						<CardActions className={classes.actions}>
							{
								pairIds.length > 0
									? (
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
									)
									: (
										<Button
											component={Link}
											to='/edit-pairs'
											variant="contained"
										>
											Add Terms
										</Button>
									)
							}
						</CardActions>
					)
				}
			</Card>
		</div>
	)
}