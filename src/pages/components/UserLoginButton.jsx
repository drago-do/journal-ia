import React from "react";
import Cookies from "js-cookie";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

export default function UserLoginButton() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    const id_user = Cookies.get("id_user");
    if (id_user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoutClick = () => {
    //Delete all cookies of user and return to main page
    Cookies.remove("id_user");
    Cookies.remove("name");
    Cookies.remove("lastname");
    Cookies.remove("email");
    Cookies.remove("role");
    window.location.href = "/";
  };

  return isLoggedIn ? (
    <Button variant="outlined" size="small" onClick={handleLogoutClick}>
      Cerrar Sesión
    </Button>
  ) : (
    <Link href={`/credentials/login`}>
      <Button variant="outlined" size="small">
        Iniciar Sesión
      </Button>
    </Link>
  );
}
