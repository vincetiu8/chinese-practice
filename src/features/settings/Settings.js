import {useSelector} from "react-redux";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import {SettingsCardNumber} from "./SettingsCardNumber";
import {DeletePracticeInfoCard} from "./DeletePracticeInfoCard"
import {SettingsCardBool} from "./SettingsCardBool";
import {makeStyles} from "@material-ui/core/styles";
import {DeleteHistoryInfoCard} from "./DeleteHistoryInfoCard";

const useStyles = makeStyles({
	container: {
		padding: 24
	}
})

export const Settings = () => {
	const classes = useStyles()

	const settings = useSelector(state => state.pairs.settings)
	return (
		<div>
			<Grid
				container
				direction="column"
				alignItems="center"
				justify="center"
				spacing={3}
				className={classes.container}
			>
				<Grid item>
					<Typography>
						It's mostly fine to keep everything on default settings, the only thing you should pay attention
						to here is the 'daily goal' setting. That is the number of new terms you want to learn each day.
						This should be between 0 (if you want to just revise existing terms you've learned) to about 15.
						Any more than that is overkill because on top of learning new terms, you will also be revising
						old terms. Of course, there's no limit on the actual number of terms you can learn in a day, but
						the goal helps you keep on track. It's better to set a low goal but reach it every day.
					</Typography>
				</Grid>
				<Grid item>
					<Grid container spacing={3} justify="center">
						{
							Object.keys(settings).map(setting => (
								<Grid item key={setting}>
									{typeof settings[setting] === "boolean"
										? <SettingsCardBool setting={setting}/>
										: <SettingsCardNumber setting={setting}/>
									}
								</Grid>
							))
						}
					</Grid>
				</Grid>
				<Grid item>
					<DeletePracticeInfoCard/>
					<DeleteHistoryInfoCard/>
				</Grid>
			</Grid>
		</div>

	)
}
