import {useSelector} from "react-redux";
import {Card, CardContent, Typography} from "@material-ui/core";

export const HistoryStatCard = ({historyRange}) => {
	const statValue = useSelector(state => state.pairs.historyStats.learnedTerms[historyRange])
	const dailyGoal = useSelector(state => state.pairs.settings.dailyGoal)
	let multiplier = 1
	if (historyRange === "week") {
		multiplier = 7
	} else if (historyRange === "month") {
		multiplier = 30
	}
	const goal = dailyGoal * multiplier

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<Typography variant="h5">
						{
							(historyRange.charAt(0).toUpperCase() + historyRange.slice(1))
								.split(/(?=[A-Z])/)
								.join(' ')
							+ " Learned Terms"
						}
					</Typography>
					<Typography variant="h3">
						{
							statValue +
							(goal === 0
								? ""
								: "/" + goal + " (" + Math.round(statValue / goal * 1000) / 10 + "%)")
						}
					</Typography>
				</CardContent>
			</Card>
		</div>
	)
}