import {Button, Dialog, DialogActions, TextField} from "@material-ui/core";
import {useState} from "react";

export default function EditPairDialog(props) {
	const [errorTerm, setErrorTerm] = useState(false)
	const [errorDefinition, setErrorDefinition] = useState(false)
	const [term, setTerm] = useState(props.term)
	const [definition, setDefinition] = useState(props.definition)

	function onChangeTerm(e) {
		setTerm(e.target.value)
	}

	function onChangeDefinition(e) {
		setDefinition(e.target.value)
	}

	function submitPair(e) {
		if (e.key === "Enter") {
			if (term === "") {
				setErrorTerm(true)
				setErrorDefinition(false)
				return
			}
			if (definition === "") {
				setErrorDefinition(true)
				setErrorTerm(false)
				return
			}
			props.submitEditPair(term, definition)
		}
	}

	return (
		<Dialog open={props.open}>
			<DialogActions>
				<TextField
				error={errorTerm}
				value={term}
				helperText="Term"
				onChange={onChangeTerm}
				onKeyPress={submitPair}
				/>
				<TextField
					error={errorDefinition}
					value={definition}
					helperText="Definition"
					onChange={onChangeDefinition}
					onKeyPress={submitPair}
				/>
				<Button onClick={submitPair}>Submit</Button>
			</DialogActions>
		</Dialog>
	)
}