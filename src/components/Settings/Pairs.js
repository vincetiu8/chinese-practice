import {Card, CardActions, CardContent, Grid, IconButton, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {Delete, Edit} from "@material-ui/icons";

export default function Pairs(props) {
	const [searchTerm, setSearchTerm] = useState("")

	function onChange(e) {
		setSearchTerm(e.target.value)
	}

	function generatePair(pair) {
		if (searchTerm === "" || pair[0].indexOf(searchTerm) !== -1 || pair[1].definition.indexOf(searchTerm) !== -1) {
			return (
				<Grid item>
					<Card>
						<CardActions>
							<Typography>
								{pair[0]}: {pair[1].definition}
							</Typography>
							<IconButton onClick={() => {props.editPair(pair[0])}}>
								<Edit/>
							</IconButton>
							<IconButton onClick={() => {props.deletePair(pair[0])}}>
								<Delete/>
							</IconButton>
						</CardActions>
					</Card>

				</Grid>
			)
		}
		return ""
	}

	return (
		<div>
			<Card elevation={12}>
				<CardActions>
					<Grid container direction="column" alignItems="center" spacing={2}>
						<Grid item>
							<TextField
								value={searchTerm}
								onChange={onChange}
							/>
						</Grid>
						{Object.entries(props.pairs).map(generatePair)}
					</Grid>
				</CardActions>
			</Card>
		</div>
	)
}