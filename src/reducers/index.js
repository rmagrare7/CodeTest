export default (state = 0, action) => {
    switch (action.type) {
      case 'update':
        return { ...state,
            restaurants: action.json}
      default:
        return state
    }
  }
  