import {Button, Card, CardActions, CardContent, PropTypes, TextField} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {useEffect, useState} from "react";

const useStyles = makeStyles({
	textField: {
		width: "50ch"
	},
	actions: {
		justifyContent: "center"
	}
});

export default function AddPairs(props) {
	const classes = useStyles();

	const [value, setValue] = useState("");

	function onChange(e) {
		setValue(e.target.value)
	}

	function onClick() {
		props.onClick(value)
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