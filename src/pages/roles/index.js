import React, { Component } from 'react'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import { Checkbox, notification } from 'antd'
import { connect } from 'react-redux'
import { actions } from '@/store/actions'

import Storage from '@/utils/storage'
import Input from '@/components/input'
import Field from '@/components/field'
import Button from '@/components/button'
import Page from '@/components/page'
import Select from '@/components/select'
import Container from '@/components/container'
import Table from '@/components/table'
import { Dimensions } from '@/theme'


const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  padding: 30px;
  margin: 20px;

  .new-roles {
    display: flex;
    padding-bottom: 30px;

    .add-role {
      margin-left: 50px;
      margin-right: 50px;
    }
  }

  .combobox-roles {
    padding-bottom: 30px;
    display: flex;
    
    .text-role {
      padding-right: 120px;
      padding-top: 10px;
      font-size: 14px
    }

    .combobox-role {
      width: 225px;
    }
  }
    
  .table-box {
    height: 200px;
    
    .save-change {
      margin-top: 40px;
      height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
  }
`
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: ' Cập nhật thành công!'
  })
}

const validationSchema = object().shape({
  newrole: string().required()
})


@connect((state) => ({
  roleStore: state.role
}), {
  fetchRoles: actions.fetchRoles,
  fetchStatusRoleCurrent: actions.fetchStatusRoleCurrent,
  changeDataRole: actions.changeDataRole,
  updateRole: actions.updateRole
})

class Roles extends Component {
  // _onSubmit = (values) => {
  //   console.log(values)
  // }

  constructor(props) {
    super(props)
    this.state = { selectIndex: '' }
  }

  componentDidMount() {
    this.props.fetchRoles()
    this.props.changeDataRole({ reloadData: true })
  }

  _onChangeRoleSelect = (e, roles) => {
    this.setState({
      selectIndex: e.target.value
    })
    let roleSelected = roles.find((x) => x.name === e.target.value)
    this.props.fetchStatusRoleCurrent(roleSelected.id)
  }

  _renderForm = ({ handleSubmit, ...form }) => (
    <Form className="form">
      <div className="field-group">
        <div className="new-roles">
          <Field
            form={form}
            inline
            size="large"
            name="newrole"
            label="New role"
            component={Input}
          />
          <Button
            className="add-role"
            size="large"
            htmlType="submit"
            type="primary"
            onClick={handleSubmit}
          >
            Add role
          </Button>
        </div>
      </div>
    </Form>
  )

  _checkSelectRole = (dataCheckboxRole, canEdit) => {
    let dataRoleTable = []
    dataRoleTable = dataCheckboxRole.map((item, index) => {
      return (
        {
          key: item.id,
          STT: index + 1,
          Function: item.resourceName,
          Viewable: <Checkbox
            name={item.resourceName}
            checked={
              item.status === 'CAN_EDIT'
              || item.status === 'CAN_VIEW'
            }
            onChange={(e) => { if (canEdit) this.props.changeDataRole({ ...e.target, checkName: 'VIEW' })}}
          />,
          Editable: <Checkbox
            name={item.resourceName}
            checked={
              item.status === 'CAN_EDIT'
            }
            onChange={(e) => { if (canEdit) this.props.changeDataRole({ ...e.target, checkName: 'EDIT' })}}
          />
        }
      )
    })
    return dataRoleTable
  }

  _onSaveChange = (data) => {
    data = data.map((item) => ({ rolePermissionId: item.id, status: item.status }))
    this.props.updateRole(data)
    openNotificationWithIcon('success')
  }

  render() {
    const initialValues = {
      newrole: ''
    }

    const columns = [
      {
        title: 'STT',
        dataIndex: 'STT',
        render: (text, record, index) => <span>{index + 1}</span>,
        key: 'STT'
      },
      {
        title: 'Function',
        dataIndex: 'Function',
        key: 'Function'
      },
      {
        title: 'Viewable',
        dataIndex: 'Viewable',
        key: 'Viewable'
      },
      {
        title: 'Editable',
        dataIndex: 'Editable',
        key: 'Editable'
      }
    ]

    const permissions = Storage.get('PERMISSIONS')
    if (!(permissions.includes('CAN_VIEW_USER') || permissions.includes('CAN_EDIT_USER'))) {
      const { history } = this.props
      history.push('/not-found')
    }

    let { roleStore } = this.props
    let { roles } = roleStore
    let listRolesName = roles.map((x) => x.name)
    let dataCheckboxRole = roleStore.statusRoleCurrent
    let dataSource = [...this._checkSelectRole(dataCheckboxRole, permissions.includes('CAN_EDIT_USER'))]

    return (
      <Page>
        <Container>
          <Content>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={this._onSubmit}
              component={this._renderForm}
            />
            <div className="combobox-roles">
              <b className="text-role"> Roles </b>
              <Select
                className="combobox-role"
                size="large"
                options={listRolesName}
                onChange={(e) => this._onChangeRoleSelect(e, roles)}
                value={this.state.selectIndex}
              />
            </div>
            <div className="table-box">
              <Table
                rowKey={(row, index) => index}
                dataSource={[...dataSource]}
                columns={columns}
                scroll={{ y: `calc(100vh - ${Dimensions.HEADER_HEIGHT}px - 54px - 200px - 50px)` }}
              />
              {
              permissions.includes('CAN_EDIT_USER')?
                (<div className="save-change">
                  <Button
                    size="large"
                    htmlType="submit"
                    type="primary"
                    onClick={() => this._onSaveChange(dataCheckboxRole)}
                  >
                    Save Change
                  </Button>
            </div>) : null
            }
              
            </div>
          </Content>
        </Container>
      </Page>
    )
  }
}

export default Roles
