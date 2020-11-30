const INITIAL_STATE = { tileData: [] };
const tileDataBackup = [
  {
    url: "https://i.imgflip.com/4o6bxw.jpg",
    name: "Image",
    author: " author",
  },
  {
    url: "https://i.imgflip.com/4o6bxw.jpg",
    name: "Image",
    author: " author",
  },
  {
    url: "https://i.imgflip.com/4o6bxw.jpg",
    name: "Image",
    author: " author",
  },
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
      console.log("made it into GETAPI!");

      var tiles = [];

      async function fetchImages() {
        return await fetch("https://api.imgflip.com/get_memes", {
          method: "GET",
        })
          .then((res) => res.json())
          .then((results) => {
            var tileData = results.data.memes;
            return tileData;
          });
      }
      const { test } = fetchImages().then((tile) => (tiles = tile));
      console.log(test);
      console.log(tiles);

      return { ...state, tileData: tiles };

    default:
      return { ...state, tileData: tileDataBackup };
  }
};

export default apiGetter;
