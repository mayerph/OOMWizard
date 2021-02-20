const INITIAL_STATE = { tileData: [] }
const tileDataBackup = [
  {
    route: '/images/templates/Drake-Hotline-Bling.jpg',
    name: 'Image',
    author: ' author',
  },
]
//fisher yates algorithm https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function randomizeTD(td) {
  let rt = td
  for (let i = rt.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rt[i], rt[j]] = [rt[j], rt[i]]
  }
  return rt
}

function sortTD(td) {
  var st = td.sort(function (a, b) {
    return b.name.length - a.name.length
  })
  return st
}
const apiGetter = (state = [], action) => {
  switch (action.type) {
    case 'GET_API':
      console.log(action.apitype)
      console.log(action.mode)
      if (action.mode === 'api') {
        return { ...state, tileData: action.payload }
      } else if (action.mode === 'random') {
        return { ...state, tileData: randomizeTD(action.payload) }
      } else if (action.mode === 'sort') {
        return { ...state, tileData: sortTD(action.payload) }
      } else {
        return { ...state, tileData: action.payload }
      }
    case 'GET_API_MEME':
      console.log(action.apitype)
      console.log(action.mode)
      console.log(action.payload)
      if (action.mode === 'api') {
        return { ...state, tileDataMeme: action.payload }
      } else if (action.mode === 'random') {
        return { ...state, tileDataMeme: randomizeTD(action.payload) }
      } else if (action.mode === 'sort') {
        return { ...state, tileDataMeme: sortTD(action.payload) }
      } else {
        return { ...state, tileDataMeme: action.payload }
      }

    case 'AUTOPLAY':
      if (state.auto == '4000') {
        return { ...state, auto: '1000000000' }
      } else {
        return { ...state, auto: '4000' }
      }
    case 'ACTIVE':
      return { ...state, active: action.index }

    default:
      //console.log(state)
      //console.log('in here')
      if (state.length !== 0) {
        return { ...state }
      }
      return {
        ...state,
        tileData: tileDataBackup,
        tileDataMeme: tileDataBackup,
        auto: '1000000000',
        apitype: 'default',
      }
  }
}

export default apiGetter
