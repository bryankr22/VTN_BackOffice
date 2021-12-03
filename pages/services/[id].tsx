import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Link,
  Typography,
  Breadcrumbs,
  Stack,
  Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { API_URL, validateAuth } from '../../helpers/constants';


export default function CreateService({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const [service, setService] = useState(data.services);
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

  const onChangeFile = (picture, e) => {
    if (e.target.files[0]) {
      const objectUrl = URL.createObjectURL(e.target.files[0])
      setService({ ...service, image: objectUrl });
    }
  }

  const createService = async () => {
    setLoading(true);
    if (service.image === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen principal!' });
      setLoading(false);
      return;
    }

    let error = false;
    Object.entries(service).map((item) => {
      if (!item[1] && item[0] !== 'image') {
        error = true;
        return;
      }
    });

    if (error) {
      setSnackBar({ open: true, type: 'error', message: 'Llena todos los campos obligatorios!' });
      setLoading(false);
      return;
    }

    let formData = new FormData();
    const file1: any = document.getElementById('file1');
    Object.entries(service).map((item) => {
      if (item[0] !== 'picture') {
        formData.append(item[0], item[1]);
      }
    });
    formData.append('image1', file1.files[0]);

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookie}`
      }
    };
    const res = await axios.post(`${API_URL}/update-service`, formData, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    if (res.data.status) {
      file1.value = null;
    }
    setLoading(false);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/services">
      Servicios
    </Link>, ,
    <Typography key="2" color="text.primary">
      Crear Servicio
    </Typography>,
  ];

  return (
    <AdminLayout>
      <>
        <style>
          {`
          .dropzone {
            position: relative;
            border: 2px dotted #111;
            border-radius: 20px;
            color: black;
            font: bold 20px/200px arial;
            height: 200px;
            margin: 30px auto;
            text-align: center;
            width: 250px;
          }

          .dropzone div {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .dropzone [type="file"] {
            cursor: pointer;
            position: absolute;
            opacity: 0;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .dropzone img {
            cursor: pointer;
            border-radius: 10px;
            vertical-align: middle;
            max-width: 95%;
            max-height: 95%;
          }
        `}
        </style>
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
              <div className="dropzone">
                {service.image === '' && <div>Imagen principal</div>}
                <input type="file" name="file1" id="file1" accept="image/*" onChange={(e) => onChangeFile('picture', e)} />
                {service.image !== '' && <div><img src={service.image} onClick={() => document.getElementById('file1').click()} /></div>}
              </div>

              <TextField
                id="title"
                label="Título"
                variant="outlined"
                required
                error={(service.nombre === '') ? true : false}
                value={service.nombre}
                onChange={(event) => setService({ ...service, nombre: event.target.value })}
              />

              <TextField
                id="city"
                select
                label="Ciudad"
                value={service.ciudad_id}
                error={(service.ciudad_id === '') ? true : false}
                onChange={(event) => setService({ ...service, ciudad_id: event.target.value })}
              >
                {data.ciudades.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.nombre}</MenuItem>
                ))}
              </TextField>
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
                id="description"
                multiline
                label="Descripción"
                required
                rows={4}
                error={(service.descripcion === '') ? true : false}
                variant="outlined"
                value={service.descripcion}
                onChange={(event) => setService({ ...service, descripcion: event.target.value })}
              />
              <TextField
                id="type"
                select
                label="Tipo de Servicio"
                value={service.tipo_servicio_id}
                error={(service.tipo_servicio_id === '') ? true : false}
                onChange={(event) => setService({ ...service, tipo_servicio_id: event.target.value })}
              >
                {data.tipos_servicios.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.nombre}</MenuItem>
                ))}
              </TextField>

              <TextField
                id="address"
                label="Dirección"
                required
                error={(service.direccion === '') ? true : false}
                variant="outlined"
                value={service.direccion}
                onChange={(event) => setService({ ...service, direccion: event.target.value })}
              />

              <TextField
                id="phone"
                label="Teléfono"
                type="number"
                required
                error={(service.telefono === '') ? true : false}
                variant="outlined"
                value={service.telefono}
                onChange={(event) => setService({ ...service, telefono: event.target.value })}
              />

              <TextField
                id="link"
                label="Página web"
                required
                error={(service.url === '') ? true : false}
                variant="outlined"
                value={service.url}
                onChange={(event) => setService({ ...service, url: event.target.value })}
              />

            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <LoadingButton loading={loading} fullWidth size="large" onClick={createService} variant="contained">Guardar</LoadingButton>
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

  const res = await axios.get(`${API_URL}/form-update-service/${context.query.id}`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}