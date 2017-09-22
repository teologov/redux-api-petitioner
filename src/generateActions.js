const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

/**
 * Generates request types array for the middleware options
 * @param {String} actionType
 * @return {Object}
 * Usage in your actions:
 * dispatch({
    [GET]: {
      // this will produce an array [USERS_LIST_REQUEST, USERS_LIST_SUCCESS, USERS_LIST_FAILURE] for the middleware
      actions: generateReqTypes(USERS_LIST),
      request: {
        url: '/api/v1/users'
      }
    }
  })
 */
export default function generateActions(actionType) {
  // order matters
  return [REQUEST, SUCCESS, FAILURE].reduce((arr, type) => {
    const reqType = `${actionType.toUpperCase()}_${type}`;
    arr.push(reqType)
    return arr;
  }, []);
}