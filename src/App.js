import NavBar from "./components/Navigation/NavBar";
import Practice from "./components/Practice/Practice";
import EditPairs from "./components/Settings/EditPairs";
import {Grid} from "@material-ui/core";
import {Route, Switch} from "react-router-dom"

export default function App() {
	return (
		<div className="App">
			<NavBar/>
			<Grid container direction="column" alignItems="center" justify="center" style={{padding:24}}>
				<Grid item sm={8}>
					<Switch>
						<Route path="/" component={Practice} exact/>
						<Route path="/edit-terms" component={EditPairs}/>
					</Switch>
				</Grid>
			</Grid>
		</div>
	);
}
