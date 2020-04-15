import React, { Component } from 'react'
import styled from 'styled-components'
import lodash from 'lodash'
import { Formik, Form } from 'formik'
import { object, string, date } from 'yup'

import Field from '@/components/field'
import Table from '@/components/table'
import Button from '@/components/button'
import Select from '@/components/select'
import DatePicker, { dateFormat } from '@/components/date-picker'

const Content = styled.div`
  .field-group {
    > div {
      margin-bottom: 20px;  
    }
  }

  .table-box {
    margin-bottom: 20px;
  }

  .action-box {
    display: flex;
    justify-content: flex-end;

    button:nth-child(2) {
      margin-left: 20px;
    }
  }
`

let dataSource = []

lodash.range(2).forEach((item, index) => {
  dataSource.push({
    key: index,
    fullname: 'Corona',
    username: 'Covid-19'
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
    title: 'Full Name',
    dataIndex: 'fullname',
    key: 'fullname'
  },
  {
    title: 'User Name',
    dataIndex: 'username',
    key: 'username'
  }
]

const validationSchema = object().shape({
  reportType: string().required(),
  dueDate: date().required()
})

class NewReportModal extends Component {
  _onSubmit = (values) => {
    console.log(values)
  }

  _renderForm = ({ handleSubmit, ...form }) => (
    <Form className="form">
      <div className="field-group">
        <Field
          form={form}
          inline
          name="reportType"
          label="Report type"
          options={['Project Evaluation', 'Member Evaluation']}
          component={Select}
        />
        <Field
          form={form}
          inline
          name="dueDate"
          label="Due date"
          component={DatePicker}
          format={dateFormat}
        />
      </div>
      <div className="table-box">
        <Table bordered size="small" dataSource={dataSource} columns={columns} />
      </div>
      <div className="action-box">
        <Button
          size="large"
          htmlType="submit"
          type="primary"
          onClick={handleSubmit}
        >
            Request
        </Button>
        <Button
          size="large"
          onClick={this.props.onClose}
        >
            Cancel
        </Button>
      </div>
    </Form>
  )

  render() {
    const initialValues = {
      reportType: '',
      dueDate: null
    }

    return (
      <Content>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={this._onSubmit}
          component={this._renderForm}
        />
      </Content>
    )
  }
}

export default NewReportModal
