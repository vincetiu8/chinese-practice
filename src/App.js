import {NavBar} from "./app/NavBar";
import {Route, Switch} from "react-router-dom"
import {PairSettings} from "./features/pairs/PairSettings";
import {Practice} from "./features/practice/Practice";
import {Settings} from './features/settings/Settings'
import {useEffect} from "react";
import {fetchInfo, saveInfo} from "./features/pairs/pairsSlice";
import {useDispatch, useSelector} from "react-redux";

export default function App() {
	const dispatch = useDispatch()
	const loadStatus = useSelector(state => state.pairs.loadStatus)

	useEffect(() => {
		if (loadStatus === 'unloaded') {
			dispatch(fetchInfo())
		}
	}, [loadStatus, dispatch])

	useEffect(() => {
		const onUnload = () => dispatch(saveInfo())
		window.addEventListener('beforeunload', onUnload)
		return () => {
			window.removeEventListener('beforeunload', onUnload)
			onUnload()
		}
	}, [dispatch])

	return ( // todo: add page to see practice history
		<div className="App">
			<NavBar/>
			<Switch>
				<Route exact path="/" component={Practice}/>
				<Route exact path="/edit-pairs" component={PairSettings}/>
				<Route exact path="/settings" component={Settings}/>
			</Switch>
		</div>
	);
}
