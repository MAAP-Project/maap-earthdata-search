import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import AppLogo from '../../components/AppLogo/AppLogo'

const mapStateToProps = state => ({
  portal: state.portal
})

export const AppLogoContainer = ({
  portal
}) => {
  const edscEnv = getApplicationConfig().env

  return (
    <header className="app-logo">
      <AppLogo
        portal={portal}
        edscEnv={edscEnv}
      />
    </header>
  )
}

AppLogoContainer.propTypes = {
  portal: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(AppLogoContainer)
