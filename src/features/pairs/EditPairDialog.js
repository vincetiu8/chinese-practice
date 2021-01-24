import {Button, Dialog, DialogActions, TextField} from "@material-ui/core";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {editPair} from "./pairsSlice";

export const EditPairDialog = () => {
	const dispatch = useDispatch()

	const pair = useSelector(state => state.pairs.editingPair)
	const status = useSelector(state => state.pairs.status)
	const [open, setOpen] = useState(false)

	const [errorTerm, setErrorTerm] = useState(false)
	const [errorDefinition, setErrorDefinition] = useState(false)
	const [newId, setNewId] = useState('')
	const [definition, setDefinition] = useState('')

	const onChangeId = e => setNewId(e.target.value)
	const onChangeDefinition = e => setDefinition(e.target.value)

	const onEnter = e => {
		if (e.key === "Enter") {
			submitPair()
		}
	}

	const submitPair = () => {
		if (newId === "") {
			setErrorTerm(true)
			setErrorDefinition(false)
			return
		}
		if (definition === "") {
			setErrorDefinition(true)
			setErrorTerm(false)
			return
		}

		dispatch(editPair({newId, definition}))
	}

	useEffect(() => {
		setOpen(status === 'editing')
		if (open && pair !== null) {
			setNewId(pair.id)
			setDefinition(pair.definition)
		}
	}, [status, pair, open])

	return (
		<Dialog open={open}>
			<DialogActions>
				<TextField
					error={errorTerm}
					value={newId}
					helperText="Term"
					onChange={onChangeId}
					onKeyPress={onEnter}
				/>
				<TextField
					error={errorDefinition}
					value={definition}
					helperText="Definition"
					onChange={onChangeDefinition}
					onKeyPress={onEnter}
				/>
				<Button onClick={submitPair}>Submit</Button>
			</DialogActions>
		</Dialog>
	)
}