import {useSelector} from "react-redux";
import {Card, CardContent, Typography} from "@material-ui/core";

export const HistoryStatCard = ({historyRange, stat}) => {
	const statValue = useSelector(state => state.pairs.historyStats[historyRange][stat])
	const totalTerms = useSelector(state => state.pairs.stats.totalTerms)

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<Typography variant="h5">
						{
							(historyRange.charAt(0).toUpperCase() + historyRange.slice(1))
								.split(/(?=[A-Z])/)
								.join(' ')
								+ " "
								+ (stat.charAt(0).toUpperCase() + stat.slice(1))
								.split(/(?=[A-Z])/)
								.join(' ')
						}
					</Typography>
					<Typography variant="h3">
						{statValue + " (" + Math.round(statValue / totalTerms * 1000) / 10 + "%)"}
					</Typography>
				</CardContent>
			</Card>
		</div>
	)
}