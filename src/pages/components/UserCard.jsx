import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import axios from "axios";

//Definir variable de entorno
const url_api = process.env.API_URL;

export default function UserCard({ id, name, lastname, email, role }) {
  const [userPicture, setUserPicture] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [newRole, setNewRole] = React.useState(role);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRoleChange = (event) => {
    setNewRole(event.target.value);
  };

  const handleSave = () => {
    // !Send to api
    axios
      .put(url_api + "/user/" + id, {
        role: newRole,
      })
      .then((response) => {
        console.log(response);
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.reload();
  };

  React.useEffect(() => {
    if (role === "user") {
      setUserPicture("/assets/user.png");
    }
    if (role === "admin") {
      setUserPicture("/assets/admin.png");
    }
    if (role === "revisor") {
      setUserPicture("/assets/revisor.png");
    }
    if (role === "author") {
      setUserPicture("/assets/author.png");
    }
  }, []);
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={name + "picture"} src={userPicture} />
        </ListItemAvatar>
        <ListItemText
          primary={name + " " + lastname}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {role}
              </Typography>
              <br />
              {email}
            </React.Fragment>
          }
        />
        <Chip
          icon={<ManageAccountsIcon />}
          label="Cambiar Rol"
          onClick={handleClickOpen}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <Dialog maxWidth={"xs"} open={open} onClose={handleClose}>
        <DialogTitle>Cambio de rol a {name + " " + lastname}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tu como administrador puedes cambiar el rol de los usuarios de la
            plataforma.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">Cambio de Rol</InputLabel>
              <Select
                autoFocus
                value={newRole}
                onChange={handleRoleChange}
                label="Cambio de rol del usuario"
              >
                <MenuItem value="user">Usuario</MenuItem>
                <MenuItem value="revisor">Revisor</MenuItem>
                <MenuItem value="author">Autor</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            style={{ background: "#1976D2", color: "#fff" }}
          >
            Guardar
          </Button>
          <Button onClick={handleClose}>Cerrar sin guardar</Button>
        </DialogActions>
      </Dialog>
    </List>
  );
}
