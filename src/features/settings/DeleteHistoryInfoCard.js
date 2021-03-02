import {Button, Card, CardActions} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {deleteHistoryInfo} from "../pairs/pairsSlice";

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	},
	button: {
		color: "red"
	}
});

export const DeleteHistoryInfoCard = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const onClick = () => dispatch(deleteHistoryInfo())

	return (
		<div>
			<Card elevation={12}>
				<CardActions classes={{root: classes.actions}}>
					<Button
						variant="contained"
						classes={{root: classes.button}}
						onClick={onClick}
					>
						Delete History Info
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}