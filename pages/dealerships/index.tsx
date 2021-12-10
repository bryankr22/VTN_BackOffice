import { useState } from 'react';
import { Typography, Button, Backdrop, CircularProgress, Snackbar, Alert, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';

export default function Dealerships({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }

  const [cookies] = useCookies(["admin_token"]);
  const [rows, setRows] = useState(data.dealerships);
  const [rowId, setRowId] = useState();
  const [perPage, setPerPage] = useState(20);
  const [openAlert, setOpenAlert] = useState(false);
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
  const deleteDealerships = async (id) => {
    setLoading(true);
    setOpenAlert(false);
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.post(`${API_URL}/delete-dealerships`, { id }, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    setRows(res.data.dealerships);
    setLoading(false);
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', width: 200 },
    {
      field: 'address',
      headerName: 'Dirección',
      width: 200,
    },
    {
      field: 'phone',
      headerName: 'Teléfono',
      width: 200,
    },
    {
      field: 'type',
      headerName: 'Tipo',
      width: 150,
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
                location.href = `/dealerships/${cellValues.row.id}`;
              }}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setRowId(cellValues.row.id);
                setOpenAlert(true);
              }}
            >
              Eliminar
            </Button>
          </>
        );
      },
      width: 200,
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
        <Dialog
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            ATENCIÓN
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Esta seguro de eliminar este registro?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAlert(false)}>Cancelar</Button>
            <Button onClick={() => deleteDealerships(rowId)} autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Typography>
          Concesionarios
          <Button
            variant="contained"
            color="info"
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 30
            }}
            onClick={() => location.href = `/dealerships/create`}
          >
            Crear Concesionario
          </Button>
        </Typography>
        <div style={{ height: 500, width: '100%', marginTop: 20 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={perPage}
            rowsPerPageOptions={[20, 50, 100]}
            onPageSizeChange={(pageSize: number) => setPerPage(pageSize)}
            disableSelectionOnClick
          />
        </div>
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
  const res = await axios.get(`${API_URL}/dealerships`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}