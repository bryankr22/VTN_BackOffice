import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;