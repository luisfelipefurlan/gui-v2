import { createMuiTheme } from '@material-ui/core';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4788dc',
      main: '#4788dc',
      dark: '#4788dc',
    },
    secondary: {
      main: '#19857b',
      light: '#19857b',
      dark: '#19857b',
    },
    error: {
      main: red.A400,
      light: red.A400,
      dark: red.A400,
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFF',
      login: '#dadde0',
    },
    table: {
      head: '#FFFFFF',
    },
  },

  overrides: {
    MuiTypography: {
      h6: {
        fontSize: '1.20rem',
        fontFamily: '"Raleway", "Roboto", "Helvetica", "sans-serif"',
      },
      h5: {
        fontSize: '1.3rem',
        fontFamily: '"Raleway", "Roboto", "Helvetica", "sans-serif"',
      },
    },
    MuiButtonBase: {
      root: {
        verticalAlign: 'top',
      },
    },
  },
});

export default theme;
