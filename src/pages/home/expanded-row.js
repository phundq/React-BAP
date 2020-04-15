import React, { Component } from 'react'
import styled from 'styled-components'
import { Icon } from 'antd'
import { Formik, Form } from 'formik'
import { connect } from 'react-redux'
import { object, string, date } from 'yup'

import moment from 'moment'
import { actions, TYPES } from '@/store/actions'
import Table from '@/components/table'
import Button from '@/components/button'
import DatePicker, { dateFormat } from '@/components/date-picker'
import Input from '@/components/input'
import Field from '@/components/field'

const StyledExpandedRow = styled.div`
  > div:first-child {
    margin: 15px 0 10px 0;
    display: flex;

    form {
      display: flex;
      width: 100%;

      .field-group {
        margin-right: 20px;

        > div {
          margin-bottom: 20px;
        }
      }

      .action-box {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        button {
          border: none;
          background: transparent;
          box-shadow: none;

          svg {
            fill: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
  }
`

const validationSchema = object().shape({
  fullName: string().required(),
  dob: date().required()
})

@connect((state) => ({
  employeeStore: state.employee
}), {
  fetchProjectsByEmployeeId: actions.fetchProjectsByEmployeeId,
  deleteEmployeeFromProject: actions.deleteEmployeeFromProject,
  updateEmployee: actions.updateEmployee

})

class ExpandedRow extends Component {
  state = {
    isEditing: false
  }

  componentDidMount() {
    const { employee, fetchProjectsByEmployeeId } = this.props

    fetchProjectsByEmployeeId(employee.id)
  }

  _onSubmit = (values) => {
    const { updateEmployee, employee } = this.props
    const { fullName, dob } = values
    this.setState({ isEditing: false })

    updateEmployee({ id: employee.id, fullName, dob: moment(dob).format('YYYY-MM-DD') })
  }

  _renderForm = ({ handleSubmit, ...form }) => (
    <Form className="form">
      <div className="field-group">
        <Field
          form={form}
          inline
          name="fullName"
          label="Full name"
          component={Input}
          disabled={!this.state.isEditing}
        />
        <Field
          form={form}
          inline
          name="dob"
          label="Day Of Birth"
          component={DatePicker}
          format={dateFormat}
          disabled={!this.state.isEditing}
        />
      </div>
      <div className="action-box">
        { this.state.isEditing ? (
          <>
            <Button htmlType="submit" onClick={handleSubmit}>
              <Icon type="save" />
            </Button>
            <Button onClick={() => this.setState({ isEditing: false })}>
              <Icon type="close" />
            </Button>
          </>
        ) : (
          <Button type="link" onClick={() => this.setState({ isEditing: true })}>
            <Icon type="edit" />
          </Button>
        )}
      </div>
    </Form>
  )

  render() {
    const { employee, employeeStore, deleteEmployeeFromProject } = this.props
    console.log(employeeStore.projects)
    const columns = [
      {
        title: 'Project',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Button
            type="link"
            onClick={() => deleteEmployeeFromProject({ employeeId: employee.id, projectId: record.id })}
          >
            Delete
          </Button>
        )
      }
    ]

    const initialValues = {
      fullName: employee.fullName,
      dob: moment(moment(employee.dob).format('DD/MM/YYYY'), dateFormat)
    }

    return (
      <StyledExpandedRow>
        <div>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={this._onSubmit}
            component={this._renderForm}
          />
        </div>
        {employeeStore.projects.length > 0 && (
          <Table
            bordered
            size="small"
            rowKey={(row, index) => index}
            dataSource={employeeStore.projects}
            columns={columns}
            loading={employeeStore.submitting === TYPES.FETCH_PROJECTS_BY_EMPLOYEE_ID_REQUEST}
          />
        )}
      </StyledExpandedRow>
    )
  }
}

export default ExpandedRow
