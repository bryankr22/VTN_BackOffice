import { useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography, Grid, Box, TextField, Stack, Breadcrumbs, Snackbar, Alert, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';

export default function Services({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }

  const [cookies] = useCookies(["admin_token"]);
  const [permissions, setPermissions] = useState(data.permissions);
  const [rol, setRol] = useState({
    nombre: ''
  });
  const [loading, setLoading] = useState(false);
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

  const handleChange = (option, event: React.ChangeEvent<HTMLInputElement>) => {
    const newPermissions = permissions;
    newPermissions.find(object => object.id === option.id).checked = event.target.checked;
    setPermissions([...newPermissions]);
  }

  const createPermissions = async () => {
    setLoading(true);
    if (rol.nombre === '') {
      setSnackBar({ open: true, type: 'error', message: 'Llena el nombre del rol!' });
      setLoading(false);
      return;
    }
    const newPermissions = permissions.filter(object => object.checked != false);
    const data = {
      ...rol,
      permissions: newPermissions
    }

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`
      }
    };
    const res = await axios.post(`${API_URL}/create-permissions`, data, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    setLoading(false);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/permissions">
      Roles
    </Link>, ,
    <Typography key="2" color="text.primary">
      Crear Rol
    </Typography>,
  ];

  return (
    <AdminLayout>
      <>
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackBar.type} sx={{ width: '100%' }}>
            {snackBar.message}
          </Alert>
        </Snackbar>
        <Grid item xs={12} md={12}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="nombre"
              label="Rol"
              required
              error={(rol.nombre === '') ? true : false}
              variant="outlined"
              value={rol.nombre}
              onChange={(event) => setRol({ ...rol, nombre: event.target.value })}
            />
          </Box>
        </Grid>
        <FormGroup>
          {data.modules.map((item) => (
            <>
              <Typography key={item.name}>{item.name}</Typography>
              <FormGroup aria-label="position" row style={{ marginLeft: 15, marginBottom: 20 }}>
                {permissions.map((option) => {
                  return item.id === option.module &&
                    <FormControlLabel
                      key={option.slug}
                      control={
                        <Checkbox checked={option.checked} onChange={(e) => handleChange(option, e)} name={option.slug} />
                      }
                      label={option.name}
                    />
                })}
              </FormGroup>
            </>
          ))}
        </FormGroup>

        <Grid item xs={12} md={12}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <LoadingButton loading={loading} fullWidth size="large" onClick={createPermissions} variant="contained">Guardar</LoadingButton>
          </Box>
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
  const res = await axios.get(`${API_URL}/form-create-permissions`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}