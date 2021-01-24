import {Card, CardActions, Grid, IconButton, Typography} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {deletePair, updateEditingPair} from "./pairsSlice";

export const Pair = ({pair}) => {
	const dispatch = useDispatch()

	const onEdit = () => dispatch(updateEditingPair(pair.id))

	const onDelete = () => dispatch(deletePair(pair.id))

	return (
		<Grid item>
			<Card>
				<CardActions>
					<Typography>
						{pair.id}: {pair.definition}
					</Typography>
					<IconButton onClick={onEdit}>
						<Edit/>
					</IconButton>
					<IconButton onClick={onDelete}>
						<Delete/>
					</IconButton>
				</CardActions>
			</Card>
		</Grid>
	)
}