import React from 'react'
import { connect } from 'react-redux'

export const data = (props) => {
  return (
    <div>data</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(data)