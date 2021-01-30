import {Card, CardActions, Grid, TextField} from "@material-ui/core";
import {useState} from "react";
import {useSelector} from "react-redux";
import {selectPairsBySearchTerm} from "./pairsSlice";
import {Pair} from "./Pair";

export const PairsList = () => { // todo: add option to download pairs as json or txt
	const [searchTerm, setSearchTerm] = useState("")

	const onChange = (e) => setSearchTerm(e.target.value)

	const pairs = useSelector(state => selectPairsBySearchTerm(state, searchTerm))

	const content = pairs.map(pair => (
		<Grid item key={pair.id}>
			<Pair pair={pair}/>
		</Grid>
	))

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
						{content}
					</Grid>
				</CardActions>
			</Card>
		</div>
	)
}