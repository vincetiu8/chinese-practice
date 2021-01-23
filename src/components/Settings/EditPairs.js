import AddPairs from "./AddPairs";
import DeletePairs from "./DeletePairs";
import Pairs from "./Pairs";
import {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import EditPairDialog from "./EditPairDialog";

export default function EditPairs() {
	const [pairs, setPairs] = useState({})
	const [dialogOpen, setDialogOpen] = useState(false)
	const [currentEditingTerm, setCurrentEditingTerm] = useState("")

	function addPairs(value) {
		const newPairs = value.split("\n")
		let newPairsObject = {}
		for (let i = 0; i < newPairs.length; i++) {
			let parsedPair = parsePair(newPairs[i])
			if (parsedPair === null) {
				continue
			}
			newPairsObject[parsedPair[0]] = {
				definition: parsedPair[1]
			}
		}
		setPairs({
			...pairs,
			...newPairsObject,
		})
	}

	function parsePair(pair) {
		const [term, definition] = pair.split(" ")
		if (term === "") {
			console.log("Unable to parse pair")
			return null
		} else if (definition === "") {
			console.log("Unable to find definition for " + term)
			return null
		}

		return [term, definition]
	}

	function editPair(term) {
		setCurrentEditingTerm(term)
		setDialogOpen(true)
	}

	function submitEditPair(term, definition) {
		setPairs({
			...pairs,
			[term]: {
				definition: definition
			}
		})
	}

	function deletePair(term) {
		let newPairs = removeKey(pairs, term)
		setPairs(newPairs)
	}

	function removeKey(myObj, deleteKey) {
		return Object.assign(
			{},
			...Object.entries(myObj)
				.filter(([k]) => k!== deleteKey)
				.map(([k, v]) => ({[k]: v})));
	}

	function deletePairs() {
		setPairs({})
	}

	function loadPairs() {
		const json = localStorage.getItem("pairs")
		const storedPairs = JSON.parse(json)
		if (storedPairs) {
			setPairs(storedPairs)
		}
	}

	function savePairs() {
		const json = JSON.stringify(pairs)
		console.log(pairs)
		localStorage.setItem("pairs", json)
	}

	useEffect(loadPairs, [])
	useEffect(savePairs, [pairs])

	return (
		<div>
			<EditPairDialog
				open={dialogOpen}
				term={currentEditingTerm}
				definition={currentEditingTerm in pairs
					? pairs[currentEditingTerm].definition
					: ""
				}
				submitEditPair={submitEditPair}
			/>
			<Grid container direction="column" alignItems="center" spacing={3}>
				<Grid item>
					<AddPairs onClick={addPairs}/>
				</Grid>
				<Grid item>
					<DeletePairs onClick={deletePairs}/>
				</Grid>
				{
					Object.keys(pairs).length > 0
					? (
							<Grid item>
								<Pairs pairs={pairs} editPair={editPair} deletePair={deletePair}/>
							</Grid>
						) : ""
				}
			</Grid>
		</div>
	)
}