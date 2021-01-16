import NavBar from "./components/NavBar";
import Practice from "./components/Practice";
import {Grid} from "@material-ui/core";

function App() {
  return (
    <div className="App">
		<NavBar/>
		<Grid container direction="column" alignItems="center" justify="center" style={{padding:24}}>
			<Grid item sm={8}>
				<Practice/>
			</Grid>
		</Grid>
    </div>
  );
}

export default App;
