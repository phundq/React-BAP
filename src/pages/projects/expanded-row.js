import React, { Component } from 'react'
import { Formik, Form } from 'formik'
import styled from 'styled-components'
import { Icon } from 'antd'
import moment from 'moment'
import lodash from 'lodash'
import { connect } from 'react-redux'
import { object, string, date, number } from 'yup'

import Checkbox from '@/components/checkbox'
import Storage from '@/utils/storage'
import { actions, TYPES } from '@/store/actions'
import Table from '@/components/table'
import Input from '@/components/input'
import Field from '@/components/field'
import Button from '@/components/button'
import DatePicker, { dateFormat } from '@/components/date-picker'

const StyledExpandedRow = styled.div`
  border-top: 8px solid #1890FF;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  padding: 20px 50px 20px 65px;
  position: relative;
  margin: -20px -16px -15px -65px;

  .form{
    display: flex;
    justify-content: space-between;

    .box-item{
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      > div:not(:last-child) {
        margin-bottom: 20px;
      }

      p.label {
        width: auto;
      }

      .field-content {
        margin-left: 20px;
      }

      .item1{
        width: 200px;
      }

      .item2{
        margin-left: 70px;
        width: 200px;
      }

      .item3{
        margin-left: 10px;
        width: 200px;
      }

      .item4{
        margin-left: 100px;
        width: 200px;
      }
      .item5{
        margin-left: 4px;
        width: 200px;
      }
      .item6{
        width: 200px;
      }
    }

    .action-box{
      button {
        border: none;
        background: transparent;
        box-shadow: none;

        svg {
          fill: rgba(0, 0, 0, 0.65);
          width: 20px;
          height: 20px;
        }
        .icon{
          border: 1px solid black; 
        }

      }
      
    }
  }
  .table{
    display: block;
    margin: auto;
    width: 500px;
    margin-top: 30px;
    
    thead > tr > th:nth-child(2){
      width: 350px;
      text-align: center;
    }

    thead > tr > th:last-child{
      text-align: center;
    }

    tbody > tr > td {
      text-align: center;
    }
  } 
`
const validationSchema = object().shape({
  name: string(),
  projectManager: string(),
  numberOfMember: number(),
  startDate: date(),
  endDate: date()
})

@connect((state) => ({
  accountStore: state.account,
  projectStore: state.project
}), {
  fetchProjectsDetail: actions.fetchProjectsDetail,
  deleteEmployeeFromProject: actions.deleteEmployeeFromProject,
  updateProject: actions.updateProject
})

class ExpandedRow extends Component {
  state = {
    isEditing: false,
    search: ''
  }
  componentDidMount() {
    const { project, fetchProjectsDetail } = this.props
    fetchProjectsDetail(project.id)
  }

  _onSubmit = (values) => {
    const { updateProject, project } = this.props
    const { name, projectManagerEmail, startDate, endDate, numberOfMember } = values
    this.setState({ isEditing: false })
    updateProject({
      id: project.id,
      name,
      projectManagerEmail,
      numberOfMember,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    })
  }

  _onSearch = (search) => {
    this.setState({
      search: search
    })
  }
  /*_handleDelete = (key) => {
    const data = [...this.state.data]
    this.setState({ data: data.filter((item) => item.key !== key) })
  };*/

  _renderEditForm = ({ _handleSubmit, ...form }) => {
    const {permissions} = Storage.get('PERMISSIONS')
    return (
      <Form className="form">
        <div className="box-item">
          <Field
            inline
            name="name"
            form={form}
            label="Project name"
            className="item1"
            component={Input}
            disabled={!this.state.isEditing}
          />
          <Field
            inline
            name="projectManagerEmail"
            form={form}
            label="PM"
            type="email"
            className="item2"
            component={Input}
            disabled={!this.state.isEditing}
          />
          {!permissions.includes('CAN_EDIT_USER') ? (
            <Field
              inline
              name="hiddenField"
              form={form}
              label="Member list"
              type="text"
              placeholder='Search'
              onSubmit={(key) => this._onSearch(key)}
              className="item3"
              component={Input}
            />
          ): null}

        </div>
        <div className="box-item">
          <Field
            inline
            name="startDate"
            form={form}
            label="Start date"
            component={DatePicker}
            format={dateFormat}
            className="item4"
            disabled={!this.state.isEditing}
          />
          <Field
            inline
            name="numberOfMember"
            form={form}
            label="Number of Dev Request"
            type="number"
            min="0"
            component={Input}
            className="item5"
            disabled={!this.state.isEditing}
          />
        </div>
        <div className="box-item">
          <Field
            inline
            name="endDate"
            form={form}
            label="End date"
            component={DatePicker}
            format={dateFormat}
            className="item6"
            disabled={!this.state.isEditing}
          />
        </div>
        {!permissions.includes('CAN_EDIT_PROJECT') && (
          <div className="action-box">
          { this.state.isEditing ? (
            <div>
              <Button htmlType="submit" onClick={_handleSubmit}>
                <Icon type="save" />
              </Button>
              <Button onClick={() => this.setState({ isEditing: false })}>
                <Icon type="close" />
              </Button>
            </div>
          ) : (
            <Button
              type="link"
              onClick={() => this.setState({ isEditing: true })}
            >
              <Icon className="icon" type="edit" />
            </Button>
          )}
          </div>
        )}
      </Form>
    )
  }
  render() {
    const { project, projectStore, accountStore, deleteEmployeeFromProject } = this.props
    const { projects } = projectStore

    const initialValues = {
      name: project.name,
      startDate: moment(moment(project.startDate).format('DD/MM/YYYY'), dateFormat),
      endDate: moment(moment(project.endDate).format('DD/MM/YYYY'), dateFormat),
      projectManagerEmail: project.projectManagerEmail,
      numberOfMember: project.numberOfMember,
      hiddenField: !accountStore.permissions.includes('CAN_EDIT_USER')
    }

    const data = []
    lodash.range(3).forEach((index) => {
      data.push({
        employeeId: index + 1,
        email: `Hoang${index + 1}@bap.jp`,
        memberType: (index + 1) % 2 === 1
      })
    })

    const column = [
      {
        title: 'No',
        key: 'employeeId',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: 'Username',
        dataIndex: 'email',
        key: 'email',
        render: (email, record) => (
          <Button
            type="link"
            // onClick={() => deleteEmployeeFromProject({ employeeId: record.id })}
          >{email}
          </Button>
        )
      },
      {
        title: 'Leader',
        dataIndex: 'memberType',
        key: 'memberType',
        render: (memberType) => memberType==='LEADER' ? (<Checkbox checked={memberType} />) : (<Checkbox />)
      }
    ]

    return (
      <StyledExpandedRow>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={this._onSubmit}
          component={this._renderEditForm}
        />
        {projects.length > 0 && (
          <Table
            className="table"
            rowKey="employeeId"
            bordered
            columns={column}
            dataSource={projects}
            loading={projectStore.submitting === TYPES.FETCH_PROJECTS_DETAIL_REQUEST}
            style={{ width: '500px', marginTop: '30px' }}
          />
        )}
      </StyledExpandedRow>
    )
  }
}

export default ExpandedRow
