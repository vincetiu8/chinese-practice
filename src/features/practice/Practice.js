import {PracticeCard} from "./PracticeCard";
import {WrongAnswerDialog} from "./WrongAnswerDialog";
import {useDispatch, useSelector} from "react-redux";
import {fetchInfo} from "../pairs/pairsSlice";
import {useEffect} from "react";
import {EditPairDialog} from "../pairs/EditPairDialog";
import {InfoCard} from "./InfoCard";
import {Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
	container: {
		padding: 24
	}
})

export const Practice = () => {
	const classes = useStyles()
	const dispatch = useDispatch()

	const loadStatus = useSelector(state => state.pairs.loadStatus)
	const stats = useSelector(state => state.pairs.stats)

	useEffect(() => {
		if (loadStatus === 'unloaded') {
			dispatch(fetchInfo())
		}
	}, [loadStatus, dispatch])

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
								<Grid item key={stat}>
									<InfoCard stat={stat}/>
								</Grid>
							))
						}
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}