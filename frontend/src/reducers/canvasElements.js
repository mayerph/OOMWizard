const canvasElements = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ELEMENT':
            return [
                ...state, action.element
            ]
        case 'REMOVE_ELEMENT':
            return state.filter(function (element) {
                return element.id !== action.id;
            })
        default:
            return state
    }
}

export default canvasElements
