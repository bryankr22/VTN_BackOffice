import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  OutlinedInput,
  Snackbar,
  Alert,
  Link,
  Typography,
  Breadcrumbs,
  Stack,
  Grid,
  Checkbox,
  ListItemText,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


export default function CreateDealerships({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const [cookies] = useCookies(["admin_token"]);
  const [dealerships, setDealerships] = useState({...data.dealerships, marks: data.dealerships_brands});
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
      setDealerships({ ...dealerships, image: objectUrl });
    }

  }

  const createTechnicalSheets = async () => {
    setLoading(true);
    if (dealerships.image === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen principal!' });
      setLoading(false);
      return;
    }

    let error = false;
    Object.entries(dealerships).map((item) => {
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
    Object.entries(dealerships).map((item) => {
      if (item[0] !== 'image') {
        // eslint-disable-next-line no-console
        formData.append(item[0], item[1]);
      }
    });
    formData.append('image1', file1.files[0]);

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.post(`${API_URL}/update-dealerships`, formData, config);
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
    <Link underline="hover" key="1" color="inherit" href="/dealerships">
      Concesionarios
    </Link>,
    <Typography key="2" color="text.primary">
      {dealerships.name}
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
                {dealerships.image === '' && <div>Imagen principal</div>}
                <input type="file" name="file1" id="file1" accept="image/*" onChange={(e) => onChangeFile('picture', e)} />
                {dealerships.image !== '' && <div><img src={dealerships.image} onClick={() => document.getElementById('file1').click()} /></div>}
              </div>

              <TextField
                id="title"
                label="Título"
                variant="outlined"
                required
                error={(dealerships.name === '') ? true : false}
                value={dealerships.name}
                onChange={(event) => setDealerships({ ...dealerships, name: event.target.value })}
              />
              <TextField
                id="type"
                select
                label="Tipo de Servicio"
                value={dealerships.type_vehicle}
                error={(dealerships.type_vehicle === '') ? true : false}
                onChange={(event) => setDealerships({ ...dealerships, type_vehicle: event.target.value })}
              >
                <MenuItem key="1" value="1">Nuevos</MenuItem>
                <MenuItem key="2" value="2">Usados</MenuItem>
              </TextField>

              <TextField
                id="city"
                select
                label="Ciudad"
                value={dealerships.city_id}
                error={(dealerships.city_id === '') ? true : false}
                onChange={(event) => setDealerships({ ...dealerships, city_id: event.target.value })}
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
                error={(dealerships.description === '') ? true : false}
                variant="outlined"
                value={dealerships.description}
                onChange={(event) => setDealerships({ ...dealerships, description: event.target.value })}
              />
              <TextField
                id="address"
                label="Dirección"
                required
                error={(dealerships.address === '') ? true : false}
                variant="outlined"
                value={dealerships.address}
                onChange={(event) => setDealerships({ ...dealerships, address: event.target.value })}
              />

              <TextField
                id="phone"
                label="Teléfono"
                type="number"
                required
                error={(dealerships.phone === '') ? true : false}
                variant="outlined"
                value={dealerships.phone}
                onChange={(event) => setDealerships({ ...dealerships, phone: event.target.value })}
              />

              <FormControl required>
                <InputLabel id="demo-multiple-checkbox-label" error={(dealerships.marks.length === 0) ? true : false}>Marcas</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={dealerships.marks}
                  error={(dealerships.marks.length === 0) ? true : false}
                  renderValue={(selected) => selected.join(', ')}
                  onChange={(event) => setDealerships({ ...dealerships, marks: typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value })}
                  input={<OutlinedInput label="Marcas" />}
                  MenuProps={MenuProps}
                >
                  {data.marcas.map((option) => (
                    <MenuItem key={`${option.id}-${option.nombre}`} value={option.nombre}>
                      <Checkbox checked={dealerships.marks.indexOf(option.nombre) > -1} />
                      <ListItemText primary={option.nombre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                id="lat"
                label="Latitud"
                type="number"
                required
                error={(dealerships.latitude === '') ? true : false}
                variant="outlined"
                value={dealerships.latitude}
                onChange={(event) => setDealerships({ ...dealerships, latitude: event.target.value })}
              />

              <TextField
                id="lon"
                label="Longitud"
                type="number"
                required
                error={(dealerships.longitude === '') ? true : false}
                variant="outlined"
                value={dealerships.longitude}
                onChange={(event) => setDealerships({ ...dealerships, longitude: event.target.value })}
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
              <LoadingButton loading={loading} fullWidth size="large" onClick={createTechnicalSheets} variant="contained">Guardar</LoadingButton>
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
  const res = await axios.get(`${API_URL}/form-update-dealerships/${context.query.id}`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}