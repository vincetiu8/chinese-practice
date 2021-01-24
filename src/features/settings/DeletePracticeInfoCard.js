import {Button, Card, CardActions} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {deletePracticeInfo} from "../pairs/pairsSlice";

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	},
	button: {
		color: "red"
	}
});

export const DeletePracticeInfoCard = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const onClick = () => dispatch(deletePracticeInfo())

	return (
		<div>
			<Card elevation={12}>
				<CardActions classes={{root: classes.actions}}>
					<Button
						variant="contained"
						classes={{root: classes.button}}
						onClick={onClick}
					>
						Delete Practice Info
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}