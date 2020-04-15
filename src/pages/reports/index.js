import React, { Component } from 'react'
import styled from 'styled-components'
import { Badge, Card } from 'antd'
import 'antd/es/badge/style/css'
import 'antd/es/card/style/css'
// import lodash from 'lodash'
import { connect } from 'react-redux'
import { actions, TYPES } from '@/store/actions'

import { Search } from '@/components/input'
import Page from '@/components/page'
import Container from '@/components/container'
import Button from '@/components/button'
import Table from '@/components/table'
import PaginationBox from '@/components/pagination'
// import EmployeeFilter from '../home/employee-filter'
import ExpandedRow from './expanded-row'
import NewReport from './new-report'
import Modal from '../home/modal'

const Content = styled.div`
  display: flex;
  .left-box {
    margin-top: 20px;

    > .ant-card {
      border: 1px solid #42a5f5;

      .ant-card-head {
        padding: 7px 12px;
      }
  
      .ant-card-body > div {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        cursor: pointer;
        border: 1px solid #eee;

        &:hover {
          border: 1px solid #42a5f5;
        }
      }
    }
  }

  .right-box {
    padding: 30px;
    flex: 1;

    .action-box {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .search-box {
        width: 250px;
        margin-right: 70px;
      }
    }

    .table-box {

      .ant-table-expanded-row-level-1 {

        > td {
          border-bottom: 1px solid rgba(0,0,0, 0.5);
          border-top: 7px solid #42a5f5;
        }
      }
    }
  }
`

// let dataSource = []

// lodash.range(5).forEach((item, index) => {
//   dataSource.push({
//     key: index,
//     name: 'Huy truong',
//     role: 'Dev',
//     username: 'huytd',
//     reportStatus: 'Ongoing'
//   })
// })

const columns = [
  {
    title: 'STT',
    key: 'key',
    render: (text, record, index) => <span>{index + 1}</span>,
    width: 60
  },
  {
    title: 'Full name',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (fullName) => (
      <Button
        style={{ paddingLeft: '0' }}
        type="link"
      >{fullName}
      </Button>
    )
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: 'Username',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: 'Report Status',
    dataIndex: 'status',
    key: 'status'
  }
]

const PAGE_SIZE = 5
@connect((state) => ({
  reportStore: state.report
}), {
  fetchReports: actions.fetchReports,
  searchReports: actions.searchReports
})


class Reports extends Component {
  state = {
    expandedRowKeys: [],
    selectedRowKeys: []
  }

  componentDidMount() {
    this.props.fetchReports({ page: 1, size: PAGE_SIZE })
  }

  _handleExpandRow = (rowkey) => {
    if (this.state.expandedRowKeys[0] === rowkey) {
      this.setState({ expandedRowKeys: [] })
    } else {
      this.setState({ expandedRowKeys: [rowkey] })
    }
  }

  render() {
    const { selectedRowKeys, expandedRowKeys } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: (rowKeys) => {
        this.setState({ selectedRowKeys: rowKeys })
      }
    }
    let { fetchReports, searchReports, reportStore } = this.props
    let { report } = reportStore
    let { items, total } = report
    console.log(items)

    return (
      <Page>
        <Container>
          <Content>
            <Modal title="New Report" innerRef={(ref) => { this._newReportModal = ref }}>
              <NewReport onClose={() => this._newReportModal.close()} />
            </Modal>
            <div className="left-box">
              <Card
                size="small"
                title="All Report"
                style={{ width: 250 }}
                bodyStyle={{ padding: 0, height: '500px' }}
                headStyle={{ backgroundColor: '#42a5f5', color: 'white' }}
              >
                <div onClick={() => console.log('filter undone reports')}>
                  <span>Undone</span>
                  <Badge count={5} />
                </div>
                <div onClick={() => console.log('filter done reports')}>
                  <span>Done</span>
                  <Badge count={2} />
                </div>
              </Card>
            </div>
            <div className="right-box">
              <div className="action-box">
                <h3>Project filter</h3>
                <Search className="search-box" placeholder="Search" onSearch={(value) => searchReports({ page: 1, size: PAGE_SIZE, name: value.trim() })} />
                <Button type="primary" onClick={() => this._newReportModal.open()}>Create report request</Button>
              </div>
              <div className="table-box">
                <Table
                  rowKey={(row) => row.key}
                  dataSource={items}
                  columns={columns}
                  bordered
                  expandedRowRender={(record) => <ExpandedRow record={record} />}
                  expandedRowKeys={expandedRowKeys}
                  onExpandedRowsChange={(expandedRows) => {
                    this._handleExpandRow(expandedRows[expandedRows.length - 1])
                  }}
                  loading={reportStore.submitting === TYPES.FETCH_REPORTS_REQUEST
                    || reportStore.submitting === TYPES.SEARCH_REPORTS_REQUEST}
                  expandRowByClick
                  rowSelection={rowSelection}
                />
                <PaginationBox pageSize={PAGE_SIZE} total={total} onChange={(page) => fetchReports({ page, size: PAGE_SIZE })} />
              </div>
            </div>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default Reports
