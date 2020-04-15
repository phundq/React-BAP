import React from 'react'
import styled from 'styled-components'

import { Search } from '@/components/input'

const Content = styled.div`
    display: flex;
    align-items: center;

    > h3 {
        margin-right: 30px;
    }

    > span {
        margin-right: 70px;
    }
`

export default ({ onSearch }) => (
  <Content>
    <h3>Employee Filter</h3>
    <Search
      placeholder="search"
      style={{ width: '250px' }}
      onSearch={onSearch}
    />
  </Content>
)
