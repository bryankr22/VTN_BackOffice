import { useState } from 'react';
import { Typography, Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';

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
    width: 200
  }
];

export default function News({ data }) {
  const [rows, setRows] = useState(data.news);
  const [perPage, setPerPage] = useState(20);

  return (
    <AdminLayout>
      <>
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