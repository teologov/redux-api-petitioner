export const GET = Symbol('Get Request');
export const POST = Symbol('Post Request');
export const PUT = Symbol('Put Request');
export const PATCH = Symbol('Patch Request');
export const DELETE = Symbol('Delete Request');
export const ERROR = Symbol('Request Error');

export default {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  ERROR
}