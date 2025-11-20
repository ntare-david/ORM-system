import axios from 'axios'

/**
 * @typedef {Object} AppError
 * @property {string} message
 * @property {string} [code]
 * @property {number} [status]
 */

/**
 * @param {unknown} error
 * @returns {AppError}
 */
export function handleApiError(error) {
  if (axios.isAxiosError && axios.isAxiosError(error)) {
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      return {
        message: 'Unable to connect to the server. Please check your internet connection and ensure the backend server is running.',
        code: error.code,
        status: error.response?.status,
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. Please try again.',
        code: error.code,
        status: error.response?.status,
      }
    }

    // Handle HTTP errors
    if (error.response) {
      const status = error.response.status
      let message = error.response.data?.detail || error.response.data?.message || error.message

      if (status === 404) {
        message = 'The requested resource was not found.'
      } else if (status === 500) {
        message = 'Server error. Please try again later.'
      } else if (status === 403) {
        message = 'You do not have permission to access this resource.'
      }

      return {
        message,
        code: error.code,
        status,
      }
    }

    return {
      message: error.message || 'An error occurred while making the request',
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'An unexpected error occurred',
  }
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  const appError = handleApiError(error)
  return appError.message
}

