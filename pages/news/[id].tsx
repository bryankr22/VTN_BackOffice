import { useState } from 'react';
import { Box, TextField, Snackbar, Alert, Link, Typography, Breadcrumbs, Stack, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, S3_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


export default function CreateNews({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const [news, setNews] = useState(data.news);
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

  const createNews = async () => {
    setLoading(true);
    const { title, description, link } = news;

    if (title === '' || description === '' || link === '') {
      setSnackBar({ open: true, type: 'error', message: 'Llena todos los campos obligatorios!' });
      setLoading(false);
      return;
    }

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    };
    const res = await axios.put(`${API_URL}/update-news`, news, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    setLoading(false);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/news">
      Noticias
    </Link>, ,
    <Typography key="2" color="text.primary">
      {news.title}
    </Typography>,
  ];

  return (
    <AdminLayout>
      <>
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackBar.type} sx={{ width: '100%' }}>
            {snackBar.message}
          </Alert>
        </Snackbar>

        <Grid container spacing={2} style={{ marginTop: 20 }}>
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
                id="title"
                label="Título"
                variant="outlined"
                required
                error={(news.title === '') ? true : false}
                value={news.title}
                onChange={(event) => setNews({ ...news, title: event.target.value })}
              />

              <TextField
                id="link"
                label="Link"
                variant="outlined"
                required
                error={(news.link === '') ? true : false}
                value={news.link}
                onChange={(event) => setNews({ ...news, link: event.target.value })}
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
                id="description"
                multiline
                label="Descripción"
                required
                rows={4}
                error={(news.description === '') ? true : false}
                variant="outlined"
                value={news.description}
                onChange={(event) => setNews({ ...news, description: event.target.value })}
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
              <LoadingButton loading={loading} fullWidth size="large" onClick={createNews} variant="contained">Guardar</LoadingButton>
            </Box>
          </Grid>
        </Grid>
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

  const res = await axios.get(`${API_URL}/form-new/${context.query.id}`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}