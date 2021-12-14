import React, { useState } from 'react';
import { Box, TextField, MenuItem, Avatar, Snackbar, Alert, Link, Typography, Breadcrumbs, Stack, Grid, List, ListItem, ListItemAvatar, ListItemText, Divider, Chip, Button, IconButton, CircularProgress, Backdrop } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from "../../layout/AdminLayout";
import axios from 'axios';
import { API_URL, S3_URL, validateAuth } from '../../helpers/constants';
import { useCookies } from 'react-cookie';


export default function CreateUser({ data }) {
  interface PropsSnackBar {
    open: boolean,
    type: "error" | "success" | "success" | "warning",
    message: string
  }
  const [cookies] = useCookies(["admin_token"]);
  const date = new Date();
  const [user, setUser] = useState();
  const [answers, setAnswers] = useState(data.answers);
  const [question, setQuestion] = useState(data.question);
  const [tags, setTags] = useState(data.tags);
  const [loading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
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

  const deleteComment = async (id) => {
    if (window.confirm("Estas seguro de eliminar este comentario?")) {
      setLoading(true);

      const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
      const res = await axios.post(`${API_URL}/delete-comment`, { id }, config);
      setSnackBar({
        open: true,
        type: res.data.status ? 'success' : 'error',
        message: res.data.message
      });
      if (res.data.status) {
        setAnswers(res.data.answers);
      }
      setLoading(false);
    }
  }

  const deleteQuestion = async (id) => {
    if (window.confirm("Estas seguro de eliminar esta pregunta?")) {
      setLoading(true);

      const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };
      const res = await axios.post(`${API_URL}/delete-question`, { id }, config);
      setSnackBar({
        open: true,
        type: res.data.status ? 'success' : 'error',
        message: res.data.message
      });
      if (res.data.status) {
        location.href = `/community`;
      }
      setLoading(false);
    }
  }

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/community">
      Comunidad
    </Link>, ,
    <Typography key="2" color="text.primary">
      {question.titulo}
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
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <br />

        <Typography
          sx={{ display: 'block' }}
          component="span"
          variant="body2"
          color="text.primary"
        >
          {question.nombre}

          <Button
            variant="contained"
            color="error"
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 30
            }}
            onClick={() => deleteQuestion(question.id)}
          >
            Eliminar Pregunta
          </Button>
        </Typography>
        <Typography
          sx={{ display: 'block' }}
          style={{ marginTop: 15, marginLeft: 20 }}
          component="span"
          variant="h6"
          color="text.primary"
        >
          {question.titulo}
        </Typography>
        <Divider variant="middle" />
        <Typography
          sx={{ display: 'block' }}
          style={{ marginTop: 5, marginLeft: 20, marginBottom: 15 }}
          component="span"
          variant="subtitle1"
          color="text.primary"
        >
          {question.descripcion}
        </Typography>

        {tags.map((item) => <Chip color="primary" label={item.tag} style={{ marginRight: 10 }} />)}

        <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
          {answers.map((item, index) => (
            <>
              <ListItem alignItems="flex-start"
                secondaryAction={<React.Fragment>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteComment(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </React.Fragment>}
              >
                <ListItemAvatar>
                  <Avatar alt={item.nombre} src={`${S3_URL}/usuarios/${item.image}`} />
                </ListItemAvatar>
                <ListItemText
                  secondary={<React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {item.nombre}
                    </Typography>
                    {` — ${item.respuesta}`}
                  </React.Fragment>} />
              </ListItem>
              {answers.length !== (index + 1) && <Divider variant="inset" component="li" />}
            </>
          ))}
        </List>
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
  const res = await axios.get(`${API_URL}/community/${context.query.id}`, config);
  const data = await res.data;
  return {
    props: {
      data
    },
  }
}