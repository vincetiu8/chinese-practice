import {useDispatch, useSelector} from "react-redux";
import {Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {updateSettings} from "../pairs/pairsSlice";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	}
});

export const SettingsCardBool = ({setting}) => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const settingValue = useSelector(state => state.pairs.settings[setting])

	const onClick = () => dispatch(
		updateSettings({
			[setting]: !settingValue
		})
	)

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<Typography variant="h5">
						{
							(setting.charAt(0).toUpperCase() + setting.slice(1))
								.split(/(?=[A-Z])/)
								.join(' ')
						}
					</Typography>
				</CardContent>
				<CardActions className={classes.actions}>
					<Button
						variant="contained"
						onClick={onClick}
					>
						{settingValue.toString()}
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}