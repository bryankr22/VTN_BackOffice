import { useState, SyntheticEvent } from 'react';
import { Button, Box, Tabs, Tab, CircularProgress, Backdrop, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Vehicles({ data }) {
  const [configs, setConfigs] = useState({
    correo_financiacion: data.configuraciones.correo_financiacion,
    correo_contacto: data.configuraciones.correo_contacto,
    telefono_contacto: data.configuraciones.telefono_contacto,
    link_video: data.configuraciones.link_video,
    tyc: data.configuraciones.tyc,
  });
  const [rows, setRows] = useState(data.marcas);
  const [perPage, setPerPage] = useState(20);
  const [rowsModels, setRowsModels] = useState(data.modelos);
  const [perPageModels, setPerPageModels] = useState(20);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleChange = (event: SyntheticEvent, newValue: number) => setValue(newValue);

  const columnsGeneral: GridColDef[] = [
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 250,
    },
    {
      field: 'nombrePadre',
      headerName: 'Categoría',
      width: 300,

    },
    {
      field: "Acciones",
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                location.href = `/vehicles/${cellValues.row.id}`;
              }}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                console.log(cellValues.row.id);
              }}
            >
              Eliminar
            </Button>
          </>
        );
      },
      width: 250,
    }
  ];

  return (
    <AdminLayout>
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Marcas de vehículos" {...a11yProps(1)} />
            <Tab label="Modelos por marca" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
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
                  id="correo_financiacion"
                  label="Correo de envío de información de financiación"
                  variant="outlined"
                  required
                  error={(configs.correo_financiacion === '') ? true : false}
                  value={configs.correo_financiacion}
                  onChange={(event) => setConfigs({ ...configs, correo_financiacion: event.target.value })}
                />

                <TextField
                  id="telefono_contacto"
                  label="Teléfono WhatsApp"
                  required
                  error={(configs.telefono_contacto === '') ? true : false}
                  variant="outlined"
                  value={configs.telefono_contacto}
                  onChange={(event) => setConfigs({ ...configs, telefono_contacto: event.target.value })}
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
                  id="link"
                  label="Correo de envío de información de contacto"
                  required
                  error={(configs.correo_contacto === '') ? true : false}
                  variant="outlined"
                  value={configs.correo_contacto}
                  onChange={(event) => setConfigs({ ...configs, correo_contacto: event.target.value })}
                />

                <TextField
                  id="link_video"
                  label="Link video"
                  required
                  error={(configs.link_video === '') ? true : false}
                  variant="outlined"
                  value={configs.link_video}
                  onChange={(event) => setConfigs({ ...configs, link_video: event.target.value })}
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
                <TextField
                  id="tyc"
                  multiline
                  label="Terminos y condiciones"
                  required
                  rows={5}
                  error={(configs.tyc === '') ? true : false}
                  variant="outlined"
                  value={configs.tyc}
                  onChange={(event) => setConfigs({ ...configs, tyc: event.target.value })}
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
                <LoadingButton loading={loading} fullWidth size="large" onClick={() => { }} variant="contained">Guardar</LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{ height: 500, width: '100%', marginTop: 20 }}>
            <DataGrid
              rows={rows}
              columns={columnsGeneral}
              pageSize={perPage}
              rowsPerPageOptions={[20, 50, 100]}
              onPageSizeChange={(pageSize: number) => setPerPage(pageSize)}
              disableSelectionOnClick
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{ height: 500, width: '100%', marginTop: 20 }}>
            <DataGrid
              rows={rowsModels}
              columns={columnsGeneral}
              pageSize={perPageModels}
              rowsPerPageOptions={[20, 50, 100]}
              onPageSizeChange={(pageSize: number) => setPerPageModels(pageSize)}
              disableSelectionOnClick
            />
          </div>
        </TabPanel>

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
  const res = await axios.get(`${API_URL}/configs`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}