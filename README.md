# redux-api-petitioner
Simple client-agnostic Redux API middleware.

# Installation
`npm i -S redux-api-petitioner`

# How it works

`redux-api-petitioner` allows you create AJAX requests to your API in a declerative way. It accepts your client instance, and works with it through the redux actions. I.e. you create requests via redux actions.

## Quick usage example

```javascript
// your action creator
import { generateReqTypes } from 'redux-api-petitioner';
import { USERS_LIST } from 'constants';

// is meant you have enabled a redux-thunk middleware
export const fetchUsers = () => dispatch => 
 dispatch({
    [GET]: {
      // this will create an array [USERS_LIST_REQUEST, USERS_LIST_SUCCESS, USERS_LIST_FAILURE] for the middleware
      actions: generateReqTypes(USERS_LIST),
      request: {
        url: '/api/v1/users'
      }
    }
  });
```

Middleware expects to receive three actions, which will be fired during the dispatched action (request) handling:
* Before the request: `USERS_LIST_REQUEST`
* Request success: `USERS_LIST_SUCCESS`
* Request error: `USERS_LIST_FAILURE`

It allows to handle each phase of the request in the declerative way using your reducer.

# Usage
`redux-api-petitioner` supports any api client, which conforms to the next requirement: your api library should provide the API with each request type in the **lower case**:
 `HEAD, GET, POST, PUT, PATCH, DELETE`. 
 
 ***Every method should return a promise***.
 
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

### reqMethods>Object
```javascript
import { reqMethods } from 'redux-api-petitioner';

const { HEAD, GET, POST, PUT, PATCH, DELETE } = reqMethods;
```
exports ES6 symbols for each request type: `HEAD, GET, POST, PUT, PATCH, DELETE`.

### generateActions: (actionType:String)

This helper function generates an array of three actions, required for the middleware. 
```javascript
import { generateActions } from 'redux-api-petitioner';

// In your action creator
 dispatch({
    [GET]: {
      // this will produce an array [USERS_LIST_REQUEST, USERS_LIST_SUCCESS, USERS_LIST_FAILURE] for the middleware
      actions: generateReqTypes(USERS_LIST),
      request: {
        url: '/api/v1/users'
      }
    }
  });
```
