const INITIAL_STATE = { tileData: [] };
const tileDataBackup = [
  {
    url: "https://i.imgflip.com/4o6bxw.jpg",
    name: "Image",
    author: " author",
  },
];
const apiGetter = (state = [], action) => {
  switch (action.type) {
    //should return an array of the images from the api, but doing something wrong with the GET
    case "GET_API":
      //console.log(action.payload);
      return { ...state, tileData: action.payload };

    default:
      return { ...state, tileData: tileDataBackup };
  }
};

export default apiGetter;
