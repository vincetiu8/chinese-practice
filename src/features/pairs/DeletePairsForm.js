import {Button, Card, CardActions} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {deletePairs} from "./pairsSlice";

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	},
	button: {
		color: "red"
	}
});

export const DeletePairsForm = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const onClick = () => dispatch(deletePairs())

	return (
		<div>
			<Card elevation={12}>
				<CardActions classes={{root: classes.actions}}>
					<Button
						variant="contained"
						classes={{root: classes.button}}
						onClick={onClick}
					>
						Delete All Terms
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}