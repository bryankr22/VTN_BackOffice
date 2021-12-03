import { useState } from 'react';
import { Box, TextField, MenuItem, Avatar, Snackbar, Alert, Link, Typography, Breadcrumbs, Stack, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


export default function CreateTechnicalSheets({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const [technicalSheets, setTechnicalSheets] = useState({
    title: '',
    description: '',
    vehicle_type_id: '',
    mark_id: '',
    model_id: '',
    fuel_id: '',
    fuel_type: '',
    transmission_id: '',
    price: '',
    year: '',
    engine: '',
    power: '',
    torque: '',
    traction: '',
    autonomy: '',
    performance: '',
    security: '',
    airbags: '',
    wheels: '',
    trunk: '',
    weight: '',
    cushions: '',
    type: ''
  });

  const [pictures, setPictures] = useState({
    picture1: '',
    picture2: '',
    picture3: '',
    picture4: '',
    picture5: '',
    picture6: '',
    picture7: '',
    picture8: '',
    picture9: '',
    picture10: '',
  });

  const [loading, setLoading] = useState(false);
  const [optionsModels, setOptionsModels] = useState([]);
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

  const createTechnicalSheets = async () => {
    setLoading(true);
    if (pictures.picture1 === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen principal!' });
      setLoading(false);
      return;
    }

    let error = false;
    Object.entries(technicalSheets).map((item) => {
      if (!item[1]) {
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
    const file2: any = document.getElementById('file2');
    const file3: any = document.getElementById('file3');
    const file4: any = document.getElementById('file4');
    const file5: any = document.getElementById('file5');
    const file6: any = document.getElementById('file6');
    const file7: any = document.getElementById('file7');
    const file8: any = document.getElementById('file8');
    const file9: any = document.getElementById('file9');
    const file10: any = document.getElementById('file10');


    Object.entries(technicalSheets).map((item) => {
      formData.append(item[0], item[1]);
    });
    formData.append('image1', file1.files[0]);
    formData.append('image2', file2.files[0]);
    formData.append('image3', file3.files[0]);
    formData.append('image4', file4.files[0]);
    formData.append('image5', file5.files[0]);
    formData.append('image6', file6.files[0]);
    formData.append('image7', file7.files[0]);
    formData.append('image8', file8.files[0]);
    formData.append('image9', file9.files[0]);
    formData.append('image10', file10.files[0]);

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookie}`
      }
    };
    const res = await axios.post(`${API_URL}/create-technical-sheets`, formData, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    if (res.data.status) {
      setTechnicalSheets({
        title: '',
        description: '',
        vehicle_type_id: '',
        mark_id: '',
        model_id: '',
        fuel_id: '',
        fuel_type: '',
        transmission_id: '',
        price: '',
        year: '',
        engine: '',
        power: '',
        torque: '',
        traction: '',
        autonomy: '',
        performance: '',
        security: '',
        airbags: '',
        wheels: '',
        trunk: '',
        weight: '',
        cushions: '',
        type: ''
      });
      setPictures({
        picture1: '',
        picture2: '',
        picture3: '',
        picture4: '',
        picture5: '',
        picture6: '',
        picture7: '',
        picture8: '',
        picture9: '',
        picture10: '',
      });
      file1.value = null;
      file2.value = null;
      file3.value = null;
      file4.value = null;
      file5.value = null;
      file6.value = null;
      file7.value = null;
      file8.value = null;
      file9.value = null;
      file10.value = null;
    }
    setLoading(false);
  }

  const onChangeFile = (picture, e) => {
    if (e.target.files[0]) {
      const objectUrl = URL.createObjectURL(e.target.files[0])
      setPictures({ ...pictures, [picture]: objectUrl });
    }

  }

  const changeMark = (value) => {
    setTechnicalSheets({ ...technicalSheets, mark_id: value, model_id: (value !== technicalSheets.mark_id) ? '' : technicalSheets.model_id });
    const newOptions = data.modelos.filter((obj) => obj.marca_id === value);
    setOptionsModels(newOptions);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/technical-sheets">
      Fichas Técnicas
    </Link>, ,
    <Typography key="2" color="text.primary">
      Crear Ficha Técnica
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

        <Grid container spacing={2} style={{ marginTop: 15 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <div className="dropzone">
                  {pictures.picture1 === '' && <div>Imagen principal</div>}
                  <input type="file" name="file1" id="file1" accept="image/*" onChange={(e) => onChangeFile('picture1', e)} />
                  {pictures.picture1 !== '' && <div><img src={pictures.picture1} onClick={() => document.getElementById('file1').click()} /></div>}
                </div>
                <div className="dropzone">
                  {pictures.picture5 === '' && <div>5</div>}
                  <input type="file" name="file5" id="file5" accept="image/*" onChange={(e) => onChangeFile('picture5', e)} />
                  {pictures.picture5 !== '' && <div><img src={pictures.picture5} onClick={() => document.getElementById('file5').click()} /></div>}
                </div>
                <div className="dropzone">
                  {pictures.picture9 === '' && <div>9</div>}
                  <input type="file" name="file9" id="file9" accept="image/*" onChange={(e) => onChangeFile('picture9', e)} />
                  {pictures.picture9 !== '' && <div><img src={pictures.picture9} onClick={() => document.getElementById('file9').click()} /></div>}
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <div className="dropzone">
                  {pictures.picture2 === '' && <div>2</div>}
                  <input type="file" name="file2" id="file2" accept="image/*" onChange={(e) => onChangeFile('picture2', e)} />
                  {pictures.picture2 !== '' && <div><img src={pictures.picture2} onClick={() => document.getElementById('file2').click()} /></div>}
                </div>
                <div className="dropzone">
                  {pictures.picture6 === '' && <div>6</div>}
                  <input type="file" name="file6" id="file6" accept="image/*" onChange={(e) => onChangeFile('picture6', e)} />
                  {pictures.picture6 !== '' && <div><img src={pictures.picture6} onClick={() => document.getElementById('file6').click()} /></div>}
                </div>
                <div className="dropzone">
                  {pictures.picture10 === '' && <div>10</div>}
                  <input type="file" name="file10" id="file10" accept="image/*" onChange={(e) => onChangeFile('picture10', e)} />
                  {pictures.picture10 !== '' && <div><img src={pictures.picture10} onClick={() => document.getElementById('file10').click()} /></div>}
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <div className="dropzone">
                  {pictures.picture3 === '' && <div>3</div>}
                  <input type="file" name="file3" id="file3" accept="image/*" onChange={(e) => onChangeFile('picture3', e)} />
                  {pictures.picture3 !== '' && <div><img src={pictures.picture3} onClick={() => document.getElementById('file3').click()} /></div>}
                </div>
                <div className="dropzone">
                  {pictures.picture7 === '' && <div>7</div>}
                  <input type="file" name="file7" id="file7" accept="image/*" onChange={(e) => onChangeFile('picture7', e)} />
                  {pictures.picture7 !== '' && <div><img src={pictures.picture7} onClick={() => document.getElementById('file7').click()} /></div>}
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <div className="dropzone">
                  {pictures.picture4 === '' && <div>4</div>}
                  <input type="file" name="file4" id="file4" accept="image/*" onChange={(e) => onChangeFile('picture4', e)} />
                  {pictures.picture4 !== '' && <div><img src={pictures.picture4} onClick={() => document.getElementById('file4').click()} /></div>}
                </div>
                <div className="dropzone">
                  {pictures.picture8 === '' && <div>8</div>}
                  <input type="file" name="file8" id="file8" accept="image/*" onChange={(e) => onChangeFile('picture8', e)} />
                  {pictures.picture8 !== '' && <div><img src={pictures.picture8} onClick={() => document.getElementById('file8').click()} /></div>}
                </div>
              </Box>
            </Grid>
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
                error={(technicalSheets.title === '') ? true : false}
                value={technicalSheets.title}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, title: event.target.value })}
              />
              <TextField
                id="description"
                multiline
                label="Descripción"
                required
                rows={4}
                error={(technicalSheets.description === '') ? true : false}
                variant="outlined"
                value={technicalSheets.description}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, description: event.target.value })}
              />
              <TextField
                id="gender"
                select
                label="Tipo de Vehículo"
                value={technicalSheets.type}
                error={(technicalSheets.type === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, type: event.target.value })}
              >
                <MenuItem key="Carro" value="Carro">Carro</MenuItem>
                <MenuItem key="Camioneta" value="Camioneta">Camioneta</MenuItem>
                <MenuItem key="SUV" value="SUV">SUV</MenuItem>
                <MenuItem key="Deportivo" value="Deportivo">Deportivo</MenuItem>
                <MenuItem key="Convertible" value="Convertible">Convertible</MenuItem>
                <MenuItem key="Pick-Up" value="Pick-Up">Pick-Up</MenuItem>
              </TextField>

              <TextField
                id="gender"
                select
                label="Categoría"
                value={technicalSheets.vehicle_type_id}
                error={(technicalSheets.vehicle_type_id === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, vehicle_type_id: event.target.value })}
              >
                {data.categories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="gender"
                select
                label="Marcas"
                required
                value={technicalSheets.mark_id}
                error={(technicalSheets.mark_id === '') ? true : false}
                onChange={(event) => changeMark(event.target.value)}
              >
                {data.marcas.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="gender"
                select
                label="Modelo"
                required
                value={technicalSheets.model_id}
                error={(technicalSheets.model_id === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, model_id: event.target.value })}
              >
                {optionsModels.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="year"
                label="Año"
                required
                error={(technicalSheets.year === '') ? true : false}
                variant="outlined"
                value={technicalSheets.year}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, year: event.target.value })}
              />

              <TextField
                id="price"
                label="Precio"
                required
                error={(technicalSheets.price === '') ? true : false}
                variant="outlined"
                value={technicalSheets.price}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, price: event.target.value })}
              />

              <TextField
                id="engine"
                label="Motor (CC)"
                required
                error={(technicalSheets.engine === '') ? true : false}
                variant="outlined"
                value={technicalSheets.engine}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, engine: event.target.value })}
              />

              <TextField
                id="power"
                label="Potencia (HP)"
                required
                error={(technicalSheets.power === '') ? true : false}
                variant="outlined"
                value={technicalSheets.power}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, power: event.target.value })}
              />

              <TextField
                id="torque"
                label="Torque (NM)"
                required
                error={(technicalSheets.torque === '') ? true : false}
                variant="outlined"
                value={technicalSheets.torque}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, torque: event.target.value })}
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
                id="fuel"
                select
                label="Combustible"
                value={technicalSheets.fuel_id}
                error={(technicalSheets.fuel_id === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, fuel_id: event.target.value })}
              >
                {data.combustibles.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="fuel_type"
                select
                label="Tipo de gasolina"
                value={technicalSheets.fuel_type}
                error={(technicalSheets.fuel_type === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, fuel_type: event.target.value })}
              >
                <MenuItem key="Extra" value="Extra">Extra</MenuItem>
                <MenuItem key="Corriente" value="Corriente">Corriente</MenuItem>
                <MenuItem key="Diesel" value="Diesel">Diesel</MenuItem>
                <MenuItem key="Energía" value="Energía">Energía</MenuItem>
                <MenuItem key="N/A" value="N/A">N/A</MenuItem>
              </TextField>

              <TextField
                id="transmission"
                select
                label="Transmisión"
                value={technicalSheets.transmission_id}
                error={(technicalSheets.transmission_id === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, transmission_id: event.target.value })}
              >
                {data.transmisiones.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="autonomy"
                label="Autonomía (Km)"
                type="number"
                required
                error={(technicalSheets.autonomy === '') ? true : false}
                variant="outlined"
                value={technicalSheets.autonomy}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, autonomy: event.target.value })}
              />

              <TextField
                id="performance"
                label="Rendimiento (Km/g)"
                type="number"
                required
                error={(technicalSheets.performance === '') ? true : false}
                variant="outlined"
                value={technicalSheets.performance}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, performance: event.target.value })}
              />

              <TextField
                id="security"
                label="Seguridad en estrellas(Max. 5)"
                type="number"
                required
                error={(technicalSheets.security === '') ? true : false}
                variant="outlined"
                value={technicalSheets.security}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, security: event.target.value })}
              />

              <TextField
                id="airbags"
                label="Número de AirBags"
                type="number"
                required
                error={(technicalSheets.airbags === '') ? true : false}
                variant="outlined"
                value={technicalSheets.airbags}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, airbags: event.target.value })}
              />

              <TextField
                id="wheels"
                label="Rines"
                type="number"
                required
                error={(technicalSheets.wheels === '') ? true : false}
                variant="outlined"
                value={technicalSheets.wheels}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, wheels: event.target.value })}
              />

              <TextField
                id="cushions"
                select
                label="Cojineria"
                value={technicalSheets.cushions}
                error={(technicalSheets.cushions === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, cushions: event.target.value })}
              >
                <MenuItem key="Cuero" value="Cuero">Cuero</MenuItem>
                <MenuItem key="Tela" value="Tela">Tela</MenuItem>
                <MenuItem key="Mixta" value="Mixta">Mixta</MenuItem>
              </TextField>

              <TextField
                id="trunk"
                label="Capacidad del baúl (L)"
                type="number"
                required
                error={(technicalSheets.trunk === '') ? true : false}
                variant="outlined"
                value={technicalSheets.trunk}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, trunk: event.target.value })}
              />

              <TextField
                id="traction"
                select
                label="Tracción"
                value={technicalSheets.traction}
                error={(technicalSheets.traction === '') ? true : false}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, traction: event.target.value })}
              >
                <MenuItem key="4x2 Delantera" value="4x2 Delantera">4x2 Delantera</MenuItem>
                <MenuItem key="4x2 Trasera" value="4x2 Trasera">4x2 Trasera</MenuItem>
                <MenuItem key="4x4" value="4x4">4x4</MenuItem>
                <MenuItem key="AWD" value="AWD">AWD</MenuItem>
              </TextField>

              <TextField
                id="weight"
                label="Peso(Kg)"
                type="number"
                required
                error={(technicalSheets.weight === '') ? true : false}
                variant="outlined"
                value={technicalSheets.weight}
                onChange={(event) => setTechnicalSheets({ ...technicalSheets, weight: event.target.value })}
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
  const res = await axios.get(`${API_URL}/form-technical-sheets`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}