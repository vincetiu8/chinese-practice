import {Button, Dialog, DialogActions} from "@material-ui/core";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
	button: {
		fontSize: "3rem"
	}
})

export const GoalMetDialog = () => {
	const classes = useStyles()

	const dayGoalMet = useSelector(state => state.pairs.historyStats.goalMet.today)
	const weekGoalMet = useSelector(state => state.pairs.historyStats.goalMet.week)
	const monthGoalMet = useSelector(state => state.pairs.historyStats.goalMet.month)

	const [open, setOpen] = useState(false)
	const [value, setValue] = useState("")

	useEffect(() => {
		if (dayGoalMet) {
			setOpen(true)
			setValue("Daily")
		}
	}, [dayGoalMet])

	useEffect(() => {
		if (weekGoalMet) {
			setOpen(true)
			setValue("Weekly")
		}
	}, [weekGoalMet])

	useEffect(() => {
		if (monthGoalMet) {
			setOpen(true)
			setValue("Monthly")
		}
	}, [monthGoalMet])

	return (
		<div>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogActions>
					<Button className={classes.button} onClick={() => setOpen(false)}>
						{value} Goal Met!
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}