import React from 'react'
import { DatePicker } from 'antd'
import classNames from 'classnames'
import styled from 'styled-components'
import moment from 'moment'
import 'antd/es/date-picker/style/css'

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`
export const dateFormat = 'DD/MM/YYYY'

export default ({ field, form, className, value, ...props }) => {
  const handleChange = (date, dateString) => {
    field.onChange({ target: { value: moment(dateString, dateFormat), name: field.name } })
  }

  return (
    <StyledDatePicker
      {...props}
      value={field?.value || value}
      onChange={handleChange}
      className={classNames(className)}
    />
  )
}
