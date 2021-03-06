import request from 'request-promise'
import { prepareExposeHeaders } from './prepareExposeHeaders'
import { getClientId, getEarthdataConfig, getApplicationConfig } from '../../../../sharedUtils/config'
import { getEchoToken } from '../urs/getEchoToken'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import { parseError } from '../parseError'

/**
 * Performs a search request and returns the result body and the JWT
 * @param {String} jwtToken JWT returned from edlAuthorizer
 * @param {String} url URL for to perform search
 */
export const doSearchRequest = async ({
  jwtToken,
  path,
  params,
  requestId,
  providedHeaders = {},
  bodyType = 'form',
  method = 'post'
}) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  try {
    // Headers we'll send with every request
    const requestHeaders = {
      'Client-Id': getClientId().lambda,
      ...providedHeaders
    }

    if (jwtToken) {
      // Support endpoints that have optional authentication
      requestHeaders['Echo-Token'] = await getEchoToken(jwtToken)
    }

    if (requestId) {
      // If the request doesnt come from the application, this is unlikely to be provided
      requestHeaders['CMR-Request-Id'] = requestId
    }

    const requestParams = {
      uri: `${getEarthdataConfig(cmrEnv()).cmrHost}${path}`,
      json: true,
      resolveWithFullResponse: true,
      time: true,
      headers: requestHeaders
    }

    let response
    if (method === 'post') {
      // CMR requires form data for POST requests, while service bridge requires JSON
      if (bodyType === 'form') {
        requestParams.form = params
      } else if (bodyType === 'json') {
        requestParams.body = params
      }

      response = await request.post(requestParams)
    } else {
      requestParams.qs = params

      response = await request.get(requestParams)
    }

    const { body, headers } = response
    const { 'cmr-took': cmrTook } = headers

    console.log(`Request ${requestId} completed external request in [reported: ${cmrTook} ms, observed: ${response.elapsedTime} ms]`)

    return {
      statusCode: response.statusCode,
      headers: {
        'cmr-hits': headers['cmr-hits'],
        'cmr-took': headers['cmr-took'],
        'cmr-request-id': headers['cmr-request-id'],
        'access-control-allow-origin': headers['access-control-allow-origin'],
        'access-control-expose-headers': prepareExposeHeaders(headers),
        'jwt-token': jwtToken
      },
      body: JSON.stringify(body)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}
