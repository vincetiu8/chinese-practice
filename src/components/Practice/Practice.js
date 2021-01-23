import importedPairs from "../data/pairs.json"
import {Component, useEffect, useState} from "react";
import PracticeCard from "./PracticeCard";
import WrongAnswerDialog from "./WrongAnswerDialog";

export default function Practice(props) {
	const pairs = importedPairs
	const [currentPair, setCurrentPair] = useState("")
	const [dialogOpen, setDialogOpen] = useState(false)

	function generateNextTerm() {
		const pairNumber = Math.floor(Math.random() * pairs.length)
		setCurrentPair(pairs[pairNumber])
	}

	function submitAnswer(answer) {
		if (answer !== currentPair.definition) {
			setDialogOpen(true)
		} else {
			setDialogOpen(false)
			generateNextTerm()
		}
	}

	function onComponentUpdate() {
		if (currentPair === "") {
			generateNextTerm()
		}
	}

	useEffect(onComponentUpdate)

	return (
		<div>
			<PracticeCard
				term={currentPair.term}
				submitAnswer={submitAnswer}
			/>
			<WrongAnswerDialog
				open={dialogOpen}
				pair={currentPair}
				submitAnswer={submitAnswer}
			/>
		</div>
	)
}