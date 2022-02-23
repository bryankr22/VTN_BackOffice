import { useState } from 'react';
import { Typography, Button, Checkbox, CircularProgress, Backdrop } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';

export default function Users({ data }) {
  const [cookies] = useCookies(["admin_token"]);
  const [rows, setRows] = useState(data.users);
  const [perPage, setPerPage] = useState(20);
  const [loading, setLoading] = useState(false);

  const locked = async (id) => {
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.put(`${API_URL}/locked-user`, { id }, config);
    return res.data.locked;
  }

  const dependable = async (id) => {
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.put(`${API_URL}/dependable-user`, { id }, config);
    return res.data.dependable;
  }

  const active = async (id) => {
    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.put(`${API_URL}/active-user`, { id }, config);
    return res.data.active;
  }

  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre', width: 250 },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 150,
    },
    {
      field: 'activo',
      headerName: 'Activo',
      renderCell: (cellValues) => {
        return (
          <Checkbox
            checked={(cellValues.row.activo) ? true : false}
            onChange={async () => {
              setLoading(true);
              const activeUser = await active(cellValues.row.id);
              cellValues.row.activo = activeUser;
              document.getElementById('title-users').click();
              setLoading(false);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        );
      },
      width: 80,
    },
    {
      field: 'locked',
      headerName: 'Bloqueado Comunidad',
      renderCell: (cellValues) => {
        return (
          <Checkbox
            checked={(cellValues.row.locked) ? true : false}
            onChange={async () => {
              setLoading(true);
              const lockedUser = await locked(cellValues.row.id);
              cellValues.row.locked = lockedUser;
              document.getElementById('title-users').click();
              setLoading(false);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        );
      },
      width: 200,
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
              const dependabledUser = await dependable(cellValues.row.id);
              cellValues.row.confiable = dependabledUser;
              document.getElementById('title-users').click();
              setLoading(false);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        );
      },
      width: 200,
    },
    {
      field: "Acciones",
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              location.href = `/users/${cellValues.row.id}`;
            }}
          >
            Editar
          </Button>
        );
      },
      width: 150,
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
        <Typography id="title-users">
          Usuarios
          <Button
            variant="contained"
            color="info"
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 30
            }}
            onClick={() => location.href = `/users/create`}
          >
            Crear Usuario
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
  const res = await axios.get(`${API_URL}/users`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}