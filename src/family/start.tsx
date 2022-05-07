import React, { Component } from 'react'
import { render } from 'react-dom'
import { Store } from 'redux'
import { connect, Provider } from 'react-redux'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { GlobalProvider } from './GlobalProvider'
import { Box, CssBaseline } from '@mui/material'
import MuiTheme from '../components/common/MuiTheme'
import Routes from 'routes'
import { PropTypes } from 'family'
import { THEME_TEMPLATES, THEME_TEMPLATE_KEY } from 'components/account/ThemeChangeOverlay'
import { RootState } from 'actions/types'
import GlobalStyles from 'components/common/GlobalStyles'

const DepressedWarningRouter = ConnectedRouter as any

const start = (container: any, { store, history }: { store: Store; history: History }) => {
  class RootBase extends Component<any> {
    static childContextTypes = {
      store: PropTypes.object,
    }

    getChildContext() {
      return { store }
    }
    render() {
      const themeId = this.props.themeId
      const theme = MuiTheme(THEME_TEMPLATES[themeId ?? THEME_TEMPLATE_KEY.INDIGO].theme)

      return (
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <GlobalProvider>
              <CssBaseline />
              <Box sx={GlobalStyles}>
                <DepressedWarningRouter history={history}>
                  <Routes />
                </DepressedWarningRouter>
              </Box>
            </GlobalProvider>
          </SnackbarProvider>
        </ThemeProvider>
      )
    }
  }

  const App = connect((state: RootState) => ({ themeId: state.themeId }), {})(RootBase)

  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), container)
}

export default start
