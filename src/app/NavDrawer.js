import {Drawer, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Create, Tune} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
	drawerPaper: {
		paddingRight: '5ch'
	}
})

export const NavDrawer = ({open, onClose}) => {
	const classes = useStyles()

	return (
		<div>
			<Drawer
				anchor="left"
				open={open}
				onClose={onClose}
				classes={{paper: classes.drawerPaper}}
			>
				<List>
					<ListItem button key="practice" component={Link} to="/">
						<ListItemIcon><Create/></ListItemIcon>
						<ListItemText primary="Practice"/>
					</ListItem>
					<ListItem button key="edit-pairs" component={Link} to="/edit-pairs">
						<ListItemIcon><Tune/></ListItemIcon>
						<ListItemText primary="Edit Terms"/>
					</ListItem>
				</List>
			</Drawer>
		</div>
	)
}