const INITIAL_STATE = { tileData: [] }
const tileDataBackup = [
  {
    route: '/images/templates/Drake-Hotline-Bling.jpg',
    name: 'Image',
    author: ' author',
  },
]
const apiGetter = (state = [], action) => {
  switch (action.type) {
    case 'GET_API':
      console.log(action.apitype)
      console.log(action.mode)
      if (action.mode === 'api') {
        //console.log('in api')
        //console.log(action.payload)
        return { ...state, tileData: action.payload, apitype: action.apitype }
      } else if (action.mode === 'random') {
        //console.log('in random')
        //var rt = state.tileData;
        var rt = action.payload
        for (let i = rt.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[rt[i], rt[j]] = [rt[j], rt[i]]
        }
        //console.log(rt);
        return { ...state, tileData: rt, apitype: action.apitype }
      } else if (action.mode === 'sort') {
        //console.log('in sort')
        //console.log(action.payload)
        var st = action.payload.sort(function (a, b) {
          //console.log(a)
          //console.log(b)
          return b.name.length - a.name.length
        })
        return { ...state, tileData: st, apitype: action.apitype }
      } else {
        //console.log('in else')
        return { ...state, tileData: action.payload, apitype: action.apitype }
      }
      return { ...state, tileData: action.payload, apitype: action.apitype }

    case 'RANDOMIZE':
      //var rt = state.tileData;
      var rt = action.payload
      for (let i = rt.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[rt[i], rt[j]] = [rt[j], rt[i]]
      }
      //console.log(rt);
      return { ...state, tileData: rt, apitype: action.apitype }

    case 'SORTBYLIKES':
      var st = action.payload.sort(function (a, b) {
        return b.name.length - a.name.length
      })
      return { ...state, tileData: st, apitype: action.apitype }

    case 'AUTOPLAY':
      if (state.auto == '4000') {
        return { ...state, auto: '1000000000', apitype: action.apitype }
      } else {
        return { ...state, auto: '4000', apitype: action.apitype }
      }

    default:
      //console.log(state)
      //console.log('in here')
      if (state.length !== 0) {
        return { ...state }
      }
      return {
        ...state,
        tileData: tileDataBackup,
        auto: '1000000000',
        apitype: 'default',
      }
  }
}

export default apiGetter
