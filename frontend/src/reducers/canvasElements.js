const canvasElements = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      let id = 0
      if (state.length > 0) {
        id = state[state.length - 1].id + 1
      }
      action.element.id = id
      return [...state, action.element]
    case 'UPDATE_ELEMENT':
      const updatedState = [...state]
      for (let i = 0; i < updatedState.length; i++) {
        if (action.id === updatedState[i].id) {
          updatedState[i].x = action.element.x
          updatedState[i].y = action.element.y
          updatedState[i].width = action.element.width
          updatedState[i].height = action.element.height
        }
      }
      return updatedState
    case 'REMOVE_ELEMENT':
      return state.filter(function (element) {
        return element.id !== action.id
      })
    case 'REMOVE_ALL_ELEMENTS':
      return []
    default:
      return state
  }
}

export default canvasElements
