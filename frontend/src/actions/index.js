export const addElement = (element) => ({
  type: "ADD_ELEMENT",
  element,
});

export const removeElement = (id) => ({
  type: "REMOVE_ELEMENT",
  id,
});

export const getApi = (text) => ({
  type: "GET_API",
  payload: text,
});
