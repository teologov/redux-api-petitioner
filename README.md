# redux-api-petitioner
Simple client-agnostic Redux API middleware.

# Installation
`npm i -S redux-api-petitioner`

# Usage
`redux-api-petitioner` supports any api client, which conforms to the next requirement: your api library should provide the API with each request type in the **lower case**:
 `HEAD, GET, POST, PUT, PATCH, DELETE`. 
 
 ***Every method should return the promise***.
 
 For instance, [Axios](https://github.com/mzabriskie/axios) suits perfectly for it.
 ## Connection to the redux store

Full example with the redux store:
```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import apiMiddleware from 'redux-api-petitioner';

import reducers from './reducers';
import myApiClient from './myApiClient';

export default function configureStore(initialState = {}) {
  const middlewares = [
    apiMiddleware(
      apiClient,
      // response success mapper
      resp => resp.data,
      // response error mapper
      resp => resp.data
    ),
  ];

  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    reducers,
    initialState,
    compose(...enhancers),
  );

  return store;
}
```

# API


### apiMiddleware: (apiClient:Object, responseMapper:Function, errorMapper:Function)
`import apiMiddleware from 'redux-api-petitioner';`

**apiClient** - your api client instance

**responseMapper** - successful request response mapper to return only response back to reducer

**errorMapper** - bad request response mapper to provide only error back to your reducer


