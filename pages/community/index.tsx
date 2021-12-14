import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';

const columns: GridColDef[] = [
  {
    field: 'repuestas',
    headerName: 'Repuestas',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => `${params.row.repuestas} ${params.row.repuestas === 1 ? 'Repuesta' : 'Repuestas'}`,
  },
  {
    field: 'titulo',
    headerName: 'Pregunta',
    width: 500,
  },
  {
    field: "Acciones",
    renderCell: (cellValues) => {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            location.href = `/community/${cellValues.row.id}`;
          }}
        >
          Editar
        </Button>
      );
    },
    width: 150,
  }
];



export default function Vehicles({ data }) {
  const [rows, setRows] = useState(data.approved_questions);
  const [perPage, setPerPage] = useState(20);

  return (
    <AdminLayout>
      <>
        <Typography>
          Preguntas
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

  const res = await axios.get(`${API_URL}/community`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}