import { useState } from 'react';
import { Box, TextField, MenuItem, Avatar, Snackbar, Alert, Link, Typography, Breadcrumbs, Stack, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, S3_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';

export default function User({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);

  const [user, setUser] = useState(data.users);
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [snackBar, setSnackBar] = useState<PropsSnackBar>({
    open: false,
    type: 'success',
    message: ''
  });

  const handleClose = () => setSnackBar({
    open: false,
    type: 'success',
    message: ''
  });

  const updateUser = async () => {
    setLoading(true);
    setErrorEmail(false);
    const { nombre, telefono, email, genero, fecha_nacimiento, rol_id, id } = user;

    if (nombre === '' || email === '') {
      setSnackBar({ open: true, type: 'error', message: 'Llena todos los campos obligatorios!' });
      setLoading(false);
      return;
    }
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!emailRegex.test(email)) {
      setSnackBar({ open: true, type: 'error', message: 'Ingresa un email valido!' });
      setErrorEmail(true);
      setLoading(false);
      return;
    }

    const data = { nombre, telefono, email, genero, fecha_nacimiento, rol_id, id };
    const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
    const res = await axios.put(`${API_URL}/users`, data, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    setLoading(false);
  }

  return (
    <AdminLayout>
      <>
        <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackBar.type} sx={{ width: '100%' }}>
            {snackBar.message}
          </Alert>
        </Snackbar>
        <Avatar
          alt={data.users.image}
          src={`${S3_URL}/usuarios/${data.users.image}`}
          style={{ margin: '0 auto', marginBottom: 30 }}
          sx={{ width: 200, height: 200 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="name"
                label="Nombre"
                variant="outlined"
                required
                error={(user.nombre === '') ? true : false}
                value={user.nombre}
                onChange={(event) => setUser({ ...user, nombre: event.target.value })}
              />
              <TextField
                id="email"
                type="email"
                label="Correo electrónico"
                required
                error={(user.email === '' || errorEmail) ? true : false}
                variant="outlined"
                value={user.email}
                onChange={(event) => setUser({ ...user, email: event.target.value })}
              />
              <TextField
                id="date"
                type="date"
                label="Fecha de nacimiento"
                variant="outlined"
                value={user.fecha_nacimiento}
                onChange={(event) => setUser({ ...user, fecha_nacimiento: event.target.value })}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="phone"
                label="Teléfono"
                variant="outlined"
                value={user.telefono}
                onChange={(event) => setUser({ ...user, telefono: event.target.value })}
              />

              <TextField
                id="gender"
                select
                label="Género"
                value={user.genero}
                onChange={(event) => setUser({ ...user, genero: event.target.value })}
              >
                <MenuItem key={1} value={1}>Masculino</MenuItem>
                <MenuItem key={2} value={2}>Femenino</MenuItem>
                <MenuItem key={3} value={3}>No especificar</MenuItem>
              </TextField>

              <LoadingButton loading={loading} fullWidth size="large" onClick={updateUser} variant="contained">Guardar</LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const auth = validateAuth(context);

  if (!auth.admin_token) {
    context.res.writeHead(301, {
      Location: '/401'
    });
    context.res.end();
    return {
      props: {}
    }
  }
  const cookie = auth.admin_token;
  const config = {
    headers: { Authorization: `Bearer ${cookie}` }
  };
  const decoded = jwt.verify(cookie, 'vendetunave2021');
  const res = await axios.get(`${API_URL}/users/${decoded.user.id}`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}