import {PracticeCard} from "./PracticeCard";
import {WrongAnswerDialog} from "./WrongAnswerDialog";
import {useSelector} from "react-redux";
import {EditPairDialog} from "../pairs/EditPairDialog";
import {StatCard} from "./StatCard";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {HistoryStatCard} from "./HistoryStatCard";

const useStyles = makeStyles({
	container: {
		padding: 24
	}
})

export const Practice = () => {
	const classes = useStyles()

	const stats = useSelector(state => state.pairs.stats)
	const historyStats = useSelector(state => state.pairs.historyStats)

	return (
		<div>
			<EditPairDialog/>
			<WrongAnswerDialog/>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				spacing={3}
				className={classes.container}
			>
				<Grid item>
					<PracticeCard/>
				</Grid>
				<Grid item>
					<Grid container justify="center" spacing={3}>
						{
							Object.keys(stats).map(stat => (
								stat === "history" || stat === "historyStats"
									? ""
									: (
										<Grid item key={stat}>
											<StatCard stat={stat}/>
										</Grid>
									)
							))
						}
					</Grid>
					<Grid container justify="center" spacing={3} className={classes.container}>
						{
							Object.keys(historyStats).map(historyRange => (
								Object.keys(historyStats[historyRange]).map(stat => (
									<Grid item key={stat}>
										<HistoryStatCard historyRange={historyRange} stat={stat}/>
									</Grid>
								))
							))
						}
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}