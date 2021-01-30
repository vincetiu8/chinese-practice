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

export const DownloadPairsCard = () => {
	const classes = useStyles()

	const pairs = useSelector(state => state.pairs.entities)

	const onClick = () => {
		let data = ""
		for (let pair of Object.values(pairs)) {
			data += pair.id + " " + pair.definition + "\n"
		}
		fileDownload(data, "filename.txt")
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
						Download Terms
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}