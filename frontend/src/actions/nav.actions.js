export const account_menu_open = () => (dispatch) => {
  dispatch({ type: 'NAV_USER_MENU_OPEN' })
}

export const account_menu_close = () => (dispatch) => {
  dispatch({ type: 'NAV_USER_MENU_CLOSE' })
}
