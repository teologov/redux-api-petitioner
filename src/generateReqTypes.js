const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

/**
 * Generates request types object for the middleware options
 * @param {String} actionType
 * @return {Object}
 * Usage in your actions:
 * dispatch({
    [GET]: {
      // this will produce an object { USERS_LIST_REQUEST, USERS_LIST_SUCCESS, USERS_LIST_FAILURE } for the middleware
      types: generateReqTypes(USERS_LIST),
      request: {
        url: '/api/v1/users'
      }
    }
  })
 */
export default function generateReqTypes(actionType) {
  return [REQUEST, SUCCESS, FAILURE].reduce((obj, type) => {
    const reqType = `${actionType.toUpperCase()}_${type}`;
    obj[reqType] = reqType;
    return obj;
  }, {});
}