import {DeletePairsForm} from "./DeletePairsForm";
import {Grid} from "@material-ui/core";
import {PairsList} from "./PairsList";
import {AddPairsForm} from "./AddPairsForm";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {savePairs} from "./pairsSlice";
import {EditPairDialog} from "./EditPairDialog";

export const PairSettings = () => {
	const dispatch = useDispatch()


	useEffect(() => {
		const onUnload = () => dispatch(savePairs())
		window.addEventListener('beforeunload', onUnload)
		return () => {
			window.removeEventListener('beforeunload', onUnload)
			onUnload()
		}
	}, [dispatch])

	return (
		<div>
			<EditPairDialog/>
			<Grid container direction="column" alignItems="center" spacing={3}>
				<Grid item>
					<AddPairsForm/>
				</Grid>
				<Grid item>
					<DeletePairsForm/>
				</Grid>
				<Grid item>
					<PairsList/>
				</Grid>
			</Grid>
		</div>
	)
}