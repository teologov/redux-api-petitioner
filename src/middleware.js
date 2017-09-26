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

const apiMiddleware = (reqClient, responseMapper = defaultResponseMapper, errorMapper = defaultResponseMapper) => store => next => action => {
  const requestMethod = getApiMethodSymbol(action);

  if (!requestMethod) {
    return next(action);
  }

  const requestSymbol = reqMethods[requestMethod];

  const { actions, request } = action[requestSymbol];
  const fireAction = actionWith(action, requestSymbol);

  if (!Array.isArray(actions) || actions.length !== 3) {
    throw new Error('Expected an array of three actions.')
  }
  if (!actions.every(type => typeof type === 'string')) {
    throw new Error('Expected each action to be a string.')
  }

  const { url, data, options } = request;

  const args = [];

  if (!url) {
    throw new Error('Url should be provided');
  }
  args.push(url);
  
  // secondary parameters
  if (data) args.push(data);
  if (options) args.push(options);

  const [ requestType, successType, failureType ] = actions;

  // dispatch starting of request
  next(fireAction({ type: requestType }))

  const methodFunc = reqClient[requestMethod.toLowerCase()];
  if (!methodFunc) {
    throw new Error(`Request method is not found for the method type ${requestMethod}`);
  }

  return callApi(methodFunc, args)
    .then(responseMapper)
    .then(data => {
      return responseMapper(next(fireAction({ type: successType, data })));
    }, resp => {
      const error = errorMapper(resp);
      return errorMapper(next(fireAction({ type: failureType, error })));
  });
};

export default apiMiddleware;