import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Storage from '@/utils/storage'
import Button from '@/components/button'
import { Dimensions } from '@/theme'


const HeaderContainer = styled.header`
  width: 100%;
  height: ${Dimensions.HEADER_HEIGHT}px;
  color: white;
  display: flex;
  background-color: ${({ theme }) => theme.primary};
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
  z-index: 0;

  .content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-box {
      display: flex;
      align-items: center;
      
      .menu-item {
        color: white;
        margin-right: 10px;
        padding: 10px 20px;
        transition: 0.2s;
        
        &:hover {
          opacity: 0.8;
        }
        
        &.active {
          transform: scale(1.2);
          font-weight: bold;
        }
      }
    }

    .right-box {
      display: flex;
      align-items: center;
    }
  }
`

@connect((state) => ({
  accountStore: state.account
}), {
  historyPush: push
})

class Header extends Component {
  _onLogout = (e) => {
    e.preventDefault()

    const { historyPush } = this.props

    Storage.clear()
    historyPush('/login')
  }

  render() {
    const { accountStore } = this.props
    const links = [{
      url: '/',
      label: 'Employee'
    }, {
      url: '/projects',
      label: 'Projects'
    }, {
      url: '/reports',
      label: 'Report'
    }, {
      hide: !(accountStore.permissions.includes('CAN_VIEW_USER') || accountStore.permissions.includes('CAN_EDIT_USER')),
      url: '/roles',
      label: 'Roles'
    }]

    return (
      <HeaderContainer>
        <div className="content">
          <div className="left-box">
            {links.map((item, index) => !item.hide && (
              <NavLink
                key={index}
                exact={item.url === '/'}
                className="menu-item"
                to={item.url}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="right-box">
            <Button onClick={this._onLogout}>Logout</Button>
          </div>
        </div>
      </HeaderContainer>
    )
  }
}

export default Header
