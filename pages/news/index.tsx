import React, { useState } from 'react';
import { Typography, Button, DialogContentText, DialogActions, DialogContent, Dialog, DialogTitle, Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';

export default function News({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }

  const [cookies] = useCookies(["admin_token"]);
  const [rows, setRows] = useState(data.news);
  const [rowId, setRowId] = useState();
  const [perPage, setPerPage] = useState(20);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState<PropsSnackBar>({
    open: false,
    type: 'success',
    message: ''
  });

  const deleteNews = async (id) => {
    setLoading(true);
    setOpenAlert(false);
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.post(`${API_URL}/delete-news`, { id }, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    if (res.data.status) {
      setRows(res.data.news);
    }
    setLoading(false);
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Noticia', width: 400 },
    {
      field: 'description',
      headerName: 'Descripción',
      width: 400,
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
                location.href = `/news/${cellValues.row.id}`;
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
      width: 200
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
            <Button onClick={() => deleteNews(rowId)} autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Typography>
          Noticias
          {data.news.length < 3 &&
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
              Crear Noticia
            </Button>
          }
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
  const res = await axios.get(`${API_URL}/news`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}