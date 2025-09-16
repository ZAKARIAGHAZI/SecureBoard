import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {role === "admin" && (
          <ListItem button component={Link} to="/users">
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="Gestion Utilisateurs" />
          </ListItem>
        )}

        {(role === "manager" || role === "admin") && (
          <ListItem button component={Link} to="/projects">
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText primary="Gestion Projets" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}
