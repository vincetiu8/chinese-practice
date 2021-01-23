import {Drawer, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Create, Tune} from "@material-ui/icons";
import {Link} from "react-router-dom";

export default function NavDrawer(props) {
	return (
		<div>
			<Drawer anchor="left" open={props.open} onClose={props.toggleNavDrawer}>
				<List>
					<ListItem button key="practice" component={Link} to="/">
						<ListItemIcon><Create/></ListItemIcon>
						<ListItemText primary="Practice"/>
					</ListItem>
					<ListItem button key="edit-terms" component={Link} to="/edit-terms">
						<ListItemIcon><Tune/></ListItemIcon>
						<ListItemText primary="Edit Pairs"/>
					</ListItem>
				</List>
			</Drawer>
		</div>
	)
}