import {PracticeCard} from "./PracticeCard";
import {WrongAnswerDialog} from "./WrongAnswerDialog";
import {useDispatch, useSelector} from "react-redux";
import {fetchPairs} from "./pairsSlice";
import {useEffect} from "react";

export const Practice = () => {
	const dispatch = useDispatch()

	const loadStatus = useSelector(state => state.pairs.loadStatus)
	useEffect(() => {
		if (loadStatus === 'unloaded') {
			dispatch(fetchPairs())
		}
	}, [loadStatus, dispatch])

	return (
		<div>
			<PracticeCard/>
			<WrongAnswerDialog/>
		</div>
	)
}