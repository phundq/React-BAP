import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components'

import * as Images from './images'
import * as Colors from './colors'
import * as Dimensions from './dimensions'

class Theme extends Component {
  state = {
    primary: Colors.PRIMARY
  }

  _switchTheme = (type) => {
    this.setState({
      primary: type === 1 ? Colors.ACCENT : Colors.PRIMARY
    })
  }

  render() {
    const { children } = this.props
    const theme = {
      ...this.state,
      switchTheme: this._switchTheme
    }

    return (
      <ThemeProvider theme={theme}>
        <>
          {children}
        </>
      </ThemeProvider>
    )
  }
}

export {
  Images,
  Dimensions,
  Colors
}

export default Theme
