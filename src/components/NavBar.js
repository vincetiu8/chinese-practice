import {Component} from "react";
import {AppBar, Toolbar, Typography} from "@material-ui/core";

class NavBar extends Component {
	render() {
		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h5" color="inherit">
							Chinese Practice App
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
		)
	}
}

export default NavBar;