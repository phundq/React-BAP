import React, { Component } from 'react'
import styled from 'styled-components'
import lodash from 'lodash'
import { connect } from 'react-redux'
import { actions } from '@/store/actions'

import Table from '@/components/table'

const StyledExpandedRow = styled.div`

`


@connect((state) => ({
  reportStore: state.report
}), {
  fetchReports: actions.fetchReports
})

class ExpandedRow extends Component {
  render() {
    let { report } = this.props
    // let { expandedRow } = reportStore
    // let { items } = expandedRow

    let dataSource = []

    lodash.range(3).forEach((item, index) => {
      dataSource.push({
        key: index,
        reportName: 'Member Evaluation',
        reportStatus: 'Ongoing',
        assignDate: '2020-03-01',
        dueDate: '2020-03-08',
        completeDate: ''
      })
    })
    const columns = [
      {
        title: 'STT',
        key: 'key',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 50
      },
      {
        title: 'Report Name',
        dataIndex: 'reportName',
        key: 'reportName'
      },
      {
        title: 'Report Status',
        dataIndex: 'reportStatus',
        key: 'reportStatus'
      },
      {
        title: 'Assign Date',
        dataIndex: 'assignDate',
        key: 'assignDate'
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate'
      },
      {
        title: 'Complete Date',
        dataIndex: 'completeDate',
        key: 'completeDate'
      }
    ]
    return (
      <div className="tablle-box">
        <Table
          bordered
          size="small"
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    )
  }
}
export default ExpandedRow
