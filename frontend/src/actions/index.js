export const addElement = (element) => ({
  type: "ADD_ELEMENT",
  element,
});

export const removeElement = (id) => ({
  type: "REMOVE_ELEMENT",
  id,
});

export const getApi = () => {
  return (dispatch) => {
    fetch("https://api.imgflip.com/get_memes", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results.data.memes;
        //console.log(tileData);
        dispatch({ type: "GET_API", payload: tileData });
      });
  };
};
