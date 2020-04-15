import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import 'antd/es/input/style/css'

import { Search } from '@/components/input'
import { actions, TYPES } from '@/store/actions'
import Page from '@/components/page'
import Modal from '../home/modal'
import Table from '@/components/table'
import Button from '@/components/button'
import Pagination from '@/components/pagination'
import Container from '@/components/container'
import ExpandedRow from './expanded-row'
import NewProject from './new-project'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  
  .top-box {
    align-items: center;
    display: flex; 
    flex-wrap: wrap;
    margin: 50px 30px;

    > button:not(:last-child) {
      margin-right: 30px;
    }
    h3{
      margin-right: 30px;
    }
    .search {
      width: 250px;
      margin-right: 70px;
    }
    
  }
 
  .table-box {
    margin: 0 30px;

    .table {
      thead > tr > th:first-child{
        width: 20px;
      }
      thead > tr > th:nth-child(3){
        width: 50px;
      }
      thead > tr > th:nth-child(4){
        width: 250px;
      }
      thead > tr > th:nth-child(5){
        width: 250px;
      }
      thead > tr > th:last-child{
        width: 500px;
      }
      /*.button{
        height: 50px;
        position: relative;
        margin-top: -30px;
        margin-bottom: -30px;

        &:hover {
          background-color: #1890FF;
          color: white;
        }

        &:active {
          background-color: #1890FF;
          color: white;
        }
      }*/
      
      /*.ant-table-row-expand-icon-cell > div{
        display: none;
      }*/
    }
    
    .pagination-box {
      height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
  }
`
const PAGE_SIZE = 5

@connect((state) => ({
  projectStore: state.project
}), {
  fetchProjects: actions.fetchProjects,
  searchProjects: actions.searchProjects,
  deleteProject: actions.deleteProject,
  fetchRoles: actions.fetchRoles,
  changeStatusProject: actions.changeStatusProject
})

class Projects extends Component {
  state = {
    selectedRowKeys: [],
    expandedRowKeys: [],
    disabled: false
  };

  componentDidMount() {
    this.props.fetchProjects({ page: 1, size: PAGE_SIZE })
  }

  _handleExpandRow = (rowkey) => {
    if (this.state.expandedRowKeys[0] === rowkey) {
      this.setState({ expandedRowKeys: [] })
    } else {
      this.setState({ expandedRowKeys: [rowkey] })
    }
  }
  _onNewProject = () => {
    this._newProject.open()
    this.props.fetchRoles()
  }

  _handleDataChange = () => this.setState({disabled: !this.state.disabled})
  _handleDeleteProject = () => {
    const {deleteProject} = this.props
    this.props.fetchRoles()
    deleteProject (success => {
      if(success){
        Notification.success('Project deleted successfully!')
      }else{
        Notification.success('Project deleted failure!')
      }
    })
  }
  // _deleteProject = (id) => this.state.selectedRowKeys.filter((items, index) => items[index] !== id)

  _onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  };

  _onSubmit = (values) => {
    console.log(values)
  }

  render() {
    const { fetchProjects, searchProjects, deleteProject, changeStatusProject, projectStore } = this.props
    const { project } = projectStore
    const { items, total } = project

    const { selectedRowKeys } = this.state
    const rowSelection = {
      disabled: this.state.disabled,
      selectedRowKeys,
      onChange: this._onSelectChange
    }
    const state = this.state
    const hasSelected = selectedRowKeys.length > 0
    const columns = [
      {
        title: '#',
        key: 'id',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: 'Project Name',
        dataIndex: 'name',
        key: 'name',
        render: (name) => (
          <Button className="button" type="link">
            {name}
          </Button>
        )
      },
      {
        title: 'PM',
        dataIndex: 'projectManagerEmail',
        key: 'projectManagerEmail'
      },
      {
        title: 'Leader',
        dataIndex: 'leaders',
        key: 'leaders',
        render: (leaders) => (leaders === '' ? 'none' : leaders.join(', '))

      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
      }
    ]

    return (
      <Page>
        <Container>
          <Content>
            <div className="top-box">
              <h3>Project filter</h3>
              <Search
                className="search"
                placeholder="Search"
                onSearch={(value) => searchProjects({ page: 1, size: PAGE_SIZE, name: value.trim() })}
              />
              <Button
                className="create"
                type="primary"
                onClick={() => this._newProject.open()}
              >New project
              </Button>
              <Modal title="New project" centered innerRef={(ref) => { this._newProject = ref }}>
                <NewProject onClose={() => this._newProject.close()} />
              </Modal>
              <Button className="delete" disabled={!hasSelected} onClick={this._handleDeleteProject}>
                Delete project
              </Button>
              <Button className="status" disabled={!hasSelected} onClick={this._handleDataChange}>
                Disable / Enable project
              </Button>
            </div>
            <div className="table-box">
              <Table
                className="table"
                rowKey="id"
                bordered
                disabled={!this.state.disabled}
                columns={columns}
                dataSource={items}
                rowSelection={rowSelection}
                expandRowByClick
                expandedRowRender={(record) => <ExpandedRow project={record} />}
                expandedRowKeys={this.state.expandedRowKeys}
                onExpandedRowsChange={(expandedRows) => {
                  this._handleExpandRow(expandedRows[expandedRows.length - 1])
                }}
                loading={projectStore.submitting === TYPES.FETCH_PROJECTS_REQUEST
                  || projectStore.submitting === TYPES.SEARCH_PROJECTS_REQUEST}
              />
              <div className="pagination-box">
                <Pagination
                  pageSize={PAGE_SIZE}
                  total={total}
                  onChange={(page) => fetchProjects({ page, size: PAGE_SIZE })}
                />
              </div>
            </div>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default Projects
