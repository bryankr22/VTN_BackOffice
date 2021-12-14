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
  const [service, setService] = useState({
    picture: '',
    title: '',
    position: '',
    type: '',
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

  const onChangeFile = (picture, e) => {
    if (e.target.files[0]) {
      const objectUrl = URL.createObjectURL(e.target.files[0])
      setService({ ...service, [picture]: objectUrl });
    }
  }

  const createService = async () => {
    setLoading(true);
    if (service.picture === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen principal!' });
      setLoading(false);
      return;
    }

    let error = false;
    Object.entries(service).map((item) => {
      if (!item[1] && item[0] !== 'picture') {
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
    const res = await axios.post(`${API_URL}/create-banner`, formData, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    if (res.data.status) {
      setService({
        picture: '',
        title: '',
        position: '',
        type: '',
      });
      file1.value = null;
    }
    setLoading(false);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/cms">
      Banners
    </Link>, ,
    <Typography key="2" color="text.primary">
      Crear Banner
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
                {service.picture === '' && <div>Imagen</div>}
                <input type="file" name="file1" id="file1" accept="image/*" onChange={(e) => onChangeFile('picture', e)} />
                {service.picture !== '' && <div><img src={service.picture} onClick={() => document.getElementById('file1').click()} /></div>}
              </div>
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
                id="title"
                label="Título"
                variant="outlined"
                required
                error={(service.title === '') ? true : false}
                value={service.title}
                onChange={(event) => setService({ ...service, title: event.target.value })}
              />

              <TextField
                id="type"
                select
                label="Tipo"
                value={service.type}
                error={(service.type === '') ? true : false}
                onChange={(event) => setService({ ...service, type: event.target.value })}
              >
                <MenuItem key={1} value={1}>Desktop</MenuItem>
                <MenuItem key={2} value={2}>Mobile</MenuItem>
              </TextField>

              <TextField
                id="position"
                label="Posición"
                type="number"
                required
                error={(service.position === '') ? true : false}
                variant="outlined"
                value={service.position}
                onChange={(event) => setService({ ...service, position: event.target.value })}
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