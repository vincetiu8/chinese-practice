import {Card, CardActions, Grid, TextField} from "@material-ui/core";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchInfo, selectPairsBySearchTerm} from "./pairsSlice";
import {Pair} from "./Pair";

export const PairsList = () => { // todo: add option to download pairs as json or txt
	const dispatch = useDispatch()

	const loadStatus = useSelector(state => state.pairs.loadStatus)
	useEffect(() => {
		if (loadStatus === 'unloaded') {
			dispatch(fetchInfo())
		}
	}, [loadStatus, dispatch])

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