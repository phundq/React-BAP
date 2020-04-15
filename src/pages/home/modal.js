import React, { Component } from 'react'

import { forwardInnerRef } from '@/utils/high-order-functions'
import Modal from '@/components/modal'


@forwardInnerRef

class generalModal extends Component {
  state = {
    isOpen: false
  }

  open = () => this.setState({ isOpen: true })

  close = () => this.setState({ isOpen: false })

  render() {
    const { isOpen } = this.state
    const { children, title, ...restProps } = this.props

    return (
      <Modal
        title={title}
        visible={isOpen}
        onCancel={this.close}
        {...restProps}
      >
        {children}
      </Modal>
    )
  }
}

export default generalModal
