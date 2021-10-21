import {DeletePairsCard} from "./DeletePairsCard";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
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
					<Card>
						<CardContent>
							<Typography>
								Here's where you can enter some pairs to learn. A pair consists of a 'term' and 'definition'.

								You should separate the term and definition in
								each pair with a tab character (preferred) or space. The easiest way to do this is by entering
								all the terms into a sheet and pasting it here. This will also work even if the terms and
								definitions have spaces in them.

								Note that duplicate terms will result in only the last term being accepted into the system.
								Duplicate definitions (i.e. the definition being the same for 2 terms) is fine and the system
								will process it accordingly.
							</Typography>
						</CardContent>
					</Card>
				</Grid>
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
