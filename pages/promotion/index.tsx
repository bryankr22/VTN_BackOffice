import { useState } from 'react';
import { Typography, Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';

const columns: GridColDef[] = [
  {
    field: 'Imagen',
    renderCell: (cellValues) => {
      return (
        <img
          src={`${cellValues.row.image}?w=164&h=164&fit=crop&auto=format`}
          srcSet={`${cellValues.row.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
          alt={cellValues.row.title}
          width={150}
          height={80}
          loading="lazy"
        />
      );
    },
    width: 180,
  },
  {
    field: 'name',
    headerName: 'Nombre',
    width: 150,
  },
  {
    field: 'link',
    headerName: 'Link',
    width: 300,
  },
  {
    field: 'clicks',
    headerName: 'Clicks',
    width: 80,
  },
  {
    field: 'active',
    headerName: 'Activo',
    renderCell: (cellValues) => {
      return (
        <Checkbox
          checked={(cellValues.row.active) ? true : false}
          onChange={() => cellValues.row.active = 1}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      );
    },
    width: 80,
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
              console.log(cellValues.row.id);
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
    width: 200,
  }
];

export default function Promotion({ data }) {
  const [rows, setRows] = useState(data.promotion);
  const [perPage, setPerPage] = useState(20);

  return (
    <AdminLayout>
      <>
        <Typography>
          Pautas
          <Button
            variant="contained"
            color="info"
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 30
            }}
            onClick={() => location.href = `/promotion/create`}
          >
            Crear Pauta
          </Button>
        </Typography>
        <div style={{ height: 500, width: '100%', marginTop: 20 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={perPage}
            rowHeight={100}
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
  const res = await axios.get(`${API_URL}/promotion`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}