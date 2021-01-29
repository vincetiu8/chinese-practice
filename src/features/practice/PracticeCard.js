import {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {selectPairIds, submitAnswer, updateSolvingPair} from "../pairs/pairsSlice";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
	actions: {
		justifyContent: 'center'
	}
})

export const PracticeCard = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const pairIds = useSelector(selectPairIds)
	const solvingPair = useSelector(state => state.pairs.solvingPair)

	const status = useSelector(state => state.pairs.status)

	useEffect(() => {
		if (pairIds.length > 0 && status === 'idle') {
			dispatch(updateSolvingPair())
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
						{pairIds.length > 0
							? (
								solvingPair !== null
									? solvingPair.flip
										? solvingPair.definition
										: solvingPair.id
									: ''
							)
							: (
								'No terms found, add some first!'
							)

						}

					</Typography>
				</CardContent>
				<CardActions className={classes.actions}>
					{pairIds.length > 0
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
			</Card>
		</div>
	)
}