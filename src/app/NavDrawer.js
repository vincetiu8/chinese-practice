import {Drawer, ListItem, ListItemIcon, ListItemText, List} from "@material-ui/core";
import {Create, Tune} from "@material-ui/icons";
import ListIcon from "@material-ui/icons/List";
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
					<ListItem button key="practice" component={Link} to="/" onClick={onClose}>
						<ListItemIcon><Create/></ListItemIcon>
						<ListItemText primary="Practice"/>
					</ListItem>
					<ListItem button key="edit-pairs" component={Link} to="/edit-pairs" onClick={onClose}>
						<ListItemIcon><ListIcon/></ListItemIcon>
						<ListItemText primary="Edit Terms"/>
					</ListItem>
					<ListItem button key="settings" component={Link} to="/settings" onClick={onClose}>
						<ListItemIcon><Tune/></ListItemIcon>
						<ListItemText primary="Settings"/>
					</ListItem>
				</List>
			</Drawer>
		</div>
	)
}