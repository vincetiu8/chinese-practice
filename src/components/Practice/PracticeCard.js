import {Component, useState} from "react";
import {Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";

export default function PracticeCard(props) {
	const [answer, setAnswer] = useState("")

	function onChange(e) {
		setAnswer(e.target.value)
	}

	function onKeyPress(e) {
		if (e.key === "Enter") {
			props.submitAnswer(answer)
			setAnswer("")
		}
	}

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<Typography variant="h3">
						{props.term}
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