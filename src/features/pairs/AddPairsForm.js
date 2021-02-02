import {Button, Card, CardActions, CardContent, TextField} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import {useState} from "react";
import {useDispatch} from "react-redux";
import {addPairs} from "./pairsSlice";

const useStyles = makeStyles({
	textField: {
		maxWidth: "25ch"
	},
	actions: {
		justifyContent: "center"
	}
});

export const AddPairsForm = () => {
	const classes = useStyles()

	const dispatch = useDispatch()

	const [value, setValue] = useState("");

	const onChange = e => setValue(e.target.value)

	function onClick() {
		dispatch(addPairs(value))
		setValue("")
	}

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<TextField
						multiline
						fullWidth
						placeholder="Add Pairs Here"
						classes={{root: classes.textField}}
						value={value}
						onChange={onChange}
					/>
				</CardContent>
				<CardActions classes={{root: classes.actions}}>
					<Button variant="contained" onClick={onClick}>Submit</Button>
				</CardActions>
			</Card>
		</div>
	)
}