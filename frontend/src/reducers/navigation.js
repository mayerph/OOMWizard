const INITIAL_STATE = {
  user_menu_open: false,
}

const navigation = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'NAV_USER_MENU_OPEN':
      return {
        ...state,
        user_menu_open: true,
      }
    case 'NAV_USER_MENU_CLOSE':
      return {
        ...state,
        user_menu_open: false,
      }
    default:
      return state
  }
}
export default navigation
