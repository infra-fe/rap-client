// http://redux.js.org/docs/api/applyMiddleware.html
const loggerMiddleware = ({ getState }: any) => {
  return (next: any) => (action: any) => {
    if (action.type === 'FETCH_START' || action.type === 'FETCH_STOP') { return next(action) }
    const newValue = next(action)
    return newValue
  }
}

export default loggerMiddleware
