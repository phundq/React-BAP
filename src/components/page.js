import React, { Component } from 'react'
import styled from 'styled-components'

const Div = styled.div`
  overflow-y: auto;
  flex: 1;
`

export default class extends Component {
  scrollTop = () => {
    this._div.scrollTop = 0
  }

  render() {
    const { children, sidebar, className, ...props } = this.props

    return (
      <>
        <Div
          {...props}
          ref={(ref) => { this._div = ref }}
          className={className}
        >
          {children}
        </Div>
      </>
    )
  }
}
