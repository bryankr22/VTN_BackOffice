import { useState } from 'react';
import { Typography, Button, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';

const columns: GridColDef[] = [
  { field: 'nombre', headerName: 'Nombre', width: 250 },
  {
    field: "Acciones",
    renderCell: (cellValues) => {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(cellValues.row.id);
          }}
        >
          Editar
        </Button>
      );
    },
    width: 150,
  }
];

export default function Services({ data }) {
  const [rows, setRows] = useState(data.roles);
  const [perPage, setPerPage] = useState(20);

  return (
    <AdminLayout>
      <>
        <Typography>
          Roles
          <Button
            variant="contained"
            color="info"
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 30
            }}
            onClick={() => location.href = `/permissions/create`}
          >
            Crear Rol
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
  const res = await axios.get(`${API_URL}/roles-user`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}