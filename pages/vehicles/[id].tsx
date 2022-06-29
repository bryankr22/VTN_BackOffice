import { useState } from 'react';
import { Box, TextField, MenuItem, Snackbar, Alert, Link, Typography, Breadcrumbs, Stack, Grid, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, FILES_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


export default function UpdatedVehicle({ data, marks, models, cities }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const [vehicle, setVehicle] = useState(data.vehiculo);

  const [pictures, setPictures] = useState({
    picture1: data.imagenes.find((obj) => obj.order === 1).url,
    picture2: data.imagenes.find((obj) => obj.order === 2).url,
    picture3: data.imagenes.find((obj) => obj.order === 3).url,
    picture4: data.imagenes.find((obj) => obj.order === 4).url,
    picture5: data.imagenes.find((obj) => obj.order === 5).url,
    picture6: data.imagenes.find((obj) => obj.order === 6).url,
    picture7: data.imagenes.find((obj) => obj.order === 7).url,
    picture8: data.imagenes.find((obj) => obj.order === 8).url,
    picture9: data.imagenes.find((obj) => obj.order === 9).url,
    picture10: data.imagenes.find((obj) => obj.order === 10).url,
  });

  const [loading, setLoading] = useState(false);
  const [optionsMarks, setOptionsMarks] = useState(marks);
  const [optionsModels, setOptionsModels] = useState(models);
  const [optionsCities, setOptionsCities] = useState(cities);
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

  const updatedVehicle = async () => {
    setLoading(true);
    if (pictures.picture1 === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen principal!' });
      setLoading(false);
      return;
    }


    let error = false;
    Object.entries(vehicle).map((item) => {
      if (item[1] === '' && item[0] !== 'url' && item[0] !== 'placa' && item[0] !== 'peritaje') {
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
    const peritaje: any = document.getElementById('peritaje');


    Object.entries(vehicle).map((item) => {
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
    formData.append('peritaje', peritaje.files[0]);

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookie}`
      }
    };
    const res = await axios.post(`${API_URL}/updated-vehicle`, formData, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    if (res.data.status) {
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
    setVehicle({ ...vehicle, marcaId: value, modelo_id: (value !== vehicle.marcaId) ? '' : vehicle.modelo_id });
    const newOptions = data.modelos.filter((obj) => obj.marca_id === value);
    setOptionsModels(newOptions);
  }

  const changeCategory = (value) => {
    setVehicle({ 
      ...vehicle, 
      tipo_vehiculo: value, 
      marcaId: (value !== vehicle.tipo_vehiculo) ? '' : vehicle.marcaId,
      modelo_id: (value !== vehicle.tipo_vehiculo) ? '' : vehicle.modelo_id 
    });
    const newOptions = data.marcas.filter((obj) => obj.categoria_id === value);
    setOptionsMarks(newOptions);
  }

  const changeState = (value) => {
    setVehicle({ ...vehicle, departamento: value, ciudad_id: (value !== vehicle.departamento) ? '' : vehicle.ciudad_id });
    const newOptions = data.ciudades.filter((obj) => obj.id_departamento === value);
    setOptionsCities(newOptions);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/vehicles">
      Vehículos
    </Link>, ,
    <Typography key="2" color="text.primary">
      {vehicle.title}
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
            width: 100%;
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
                error={(vehicle.title === '') ? true : false}
                value={vehicle.title}
                onChange={(event) => setVehicle({ ...vehicle, title: event.target.value })}
              />
              <TextField
                id="description"
                multiline
                label="Descripción"
                required
                rows={4}
                error={(vehicle.descripcion === '') ? true : false}
                variant="outlined"
                value={vehicle.descripcion}
                onChange={(event) => setVehicle({ ...vehicle, descripcion: event.target.value })}
              />
              <TextField
                id="category"
                select
                label="Categoría"
                value={vehicle.tipo_vehiculo}
                error={(vehicle.tipo_vehiculo === '') ? true : false}
                onChange={(event) => changeCategory(event.target.value)}
              >
                {data.categories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              {vehicle.tipo_vehiculo === 5 &&
                <TextField
                  id="estilo"
                  select
                  label="Estilo"
                  value={vehicle.tipo_moto}
                  error={(vehicle.tipo_moto === '') ? true : false}
                  onChange={(event) => setVehicle({ ...vehicle, tipo_moto: event.target.value })}
                >
                  {data.tipoMoto.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              }
              <TextField
                id="marcas"
                select
                label="Marcas"
                required
                value={vehicle.marcaId}
                error={(vehicle.marcaId === '') ? true : false}
                onChange={(event) => changeMark(event.target.value)}
              >
                {optionsMarks.map((option) => (
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
                value={vehicle.modelo_id}
                error={(vehicle.modelo_id === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, modelo_id: event.target.value })}
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
                type="number"
                error={(vehicle.ano === '') ? true : false}
                variant="outlined"
                value={vehicle.ano}
                onChange={(event) => setVehicle({ ...vehicle, ano: event.target.value })}
              />

              <TextField
                id="Condicion"
                select
                label="Condición"
                required
                value={vehicle.condicion}
                error={(vehicle.condicion === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, condicion: event.target.value })}
              >
                <MenuItem key="Nuevo" value="Nuevo">
                  Nuevo
                </MenuItem>
                <MenuItem key="Usado" value="Usado">
                  Usado
                </MenuItem>
              </TextField>

              {vehicle.condicion === 'Usado' &&
                <TextField
                  id="placa"
                  label="Placa"
                  required
                  error={(vehicle.condicion === 'Usado' && vehicle.placa === '') ? true : false}
                  variant="outlined"
                  value={vehicle.placa}
                  onChange={(event) => setVehicle({ ...vehicle, placa: event.target.value })}
                />
              }
              

              <TextField
                id="type_price"
                select
                label="Tipo de precio"
                required
                value={vehicle.tipo_precio}
                error={(vehicle.tipo_precio === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, tipo_precio: event.target.value })}
              >
                {data.tipoPrecio.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="price"
                label="Precio"
                required
                type="number"
                error={(vehicle.precio === '') ? true : false}
                variant="outlined"
                value={vehicle.precio}
                onChange={(event) => setVehicle({ ...vehicle, precio: event.target.value })}
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
              <FormGroup aria-label="position" row>
                <FormControlLabel checked={vehicle.promocion} onChange={(event) => setVehicle({ ...vehicle, promocion: (event.target.checked) ? 1 : 0 })} control={<Checkbox />} label="Promoción" />
                <FormControlLabel checked={vehicle.permuta} onChange={(event) => setVehicle({ ...vehicle, permuta: (event.target.checked) ? 1 : 0 })} control={<Checkbox />} label="Permuta" />
                <FormControlLabel checked={vehicle.financiacion} onChange={(event) => setVehicle({ ...vehicle, financiacion: (event.target.checked) ? 1 : 0 })} control={<Checkbox />} label="Financiación" />
              </FormGroup>
              <TextField
                id="contacto"
                label="Contacto"
                required
                error={(vehicle.contacto === '') ? true : false}
                variant="outlined"
                value={vehicle.contacto}
                onChange={(event) => setVehicle({ ...vehicle, contacto: event.target.value })}
              />

              <TextField
                id="km"
                label="Kilometraje"
                required
                type="number"
                error={(vehicle.kilometraje === '') ? true : false}
                variant="outlined"
                value={vehicle.kilometraje}
                onChange={(event) => setVehicle({ ...vehicle, kilometraje: event.target.value })}
              />

              <TextField
                id="cilindraje"
                label="Cilindraje"
                required
                type="number"
                error={(vehicle.cilindraje === '') ? true : false}
                variant="outlined"
                value={vehicle.cilindraje}
                onChange={(event) => setVehicle({ ...vehicle, cilindraje: event.target.value })}
              />
              <TextField
                id="fuel"
                select
                label="Combustible"
                value={vehicle.combustible}
                error={(vehicle.combustible === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, combustible: event.target.value })}
              >
                {data.combustibles.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="transmission"
                select
                label="Transmisión"
                value={vehicle.transmision}
                error={(vehicle.transmision === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, transmision: event.target.value })}
              >
                {data.transmisiones.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="color"
                select
                label="Color"
                value={vehicle.color}
                error={(vehicle.color === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, color: event.target.value })}
              >
                {data.colores.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                id="blindado"
                select
                label="Blindado"
                value={vehicle.blindado}
                error={(vehicle.blindado === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, blindado: event.target.value })}
              >
                <MenuItem key={0} value={0}>
                  NO
                </MenuItem>
                <MenuItem key={1} value={1}>
                  SI
                </MenuItem>
              </TextField>

              <TextField
                id="peritaje"
                label="Peritaje"
                type="file"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {vehicle.peritaje && vehicle.peritaje !== "0" &&
                <Link href={`${FILES_URL}/pdf/peritaje/${vehicle.peritaje}`} target="_blank" underline="hover">
                  Ver peritaje
                </Link>
              }

              <TextField
                id="departamento"
                select
                label="Departamento"
                style={{ marginTop: vehicle.peritaje ? 15 : 8 }}
                value={vehicle.departamento}
                error={(vehicle.departamento === '') ? true : false}
                onChange={(event) => changeState(event.target.value)}
              >
                {data.departamentos.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="ciudad"
                select
                label="Ciudad"
                value={vehicle.ciudad_id}
                error={(vehicle.ciudad_id === '') ? true : false}
                onChange={(event) => setVehicle({ ...vehicle, ciudad_id: event.target.value })}
              >
                {optionsCities.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </TextField>

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
              <LoadingButton loading={loading} fullWidth size="large" onClick={updatedVehicle} variant="contained">Guardar</LoadingButton>
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
  const res = await axios.get(`${API_URL}/form-updated-vehicle/${context.query.id}`, config);
  const data = await res.data;
  const marks = data.marcas.filter((obj) => obj.categoria_id === data.vehiculo.tipo_vehiculo);
  const models = data.modelos.filter((obj) => obj.marca_id === data.vehiculo.marcaId);
  const cities = data.ciudades.filter((obj) => obj.id_departamento === data.vehiculo.departamento);
  return {
    props: {
      data,
      marks,
      models,
      cities
    },
  }
}