import {PracticeCard} from "./PracticeCard";
import {WrongAnswerDialog} from "./WrongAnswerDialog";
import {useDispatch, useSelector} from "react-redux";
import {fetchInfo} from "../pairs/pairsSlice";
import {useEffect} from "react";
import {EditPairDialog} from "../pairs/EditPairDialog";

export const Practice = () => {
	const dispatch = useDispatch()

	const loadStatus = useSelector(state => state.pairs.loadStatus)
	useEffect(() => {
		if (loadStatus === 'unloaded') {
			dispatch(fetchInfo())
		}
	}, [loadStatus, dispatch])

	return (
		<div>
			<PracticeCard/>
			<EditPairDialog/>
			<WrongAnswerDialog/>
		</div>
	)
}