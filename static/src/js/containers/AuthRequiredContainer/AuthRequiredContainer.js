import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

export class AuthRequiredContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false
    }
  }

  componentWillMount() {
    const cmrEnvironment = cmrEnv()

    const token = get('authToken')

    const returnPath = window.location.href

    if (token === null) {
      window.location.href = `${getEarthdataConfig(cmrEnvironment).apiHost}/login?cmr_env=${cmrEnvironment}&state=${encodeURIComponent(returnPath)}`
    } else {
      this.setState({ isLoggedIn: true })
    }
  }

  render() {
    const { isLoggedIn } = this.state

    if (isLoggedIn) {
      const { children } = this.props
      return (
        <>
          { children }
        </>
      )
    }

    return (
      <div className="route-wrapper" />
    )
  }
}

AuthRequiredContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthRequiredContainer
