import {Button, Card, CardActions, CardContent, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	},
	button: {
		color: "red"
	}
});

export default function DeletePairs(props) {
	const classes = useStyles()

	function onClick() {
		props.onClick()
	}

	return (
		<div>
			<Card elevation={12}>
				<CardActions classes={{root: classes.actions}}>
					<Button variant="contained" classes={{root: classes.button}}onClick={onClick}>Delete All Terms</Button>
				</CardActions>
			</Card>
		</div>
	)
}