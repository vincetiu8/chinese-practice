import {DeletePairsCard} from "./DeletePairsCard";
import {Grid} from "@material-ui/core";
import {PairsList} from "./PairsList";
import {AddPairsForm} from "./AddPairsForm";
import {EditPairDialog} from "./EditPairDialog";
import {DownloadPairsCard} from "./DownloadPairsCard";
import {DownloadDataCard} from "./DownloadDataCard";
import {UploadDataCard} from "./UploadDataCard";
import {UploadPairsCard} from "./UploadPairsCard";

export const PairSettings = () => {
	return (
		<div>
			<EditPairDialog/>
			<Grid container direction="column" alignItems="center" spacing={3}>
				<Grid item>
					<AddPairsForm/>
				</Grid>
				<Grid item>
					<Grid container>
						<Grid item>
							<DownloadPairsCard/>
						</Grid>
						<Grid item>
							<UploadPairsCard/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container>
						<Grid item>
							<DownloadDataCard/>
						</Grid>
						<Grid item>
							<UploadDataCard/>
						</Grid>
					</Grid>
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