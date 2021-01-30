import {DeletePairsCard} from "./DeletePairsCard";
import {Grid} from "@material-ui/core";
import {PairsList} from "./PairsList";
import {AddPairsForm} from "./AddPairsForm";
import {EditPairDialog} from "./EditPairDialog";
import {DownloadPairsCard} from "./DownloadPairsCard";

export const PairSettings = () => {
	return (
		<div>
			<EditPairDialog/>
			<Grid container direction="column" alignItems="center" spacing={3}>
				<Grid item>
					<AddPairsForm/>
				</Grid>
				<Grid item>
					<DownloadPairsCard/>
				</Grid>
				<Grid item>
					<DeletePairsCard/>
				</Grid>
				<Grid item>
					<PairsList/>
				</Grid>
			</Grid>
		</div>
	)
}