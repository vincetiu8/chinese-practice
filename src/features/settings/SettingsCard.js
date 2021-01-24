import {useDispatch, useSelector} from "react-redux";
import {Card, CardActions, CardContent, IconButton, TextField, Typography} from "@material-ui/core";
import {Add, Remove} from "@material-ui/icons";
import {updateSettings} from "../pairs/pairsSlice";
import {useEffect, useState} from "react";

export const SettingsCard = ({setting}) => {
	const dispatch = useDispatch()

	const settingValue = useSelector(state => state.pairs.settings[setting])
	const [value, setValue] = useState(settingValue)

	const onChange = e => setValue(e.target.value.parseInt())

	const onClick = (i) => setValue(value + i)
	
	useEffect(() => {
		if (Number.isInteger(value)) {
			dispatch(updateSettings({
				[setting]: value
			}))
		}
	}, [dispatch, setting, value])

	useEffect(() => {
		setValue(settingValue)
	}, [settingValue])

	return (
		<div>
			<Card elevation={12}>
				<CardContent>
					<Typography variant="h5">
						{
							(setting.charAt(0).toUpperCase() + setting.slice(1))
								.split(/(?=[A-Z])/)
								.join(' ')
						}
					</Typography>
					<Typography variant="h3">
						{settingValue}
					</Typography>
				</CardContent>
				<CardActions>
					<IconButton onClick={() => onClick(-1)}>
						<Remove/>
					</IconButton>
					<TextField
						value={value}
						type="number"
						onChange={onChange}
					/>
					<IconButton onClick={() => onClick(1)}>
						<Add/>
					</IconButton>
				</CardActions>
			</Card>
		</div>
	)
}