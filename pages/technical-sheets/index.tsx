import { useState } from 'react';
import { Typography, Button, Checkbox, CircularProgress, Backdrop, Snackbar, Alert, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, S3_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';

export default function TechnicalSheets({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }

  const [cookies] = useCookies(["admin_token"]);
  const [rows, setRows] = useState(data.technical_sheets);
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

  const inactive = async (id) => {
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.put(`${API_URL}/active-technical-sheets`, { id }, config);
    return res.data.active;
  }

  const deleteTechnicalSheet = async (id) => {
    setLoading(true);
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.post(`${API_URL}/delete-technical-sheets`, { id }, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    setRows(res.data.technical_sheets);
    setOpenAlert(false);
    setLoading(false);
  }

  const columns: GridColDef[] = [
    {
      field: 'Imagen',
      renderCell: (cellValues) => {
        return (
          <img
            src={`${S3_URL}/ficha-tecnica/${cellValues.row.nameImage}.webp?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${S3_URL}/ficha-tecnica/${cellValues.row.nameImage}.webp?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={cellValues.row.title}
            width={150}
            height={150}
            loading="lazy"
          />
        );
      },
      width: 200,
    },
    { field: 'title', headerName: 'Nombre', width: 250 },
    {
      field: 'marcaLabel',
      headerName: 'Marca',
      width: 100,
    },
    {
      field: 'modeloLabel',
      headerName: 'Modelo',
      width: 100,
    },
    {
      field: 'active',
      headerName: 'Activo',
      renderCell: (cellValues) => {
        return (
          <Checkbox
            checked={(cellValues.row.active) ? true : false}
            onChange={async () => {
              setLoading(true);
              const activeTechnicalSheet = await inactive(cellValues.row.id);
              cellValues.row.active = activeTechnicalSheet;
              document.getElementById("technical-sheets-title").click()
              setLoading(false);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        );
      },
      width: 100,
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
                location.href = `/technical-sheets/${cellValues.row.id}`;
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
            <Button onClick={() => deleteTechnicalSheet(rowId)} autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Typography id="technical-sheets-title">
          Fichas técnicas
          <Button
            variant="contained"
            color="info"
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 30
            }}
            onClick={() => location.href = `/technical-sheets/create`}
          >
            Crear Ficha técnica
          </Button>
        </Typography>
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
  const res = await axios.get(`${API_URL}/technical-sheets`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}