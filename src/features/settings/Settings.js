import {useSelector} from "react-redux";
import {Grid} from "@material-ui/core";
import {SettingsCardNumber} from "./SettingsCardNumber";
import {DeletePracticeInfoCard} from "./DeletePracticeInfoCard"
import {SettingsCardBool} from "./SettingsCardBool";
import {makeStyles} from "@material-ui/core/styles";

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
				</Grid>
			</Grid>
		</div>

	)
}