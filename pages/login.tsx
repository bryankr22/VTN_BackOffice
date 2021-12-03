import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { useCookies } from "react-cookie";

import { PUBLIC_URL, validateAuth } from '../helpers/constants';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.vendetunave.co/">
        VendeTuNave
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
    }
  },
});

export default function Login() {
  const [cookie, setCookie] = useCookies(["admin_token"]);
  const [cookies] = useCookies(["admin_token"]);

  useEffect(() => {
    if (cookies.admin_token) location.href = '/users';
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const dataForm = {
      email: data.get('email'),
      password: data.get('password'),
    };

    await axios.post(`${PUBLIC_URL}/login-admin`, dataForm).then((res) => {
      const token = jwt.sign(res.data, 'vendetunave2021');
      setCookie('admin_token', token, {
        path: "/",
        expires: null,
        sameSite: true
      });
      location.href = '/users';
    }).catch(error => {
    });
  };

  return (
    <ThemeProvider theme={theme}>
      {!cookies.admin_token &&
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/featured/?cars)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(100%)'
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ width: 150, height: 150 }} alt="logo VTN" src="/images/logo_VTN.png" />
              <Typography component="h1" variant="h5">
                Iniciar Sesión
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar Sesión
                </Button>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      }
    </ThemeProvider>
  );
}