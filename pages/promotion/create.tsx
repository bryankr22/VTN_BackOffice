import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Link,
  Typography,
  Breadcrumbs,
  Stack,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


export default function CreatePromotion({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const [promotion, setPromotion] = useState({
    picture1: '',
    picture2: '',
    title: '',
    nameButton: '',
    slug: '',
    link: ''
  });
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

  const onChangeFile = (picture, e) => {
    if (e.target.files[0]) {
      let objectUrl = URL.createObjectURL(e.target.files[0]);
      const width = picture === 'picture1' ? 1200 : 800;
      const height = picture === 'picture1' ? 300 : 400;

      let file, img;
      file = e.target.files[0];


      if (file) {
        img = new Image();
        img.onload = function () {
          if (this.width !== width || this.height !== height) {
            console.log(this.width,this.height)
            setSnackBar({ open: true, type: 'error', message: picture === 'picture1' ? 'La imagen desktop debe de ser de 1200x300px' : 'La imagen mobile debe de ser de 800x400px' });
            const file1: any = document.getElementById(picture === 'picture1' ? 'file1' : 'file2');
            file1.value = null;
          } else {
            setPromotion({ ...promotion, [picture]: objectUrl });
          }
        };

        img.src = objectUrl;
      }
    }
  }

  const createPromotion = async () => {
    setLoading(true);
    if (promotion.picture1 === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen Desktop!' });
      setLoading(false);
      return;
    }

    if (promotion.picture2 === '') {
      setSnackBar({ open: true, type: 'error', message: 'Carga la imagen Mobile!' });
      setLoading(false);
      return;
    }

    let error = false;
    Object.entries(promotion).map((item) => {
      if (!item[1] && item[0] !== 'picture1' && item[0] !== 'picture2') {
        error = true;
        return;
      }
    });

    if (error) {
      setSnackBar({ open: true, type: 'error', message: 'Llena todos los campos obligatorios!' });
      setLoading(false);
      return;
    }

    let formData = new FormData();
    const file1: any = document.getElementById('file1');
    const file2: any = document.getElementById('file2');
    Object.entries(promotion).map((item) => {
      if (item[0] !== 'picture1' && item[0] !== 'picture2') {
        formData.append(item[0], item[1]);
      }
    });
    formData.append('image1', file1.files[0]);
    formData.append('image2', file2.files[0]);

    const cookie = cookies.admin_token;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookie}`
      }
    };
    const res = await axios.post(`${API_URL}/create-promotion`, formData, config);
    setSnackBar({
      open: true,
      type: res.data.status ? 'success' : 'error',
      message: res.data.message
    });
    if (res.data.status) {
      setPromotion({
        picture1: '',
        picture2: '',
        title: '',
        nameButton: '',
        slug: '',
        link: ''
      });
      file1.value = null;
      file2.value = null;
    }
    setLoading(false);
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/promotion">
      Pautas
    </Link>, ,
    <Typography key="2" color="text.primary">
      Crear Pauta
    </Typography>,
  ];

  return (
    <AdminLayout>
      <>
        <style>
          {`
          .dropzone {
            position: relative;
            border: 2px dotted #111;
            border-radius: 20px;
            color: black;
            font: bold 20px/200px arial;
            height: 200px;
            margin: 30px auto;
            text-align: center;
            width: 250px;
          }

          .dropzone div {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .dropzone [type="file"] {
            cursor: pointer;
            position: absolute;
            opacity: 0;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .dropzone img {
            cursor: pointer;
            border-radius: 10px;
            vertical-align: middle;
            max-width: 95%;
            max-height: 95%;
          }
        `}
        </style>
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <div className="dropzone">
                {promotion.picture1 === '' && <div>Imagen Desktop 1200x300px</div>}
                <input type="file" name="file1" id="file1" accept="image/*" onChange={(e) => onChangeFile('picture1', e)} />
                {promotion.picture1 !== '' && <div><img src={promotion.picture1} onClick={() => document.getElementById('file1').click()} /></div>}
              </div>

              <TextField
                id="title"
                label="Título"
                variant="outlined"
                required
                error={(promotion.title === '') ? true : false}
                value={promotion.title}
                onChange={(event) => setPromotion({ ...promotion, title: event.target.value })}
              />

              <TextField
                id="link"
                label="Link"
                required
                error={(promotion.link === '') ? true : false}
                variant="outlined"
                value={promotion.link}
                onChange={(event) => setPromotion({ ...promotion, link: event.target.value })}
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

              <div className="dropzone">
                {promotion.picture2 === '' && <div>Imagen Mobile 800x400px</div>}
                <input type="file" name="file2" id="file2" accept="image/*" onChange={(e) => onChangeFile('picture2', e)} />
                {promotion.picture2 !== '' && <div><img src={promotion.picture2} onClick={() => document.getElementById('file2').click()} /></div>}
              </div>

              <TextField
                id="name_button"
                label="Nombre botón"
                required
                error={(promotion.nameButton === '') ? true : false}
                variant="outlined"
                value={promotion.nameButton}
                onChange={(event) => setPromotion({ ...promotion, nameButton: event.target.value })}
              />

              <TextField
                id="type"
                select
                label="Slug"
                value={promotion.slug}
                error={(promotion.slug === '') ? true : false}
                onChange={(event) => setPromotion({ ...promotion, slug: event.target.value })}
              >
                <MenuItem key="Nuevos" value="Nuevos">Nuevos</MenuItem>
                <MenuItem key="Usados" value="Usados">Usados</MenuItem>
              </TextField>

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
              <LoadingButton loading={loading} fullWidth size="large" onClick={createPromotion} variant="contained">Guardar</LoadingButton>
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
  const res = await axios.get(`${API_URL}/form-technical-sheets`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}