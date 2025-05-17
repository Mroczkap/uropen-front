import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent";

import axios from "../api/axios";
const LOGIN_URL = "auth/login";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, roles, accessToken });
      localStorage.setItem("user", user);
      localStorage.setItem("token", accessToken);
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card elevation={3} sx={{width: 350, marginTop: 4}}>
        <CardContent>
          <Typography
            ref={errRef}
            variant="body1"
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </Typography>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Logowanie
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  type="text"
                  id="username"
                  inputRef={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  label="Nazwa użytkownika"
                />
              </Grid>
              <Grid item>
                <TextField
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  label="Hasło"
                />
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit">
                  Zaloguj
                </Button>
              </Grid>
              <Grid item>
                <div className="persistCheck">
                  <FormControlLabel
                    control={<Checkbox checked={persist} onChange={togglePersist} />}
                    label="Zapamiętaj mnie"
                  />
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
