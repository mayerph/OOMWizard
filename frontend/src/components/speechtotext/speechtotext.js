//speech to text only works in chrome!
// this function takes the id of the field we want to chage and a variable telling it if we start or stop voice input
// once voice input is taken, it replaces the text inside of the text field
export function speechtotext(fieldid, trying) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  if (typeof SpeechRecognition === 'undefined') {
  } else {
    const testinput = document.getElementById(fieldid)
    console.log(testinput)
    const speech = new SpeechRecognition()
    trying ? speech.stop() : speech.start()

    const onResult = (event) => {
      for (const res of event.results) {
        let result = res[0].transcript
        console.log(result)
        testinput.value = result
      }
    }
    speech.continuous = true
    speech.interimResults = true
    speech.addEventListener('result', onResult)
  }
}

//this function is used purely to get the speech input as a string to use in other functions
//it changes the value inside of a hidden p element which value is then called later
export function speechtotextreturn(trying) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const results = document.getElementById('results')
  if (typeof SpeechRecognition === 'undefined') {
  } else {
    const speech = new SpeechRecognition()
    let result
    const stop = () => {
      speech.stop()
      console.log(result)
      console.log(results.value)
      return results.value
    }
    trying ? stop() : speech.start()

    const onResult = (event) => {
      for (const res of event.results) {
        result = res[0].transcript
        console.log(result)
        results.innerHTML = result
        console.log(results.innerHTML)
      }
    }
    speech.continuous = true
    speech.interimResults = true
    speech.addEventListener('result', onResult)
  }
}

export function speechtocontrol(fieldid) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

  let commands = ['upload', 'cancel']
  let grammar =
    '#JSGF V1.0; grammar commands; public <command> = ' +
    commands.join(' | ') +
    ' ;'

  if (typeof SpeechRecognition === 'undefined') {
  } else {
    const testinput = document.getElementById(fieldid)
    console.log(testinput)
    const speech = new SpeechRecognition()
    const recogList = new SpeechGrammarList()
    recogList.addFromString(grammar, 1)
    speech.continuous = false
    speech.interimResults = false
    speech.grammar = recogList

    speech.start()

    const onResult = (event) => {
      let result = event.results[0][0].transcript
      console.log(result)
      if (result === 'upload') {
        testinput.click()
      } else if (result === 'cancel') {
        alert('cancelling text control')
      } else {
        alert('unknown command')
      }
    }

    speech.addEventListener('result', onResult)
  }
}

export function speechtocontrolfour(one, two, three, four, com) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

  let commands = com
  let grammar =
    '#JSGF V1.0; grammar commands; public <command> = ' +
    commands.join(' | ') +
    ' ;'

  if (typeof SpeechRecognition === 'undefined') {
  } else {
    const speech = new SpeechRecognition()
    const recogList = new SpeechGrammarList()
    recogList.addFromString(grammar, 1)
    speech.continuous = false
    speech.interimResults = false
    speech.grammar = recogList

    speech.start()

    const onResult = (event) => {
      let result = event.results[0][0].transcript
      console.log(result)
      if (result === commands[0]) {
        console.log(one)
        document.getElementById(one).click()
      } else if (result === commands[1]) {
        console.log(two)
        document.getElementById(two).click()
      } else if (result === commands[2] || result === commands[3]) {
        console.log(three)
        document.getElementById(three).click()
      } else if (result === commands[4] || result === commands[5]) {
        console.log(four)
        document.getElementById(four).click()
      } else {
        alert('unknown command')
      }
    }

    speech.addEventListener('result', onResult)
  }
}
