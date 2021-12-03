import { useState, useEffect } from 'react';
import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { People, ViewCarousel, DirectionsCar, Info, CarRental, Forum, Announcement, HomeRepairService, AddToHomeScreen, Settings, ManageAccounts, Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { API_URL, validateAuth } from '../helpers/constants';
import { useCookies } from 'react-cookie';

const drawerWidth = 240;

interface Props {
  children: JSX.Element,
  window?: () => Window;
}

const items = [
  {
    url: 'users',
    text: 'Usuarios',
    icon: <People />,
    slug: 'VER_USUARIOS'
  },
  {
    url: 'cms',
    text: 'CMS',
    icon: <ViewCarousel />,
    slug: 'VER_CMS'
  },
  {
    url: 'vehicles',
    text: 'Vehículos',
    icon: <DirectionsCar />,
    slug: 'VER_VEHICULOS'
  },
  {
    url: 'technical-sheets',
    text: 'Ficha Técnica',
    icon: <Info />,
    slug: 'VER_FICHA_TECNICA'
  },
  {
    url: 'dealerships',
    text: 'Concesionarios',
    icon: <CarRental />,
    slug: 'VER_CONCESIONARIOS'
  },
  {
    url: 'community',
    text: 'Comunidad',
    icon: <Forum />,
    slug: 'VER_COMUNIDAD'
  },
  {
    url: 'news',
    text: 'Noticias',
    icon: <Announcement />,
    slug: 'VER_NOTICIAS'
  },
  {
    url: 'services',
    text: 'Servicios',
    icon: <HomeRepairService />,
    slug: 'VER_SERVICIOS'
  },
  {
    url: 'promotion',
    text: 'Pautas',
    icon: <AddToHomeScreen />,
    slug: 'VER_PAUTAS'
  },
  {
    url: 'permissions',
    text: 'Permisos',
    icon: <ManageAccounts />,
    slug: 'VER_PERMISOS'
  },
  {
    url: 'configurations',
    text: 'Configuraciones',
    icon: <Settings />,
    slug: 'VER_CONFIGURACIONES'
  },
]

export default function AdminLayout(props: Props) {
  const { window, children } = props;
  const [, , removeCookie] = useCookies(['admin_token']);
  const [cookies] = useCookies(["admin_token"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const init = async () => {
      const cookie = cookies.admin_token;
      const config = {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      };

      const res = await axios.get(`${API_URL}/permissions`, config);
      setMenu(res.data.permissions);
    }

    init();
  }, [])

  const drawer = (
    <div>
      <Toolbar
        style={{ backgroundColor: 'black' }}
        sx={{
          display: { sm: 'block', xs: 'none' },
        }}
      />

      <List>
        {items.map((item, index) => {
          return menu.length > 0 && menu.map((menuItem) => {
            return menuItem.slug === item.slug &&
              <ListItem button onClick={() => location.href = `/${item.url}`} key={item.text}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
          })
        }
        )}
        <ListItem
          button
          onClick={() => {
            removeCookie('admin_token', {});
            location.replace('/login');
          }}
          key="CerrarSesion"
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            VendeTuNave
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: '10px solid',
              borderImageSlice: 1,
              borderWidth: 0,
              borderRightWidth: 1,
              borderImageSource: "linear-gradient(to top, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #c2c2c2, #000, #000)"
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}