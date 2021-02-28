const focusEditorState = (state = [], action) => {
  switch (action.type) {
    case 'FOCUS_EDITOR_STATE':
      return {
        editorStateId: action.editorStateId,
        editorState: action.editorState,
        inlineStyles: action.inlineStyles,
      }
    case 'UNFOCUS_EDITOR_STATE':
      return {
        editorStateId: undefined,
        editorState: undefined,
        inlineStyles: undefined,
      }
    default:
      return state
  }
}

export default focusEditorState
