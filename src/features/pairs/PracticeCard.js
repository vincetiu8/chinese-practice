import {useEffect, useState} from "react";
import {Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {selectPairIds, submitAnswer, updateCurrentPair} from "./pairsSlice";

export const PracticeCard = () => {
	const dispatch = useDispatch()

	const pairIds = useSelector(selectPairIds)
	const currentPair = useSelector(state => state.pairs.currentPair)

	const status = useSelector(state => state.pairs.status)

	// TODO: should redirect if no terms
	useEffect(() => {
		if (status === 'idle') {
			// TODO: create better function to select next term
			const index = Math.floor(pairIds.length * Math.random())
			const id = pairIds[index]
			dispatch(updateCurrentPair({
				id: id,
				status: 'solving'
			}))
		}
	}, [status, dispatch, pairIds.length])

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
						{currentPair !== null ? currentPair.id : ''}
					</Typography>
				</CardContent>
				<CardActions>
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
				</CardActions>
			</Card>
		</div>
	)
}