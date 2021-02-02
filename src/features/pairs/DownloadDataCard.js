import {Button, Card, CardActions} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import fileDownload from "js-file-download"

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	},
	button: {
		color: "green"
	}
});

export const DownloadDataCard = () => {
	const classes = useStyles()

	const pairs = useSelector(state => state.pairs.entities)

	const onClick = () => {
		fileDownload(JSON.stringify(pairs), "pairs.json")
	}

	return (
		<div>
			<Card elevation={12}>
				<CardActions classes={{root: classes.actions}}>
					<Button
						variant="contained"
						classes={{root: classes.button}}
						onClick={onClick}
					>
						Download Pair Data
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}