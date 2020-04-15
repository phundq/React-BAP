import React, { Component } from 'react'
import styled from 'styled-components'
import { object, string, date, number } from 'yup'
import { Formik, Form } from 'formik'
import { connect } from 'react-redux'

import DatePicker, { dateFormat } from '@/components/date-picker'
import { actions, TYPES } from '@/store/actions'
import Select from '@/components/select'
import Field from '@/components/field'
import Input from '@/components/input'
import Button from '@/components/button'
import Notification from '@/components/notification'

const Content = styled.div`
  .field-group {
    > div {
      margin-bottom: 20px;  
    }
  }

  .action-box {
      display: flex;
      justify-content: space-between;

      button{
        margin-top: 100px;
        width: 90px;
      }
      button:first-child {
        margin-left: 50px;
      }
      button:nth-child(2) {
        margin-right: 50px;
      }
  }
`
const validationSchema = object().shape({
  name: string().required(),
  startDate: date().required(),
  endDate: date().required(),
  projectManagerId: string().required(),
  numberOfMember: number().required(),
  description: string().required()
})

@connect((state) => ({
  projectStore: state.project
}), {
  createProject: actions.createProject
})

class NewProject extends Component {
  _createProject = (values) => {
    console.log(values)
    const { createProject, projectStore } = this.props
    const newProject = { ...values,
      startDate: moment(values.startDate).format('YYYY-MM-DD'),
      endDate: moment(values.endDate).format('YYYY-MM-DD'),
      projectManagerId: projectStore.project.items.find((item) => item.projectManagerEmail === values.projectManagerId)
    }

    createProject(newProject, (success) => {
      if (success) {
        alert('Project created successfully!')
        // Notification.success('Project created successfully!')
        this._newProject.close()
      }
      else{
        alert('Project created failure')
      }
    })
  }

  _renderForm = ({ handleSubmit, ...form }) => (
    <Form className="form">
      <div className="field-group">
        <Field
          inline
          form={form}
          name="name"
          label="Project name"
          component={Input}
        />
        <Field
          inline
          form={form}
          name="startDate"
          label="Start date"
          component={DatePicker}
          format={dateFormat}
        />
        <Field
          inline
          form={form}
          name="endDate"
          label="End date"
          component={DatePicker}
          format={dateFormat}
        />
        <Field
          inline
          form={form}
          name="projectManagerId"
          label="PM"
          options={this.props.projectStore.project.items.map((item) => item.projectManagerEmail)}
          component={Select}
        />
        <Field
          inline
          form={form}
          name="numberOfMember"
          label="Number of dev"
          type="number"
          min="0"
          component={Input}
        />
        <Field
          inline
          form={form}
          name="description"
          label="Description"
          component={Input}
        />
      </div>
      <div className="action-box">
        <Button
          size="large"
          htmlType="submit"
          type="primary"
          onClick={handleSubmit}
        >
                  OK
        </Button>
        <Button
          size="large"
          htmlType="button"
          onClick={this.props.onClose}
        >
                  Cancel
        </Button>
      </div>
    </Form>
  )

  render() {
    const initialValues = {
      name: '',
      startDate: null,
      endDate: null,
      projectManagerId: '',
      numberOfMember: '',
      description: ''
    }
    return (
      <Content>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={this._createProject}
          component={this._renderForm}
        />
      </Content>
    )
  }
}

export default NewProject
