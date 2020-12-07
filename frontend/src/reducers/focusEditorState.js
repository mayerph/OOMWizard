const focusEditorState = (state = [], action) => {
    switch (action.type) {
        case 'FOCUS_EDITOR_STATE':
            console.log('FOCUS_EDITOR_STATE ACTION', action.editorState)
            console.log('FOCUS_EDITOR_STATE STATE', state.editorState)
            return {
                editorStateId: action.editorStateId,
                editorState: action.editorState,
                inlineStyles: action.inlineStyles
            }
        case 'UNFOCUS_TEXT':
            return null
        default:
            return state
    }
}

export default focusEditorState
