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
  return isLoggedIn ? (
    <Link href={`/credentials/logout`}>
      <Button variant="outlined" size="small">
        Cerrar Sesión
      </Button>
    </Link>
  ) : (
    <Link href={`/credentials/login`}>
      <Button variant="outlined" size="small">
        Iniciar Sesión
      </Button>
    </Link>
  );
}
