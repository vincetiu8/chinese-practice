import {useDispatch, useSelector} from "react-redux";
import {Grid} from "@material-ui/core";
import {SettingsCardNumber} from "./SettingsCardNumber";
import {useEffect} from "react";
import {fetchInfo, saveInfo} from "../pairs/pairsSlice";
import {DeletePracticeInfoCard} from "./DeletePracticeInfoCard"
import {SettingsCardBool} from "./SettingsCardBool";

export const Settings = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		const onUnload = () => dispatch(saveInfo())
		window.addEventListener('beforeunload', onUnload)
		return () => {
			window.removeEventListener('beforeunload', onUnload)
			onUnload()
		}
	}, [dispatch])

	const loadStatus = useSelector(state => state.pairs.loadStatus)
	useEffect(() => {
		if (loadStatus === 'unloaded') {
			dispatch(fetchInfo())
		}
	}, [loadStatus, dispatch])

	const settings = useSelector(state => state.pairs.settings)
	return (
		<div>
			<Grid container alignItems="column" justify="center" spacing={3}>
				<Grid item>
					<Grid container spacing={3} justify="center">
						{
							Object.keys(settings).map(setting => (
								<Grid item key={setting}>
									{typeof settings[setting] === "boolean"
										? <SettingsCardBool setting={setting}/>
										: <SettingsCardNumber setting={setting}/>
									}
								</Grid>
							))
						}
					</Grid>
				</Grid>
				<Grid item>
					<DeletePracticeInfoCard/>
				</Grid>
			</Grid>
		</div>

	)
}