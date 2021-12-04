import { useState, SyntheticEvent } from 'react';
import { Button, Checkbox, Box, Tabs, Tab, CircularProgress, Backdrop, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, S3_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


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
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const [rows, setRows] = useState(data.vehicles);
  const [perPage, setPerPage] = useState(20);

  const [rowsApprove, setRowsApprove] = useState(data.vehiclesApprove);
  const [perPageApprove, setPerPageApprove] = useState(20);

  const [rowsPromotional, setRowsPromotional] = useState(data.vehiclesPromotional);
  const [perPagePromotional, setPerPagePromotional] = useState(20);

  const [value, setValue] = useState(0);

  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState<PropsSnackBar>({
    open: false,
    type: 'success',
    message: ''
  });

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => setSnackBar({
    open: false,
    type: 'success',
    message: ''
  });

  const dependable = async (id) => {
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.put(`${API_URL}/dependable-vehicle`, { id }, config);
    return res.data.dependable;
  }

  const approve = async (id, approve) => {
    if (window.confirm(`Estas seguro de ${approve ? 'aprobar' : 'rechazar'} este vehículo?`)) {
      setLoading(true);
      const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
      const res = await axios.post(`${API_URL}/approve-vehicle`, { id, approve }, config);
      setSnackBar({
        open: true,
        type: res.data.status ? 'success' : 'error',
        message: res.data.message
      });
      if (res.data.status) {
        setRows(res.data.vehicles);
        setRowsApprove(res.data.vehiclesApprove);
        setRowsPromotional(res.data.vehiclesPromotional);
      }
      setLoading(false);
    }
  }

  const approve_promotion = async (id, approve) => {
    if (window.confirm(`Estas seguro de ${approve ? 'aprobar' : 'rechazar'} esta promoción?`)) {
      setLoading(true);
      const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
      const res = await axios.post(`${API_URL}/approve-promotion-vehicle`, { id, approve }, config);
      setSnackBar({
        open: true,
        type: res.data.status ? 'success' : 'error',
        message: res.data.message
      });
      if (res.data.status) {
        setRows(res.data.vehicles);
        setRowsApprove(res.data.vehiclesApprove);
        setRowsPromotional(res.data.vehiclesPromotional);
      }
      setLoading(false);
    }
  }

  const delete_vehicle = async (id) => {
    if (window.confirm("Estas seguro de eliminar este vehículo?")) {
      setLoading(true);
      const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
      const res = await axios.post(`${API_URL}/remove-vehicle-admin`, { id }, config);
      setSnackBar({
        open: true,
        type: res.data.status ? 'success' : 'error',
        message: res.data.message
      });
      if (res.data.status) {
        setRows(res.data.vehicles);
        setRowsApprove(res.data.vehiclesApprove);
        setRowsPromotional(res.data.vehiclesPromotional);
      }
      setLoading(false);
    }
  }

  const columnsGeneral: GridColDef[] = [
    {
      field: 'Imagen',
      renderCell: (cellValues) => {
        return (
          <img
            src={`${S3_URL}/vehiculos/${cellValues.row.nameImage}.webp?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${S3_URL}/vehiculos/${cellValues.row.nameImage}.webp?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={cellValues.row.title}
            width={150}
            height={150}
            loading="lazy"
          />
        );
      },
      width: 200,
    },
    {
      field: 'title',
      headerName: 'Nombre',
      width: 250,
    },
    {
      field: 'precio',
      headerName: 'Precio',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => `$ ${new Intl.NumberFormat("de-DE").format(params.row.precio)}`,

    },
    {
      field: 'confiable',
      headerName: 'Confiable',
      renderCell: (cellValues) => {
        return (
          <Checkbox
            checked={(cellValues.row.confiable) ? true : false}
            onChange={async () => {
              setLoading(true);
              const dependableVehicle = await dependable(cellValues.row.id);
              cellValues.row.confiable = dependableVehicle;
              document.getElementById("simple-tabpanel-0").click()
              setLoading(false);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        );
      },
      width: 100,
    }
  ];

  const columns: GridColDef[] = [
    ...columnsGeneral,
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
              onClick={() => delete_vehicle(cellValues.row.id)}
            >
              Eliminar
            </Button>
          </>
        );
      },
      width: 200,
    }
  ];

  const columnsApprove: GridColDef[] = [
    ...columnsGeneral,
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
              color="info"
              style={{ marginRight: 10 }}
              onClick={() => approve(cellValues.row.id, true)}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => approve(cellValues.row.id, false)}
            >
              Rechazar
            </Button>
          </>
        );
      },
      width: 300,
    }
  ];

  const columnsPromotional: GridColDef[] = [
    ...columnsGeneral,
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
              color="info"
              style={{ marginRight: 10 }}
              onClick={() => approve_promotion(cellValues.row.id, true)}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => approve_promotion(cellValues.row.id, false)}
            >
              Rechazar
            </Button>
          </>
        );
      },
      width: 300,
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
        <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackBar.type} sx={{ width: '100%' }}>
            {snackBar.message}
          </Alert>
        </Snackbar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Vehículos" {...a11yProps(0)} />
            <Tab label="Pendiente por aprobar" {...a11yProps(1)} />
            <Tab label="Promociones" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div style={{ height: 500, width: '100%', marginTop: 20 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={perPage}
              rowHeight={200}
              rowsPerPageOptions={[20, 50, 100]}
              onPageSizeChange={(pageSize: number) => setPerPage(pageSize)}
              disableSelectionOnClick
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{ height: 500, width: '100%', marginTop: 20 }}>
            <DataGrid
              rows={rowsApprove}
              columns={columnsApprove}
              pageSize={perPageApprove}
              rowHeight={200}
              rowsPerPageOptions={[20, 50, 100]}
              onPageSizeChange={(pageSize: number) => setPerPageApprove(pageSize)}
              disableSelectionOnClick
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{ height: 500, width: '100%', marginTop: 20 }}>
            <DataGrid
              rows={rowsPromotional}
              columns={columnsPromotional}
              pageSize={perPagePromotional}
              rowHeight={200}
              rowsPerPageOptions={[20, 50, 100]}
              onPageSizeChange={(pageSize: number) => setPerPagePromotional(pageSize)}
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
  const res = await axios.get(`${API_URL}/vehicles`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}