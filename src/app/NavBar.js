import {useState} from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import {NavDrawer} from "./NavDrawer";
import {Menu} from "@material-ui/icons";

export const NavBar = () => {
	const [navDrawerOpen, setNavDrawerOpen] = useState(false)

	function toggleNavDrawer() {
		setNavDrawerOpen(!navDrawerOpen)
	}

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={toggleNavDrawer}>
						<Menu/>
					</IconButton>
					<Typography variant="h6" color="inherit">
						Chinese Practice App
					</Typography>
				</Toolbar>
			</AppBar>
			<NavDrawer open={navDrawerOpen} onClose={toggleNavDrawer}/>
		</div>
	)
}