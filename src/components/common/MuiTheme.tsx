import { createTheme, ThemeOptions } from '@mui/material'
import { grey } from '@mui/material/colors'
import { THEME_TEMPLATES, THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'

export const theme: ThemeOptions = {
  palette: THEME_TEMPLATES[THEME_TEMPLATE_KEY.BLUE].theme.palette,
  typography: {
    fontSize: 13,
    htmlFontSize: 12,
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          p: `8px 16px`,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          zIndex: 'inherit',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: grey[200],
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
          fontSize: '1rem',
        },
      },
    },
  },
}

const MuiTheme = (options?: ThemeOptions) => createTheme({
  ...theme,
  ...(options || {}),
})

export default MuiTheme
