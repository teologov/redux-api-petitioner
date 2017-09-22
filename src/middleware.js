import reqMethods from './reqMethods';

function getApiMethodSymbol(action = {}) {
  return Object.keys(reqMethods).filter((key) => {
    if (action[reqMethods[key]] !== undefined) {
      return {[key]: reqMethods[key]};
    }
  })[0];
}

function callApi(reqMethod, methodArgs) {
  return reqMethod.apply(null, methodArgs)
    .catch(response => Promise.reject(response));
}

const actionWith = (action, reqSymbol) => data => {
  const finalAction = { ...action, ...data };
  delete finalAction[reqSymbol];
  return finalAction;
};

const defaultResponseMapper = resp => resp;

const apiMiddleware = (reqClient, responseMapper = defaultResponseMapper) => store => next => action => {
  const requestMethod = getApiMethodSymbol(action);

  if (!requestMethod) {
    return next(action);
  }

  const requestSymbol = reqMethods[requestMethod];

  const { types, request } = action[requestSymbol];
  const fireAction = actionWith(action, requestSymbol);

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  // TODO: check url & data exist
  const { url, data, options } = request;

  const args = [];
  args.push(url);
  if (data) {
    args.push(data);
  }
  if (options) {
    args.push(options);
  }

  const [ requestType, successType, failureType ] = types;

  // dispatch starting of request
  next(fireAction({ type: requestType }))

  const methodFunc = reqClient[requestMethod.toLowerCase()];
  if (!methodFunc) {
    throw new Error(`Request method is not found for the method type ${requestMethod}`);
  }

  return callApi(methodFunc, args)
    .then(responseMapper)
    .then(data => {
      next(fireAction({ type: successType, data }));
    }, (resp = {}) => {
      const { data, statusText, status } = resp;
      next(fireAction({ type: failureType, error: data || statusText || 'Timeout error', status }));
  });
};

export default apiMiddleware;