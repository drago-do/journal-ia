import React from "react";
import Cookies from "js-cookie";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function UserInfoButton() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userPicture, setUserPicture] = React.useState("");

  React.useEffect(() => {
    const id_user = Cookies.get("id_user");
    const role = Cookies.get("role");
    if (id_user) {
      setIsLoggedIn(true);
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
    }
  }, []);

  return isLoggedIn ? (
    <Link href={`/user`} className="userCard">
      <Stack direction="row" spacing={2}>
        <Avatar alt="UserProfile" src={userPicture} />
        <Typography
          className="hidden md:block"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {Cookies.get("name")} {Cookies.get("lastname")}
        </Typography>
      </Stack>
    </Link>
  ) : (
    <Typography variant="h5">Bienvenido invitado</Typography>
  );
}
