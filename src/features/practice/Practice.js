import {PracticeCard} from "./PracticeCard";
import {WrongAnswerDialog} from "./WrongAnswerDialog";
import {useDispatch, useSelector} from "react-redux";
import {EditPairDialog} from "../pairs/EditPairDialog";
import {StatCard} from "./StatCard";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {HistoryStatCard} from "./HistoryStatCard";
import {GoalMetDialog} from "./GoalMetDialog";
import {useEffect} from "react";
import {saveInfo} from "../pairs/pairsSlice";

const useStyles = makeStyles({
	container: {
		padding: 24
	}
})

export const Practice = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const status = useSelector(state => state.pairs.loadStatus)
	const stats = useSelector(state => state.pairs.stats)
	const learnedTerms = useSelector(state => state.pairs.historyStats.learnedTerms)

	useEffect(() => {
		if (status !== "unloaded") {
			dispatch(saveInfo())
		}
	}, [dispatch, stats.learnedTerms, status])

	return (
		<div>
			<EditPairDialog/>
			<WrongAnswerDialog/>
			<GoalMetDialog/>
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
							Object.keys(learnedTerms).map(historyRange => (
								<Grid item key={historyRange}>
									<HistoryStatCard historyRange={historyRange}/>
								</Grid>
							))
						}
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}