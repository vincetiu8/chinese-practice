import {Button, Card, CardActions} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {addDataFromFile} from "./pairsSlice";

const useStyles = makeStyles({
	actions: {
		justifyContent: "center"
	},
	button: {
		color: "green"
	}
});

export const UploadDataCard = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	let fileReader

	const handleFileRead = () => {
		const content = fileReader.result
		const data = JSON.parse(content)
		dispatch(addDataFromFile(data))
	}

	const onChange = (e) => {
		fileReader = new FileReader()
		fileReader.onloadend = handleFileRead
		fileReader.readAsText(e.target.files[0])
	}

	return (
		<div>
			<Card elevation={12}>
				<CardActions classes={{root: classes.actions}}>
					<Button
						variant="contained"
						component="label"
						classes={{root: classes.button}}
					>
						Upload Pair Data
						<input
							type="file"
							hidden
							onChange={onChange}
						/>
					</Button>
				</CardActions>
			</Card>
		</div>
	)
}