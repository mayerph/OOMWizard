const canvasElements = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      let id = 0
      if (state.length > 0) {
        id = state[state.length - 1].id + 1
      }
      action.element.id = id
      return [...state, action.element]
    case 'REMOVE_ELEMENT':
      return state.filter(function (element) {
        return element.id !== action.id
      })
    default:
      return state
  }
}

export default canvasElements
