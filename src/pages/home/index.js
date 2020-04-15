import React, { Component } from 'react'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { object, string, date } from 'yup'
import { Tag, Upload, Icon } from 'antd'
import 'antd/es/tag/style/css'
import 'antd/es/upload/style/css'
import { connect } from 'react-redux'
import moment from 'moment'
import { actions, TYPES } from '@/store/actions'

import Page from '@/components/page'
import Container from '@/components/container'
import Table from '@/components/table'
import Button from '@/components/button'
import Checkbox from '@/components/checkbox'
import Field from '@/components/field'
import Input from '@/components/input'
import DatePicker, { dateFormat } from '@/components/date-picker'
import Select from '@/components/select'
import Modal from './modal'
import ExpandedRow from './expanded-row'
import EmployeeFilter from './employee-filter'
import PaginationBox from '@/components/pagination'
import Notification from '@/components/notification'

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
  }

  .table-box {
    margin: 0 30px;
    
    .ant-table-expanded-row-level-1 {

      > td {
        border-bottom: 1px solid rgba(0,0,0, 0.5);
        border-top: 7px solid #42a5f5;
      }
    }
  }
`

const StyledForm = styled.div`
  .action-box {
    display: flex;
    justify-content: flex-end;
    
    > button:nth-child(2) {
      margin-left: 20px;
    }
  }

  .field-group > div {
    margin-bottom: 30px;
  }
`

const ImportModal = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ isHasFile }) => isHasFile && `
  flex-direction: column;
  `}

  > *:not(:last-child) {
    margin-bottom: 20px;
  }

  > div:last-child {
    display: flex;
    justify-content: flex-end;

    > button:last-child {
      margin-left: 20px;
    }
  }
`
const PAGE_SIZE = 5

const importFailColumns = [
  {
    title: '#',
    key: 'id',
    render: (text, record, index) => <span>{index + 1}</span>,
    width: 50
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email'
  },
  {
    title: 'Errors',
    key: 'errors',
    dataIndex: 'errors',
    render: (text, record) => (
      <ul>
        {record.errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )
  }
]

const validationSchema = object().shape({
  fullName: string().required(),
  email: string().required(),
  password: string().required(),
  roleId: string().required(),
  dob: date().required(),
  phonenumber: string().matches(/\b0[1-9]\d{8}\b/, 'Phone number is not valid').required()
})

@connect((state) => ({
  employeeStore: state.employee
}), {
  fetchEmployees: actions.fetchEmployees,
  searchEmployees: actions.searchEmployees,
  fetchRoles: actions.fetchRoles,
  importEmployees: actions.importEmployees,
  createEmployee: actions.createEmployee
})

class Home extends Component {
  state = {
    expandedRowKeys: [],
    fileList: []
  };

  _fileHandler = (file) => {
    if (!file.name.match(/\.(xlsx|csv)$/)) Notification.error('Please upload an Excel or SCV file!')
    else this.setState({ fileList: [file] })
    return false
  };

  _onImport = () => {
    this.props.importEmployees(this.state.fileList[0], (success, data) => {
      if (success) {
        console.log(data.fails)
        this._importEmployeeModal.close()
        if (data.fails.length > 0) this._importFailModal.open()
        else Notification.success('Employees imported successfully!')
      }
    })
  }

  componentDidMount() {
    this.props.fetchEmployees({ page: 1, size: PAGE_SIZE })
  }

  _handleExpandRow = (rowkey) => {
    if (this.state.expandedRowKeys[0] === rowkey) {
      this.setState({ expandedRowKeys: [] })
    } else {
      this.setState({ expandedRowKeys: [rowkey] })
    }
  }

  _onNewEmployee = () => {
    this._newEmployeeModal.open()
    this.props.fetchRoles()
  }

  _createEmployee = (values) => {
    const { createEmployee, employeeStore } = this.props
    const newEmployee = { ...values,
      dob: moment(values.dob).format('YYYY-MM-DD'),
      roleId: employeeStore.roles.find((role) => role.name === values.roleId)?.id }

    createEmployee(newEmployee, (success) => {
      if (success) {
        Notification.success('Employee created successfully!')
        this._newEmployeeModal.close()
      }
    })
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
        />
        <Field
          form={form}
          inline
          name="email"
          label="Email"
          component={Input}
        />
        <Field
          form={form}
          inline
          name="password"
          label="Password"
          type="password"
          component={Input}
        />
        <Field
          form={form}
          inline
          name="phonenumber"
          label="Phone Number"
          component={Input}
        />
        <Field
          form={form}
          inline
          name="dob"
          label="Day Of Birth"
          component={DatePicker}
          format={dateFormat}
        />
        <Field
          form={form}
          inline
          name="roleId"
          label="Role"
          loading={this.props.employeeStore.submitting === TYPES.FETCH_ROLES_REQUEST}
          options={this.props.employeeStore.roles.map((role) => role.name)}
          component={Select}
        />
      </div>
      <div className="action-box">
        <Button
          size="large"
          htmlType="submit"
          type="primary"
          onClick={handleSubmit}
          loading={this.props.employeeStore.submitting === TYPES.CREATE_EMPLOYEE_REQUEST}
        >
            Ok
        </Button>
        <Button
          size="large"
          onClick={() => this._newEmployeeModal.close()}
        >
            Cancel
        </Button>
      </div>
    </Form>
  )


  render() {
    const { fetchEmployees, searchEmployees, employeeStore } = this.props

    const { employee, failedEmployees } = employeeStore
    const { items, total } = employee

    const initialValues = {
      fullName: '',
      email: '',
      password: '',
      dob: null,
      roleId: '',
      phonenumber: ''
    }

    const columns = [
      {
        title: '#',
        key: 'id',
        render: (text, record, index) => <span>{index + 1}</span>,
        width: 50
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
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        render: (active) => <Checkbox checked={active} />
      },
      {
        title: 'Project',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (projects) => (
          <span>
            {projects.map((project, index) => (
              <Tag color="blue" key={index}>
                {project.toUpperCase()}
              </Tag>
            ))}
          </span>
        )
      }
    ]

    return (
      <Page>
        <Container>
          <Content>
            { failedEmployees.length > 0 && (
            <Modal title="unsuccessful imported employees" innerRef={(ref) => { this._importFailModal = ref }}>
              <Table rowKey={(row, index) => index} dataSource={failedEmployees} columns={importFailColumns} />;
            </Modal>
            )}
            <Modal title="New Employee" innerRef={(ref) => { this._newEmployeeModal = ref }}>
              <StyledForm>
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={this._createEmployee}
                  component={this._renderForm}
                />
              </StyledForm>
            </Modal>
            <Modal title="Import Employees" innerRef={(ref) => { this._importEmployeeModal = ref }}>
              <ImportModal isHasFile={this.state.fileList.length > 0}>
                <Upload
                  name="employeees-file"
                  beforeUpload={this._fileHandler}
                  showUploadList
                  fileList={this.state.fileList}
                  onRemove={() => this.setState({ fileList: [] })}
                >
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
                <div>
                  <Button
                    type="primary"
                    disabled={this.state.fileList.length === 0}
                    onClick={this._onImport}
                    loading={employeeStore.submitting === TYPES.IMPORT_EMPLOYEES_REQUEST}
                  >Ok
                  </Button>
                  <Button onClick={() => this._importEmployeeModal.close()}>Cancel</Button>
                </div>
              </ImportModal>
            </Modal>
            <div className="top-box">
              <EmployeeFilter onSearch={(value) => searchEmployees({ page: 1, size: PAGE_SIZE, email: value })} />
              <Button type="primary" onClick={this._onNewEmployee}>New Employee</Button>
              <Button onClick={() => this._importEmployeeModal.open()}>Import Employee</Button>
            </div>
            <div className="table-box">
              <Table
                rowKey={(row, index) => index}
                dataSource={items}
                columns={columns}
                expandedRowRender={(record) => <ExpandedRow employee={record} />}
                expandedRowKeys={this.state.expandedRowKeys}
                onExpandedRowsChange={(expandedRows) => {
                  this._handleExpandRow(expandedRows[expandedRows.length - 1])
                }}
                expandRowByClick
                bordered
                expandIconColumnIndex={0}
                loading={employeeStore.submitting === TYPES.FETCH_EMPLOYEES_REQUEST
                  || employeeStore.submitting === TYPES.SEARCH_EMPLOYEES_REQUEST}
              />
              <PaginationBox pageSize={PAGE_SIZE} total={total} onChange={(page) => fetchEmployees({ page, size: PAGE_SIZE })} />
            </div>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default Home
