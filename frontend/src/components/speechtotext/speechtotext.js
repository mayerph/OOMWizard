//speech to text only works in chrome!
//speech implementation idea from
//https://www.twilio.com/blog/speech-recognition-browser-web-speech-api and https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
// this function takes the id of the field we want to chage and a variable telling it if we start or stop voice input
// once voice input is taken, it replaces the text inside of the text field
// this one is continuous, so it will keep on updating as long as there is continuous text input
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

//speech to text for the canvas, always grabs the last used text field for input
export function speechtotextcanvas(trying) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const textfields = document.querySelectorAll("span[data-text='true']")
  if (textfields.length > 0) {
    const lasttextfield = textfields[textfields.length - 1]
    if (typeof SpeechRecognition === 'undefined') {
    } else {
      const speech = new SpeechRecognition()
      let result
      trying ? speech.stop() : speech.start()

      const onResult = (event) => {
        for (const res of event.results) {
          result = res[0].transcript
          console.log(result)
          lasttextfield.innerHTML = result
          console.log(lasttextfield.innerHTML)
        }
      }
      speech.continuous = true
      speech.interimResults = true
      speech.addEventListener('result', onResult)
    }
  } else {
    alert('please create a text field first')
  }
}

//the following functions are to do certain commands (click on a button) using voice control
// These are non continuous, so they only listen for a phrase and we predefine some in the SpeechGrammarList
// once the user says the command, the action (button being pressed) is fired
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

export function speechtocontrolmultiple(items, com) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
  let buttons = items
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
      let result = event.results[0][0].transcript.toLowerCase()
      console.log(result)
      let clicked = false
      for (let i = 0; i < commands.length; i++) {
        if (result === commands[i]) {
          if (!document.getElementById(buttons[i]).disabled) {
            document.getElementById(buttons[i]).click()
          } else {
            alert('please select a text field')
          }
          clicked = true
        }
      }
      if (!clicked) {
        alert('unknown command')
      }

      /* if (result === commands[0]) {
        document.getElementById(buttons[0]).click()
      } else if (result === commands[1]) {
        document.getElementById(buttons[1]).click()
      } else if (result === commands[2]) {
        document.getElementById(buttons[2]).click()
      } else if (result === commands[3]) {
        document.getElementById(buttons[3]).click()
      } else {
        alert('unknown command')
      } */
    }

    speech.addEventListener('result', onResult)
  }
}

//speechcontrol just for the homepage
export function speechtocontrolmultiplehome(items, com) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent
  let buttons = items
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
      let result = event.results[0][0].transcript.toLowerCase()
      console.log(result)
      let clicked = false
      for (let i = 0; i < commands.length; i++) {
        if (result === commands[i]) {
          if (!document.getElementById(buttons[i]).disabled) {
            if (buttons[i] === 'overviewsort') {
              document.getElementById('resultstwo').innerHTML = commands[i]
            } else if (buttons[i] === 'overviewselect') {
              console.log('in overview select')
              if (commands[i] === 'show memes') {
                document.getElementById('resultstwo').innerHTML =
                  'showing omm_memes'
              } else if (commands[i] === 'show templates') {
                document.getElementById('resultstwo').innerHTML =
                  'showing omm_templates'
              } else if (commands[i] === 'show gif memes') {
                document.getElementById('resultstwo').innerHTML =
                  'showing omm_gif_memes'
              } else if (commands[i] === 'show gif templates') {
                document.getElementById('resultstwo').innerHTML =
                  'showing omm_gif_templates'
              } else if (commands[i] === 'show video memes') {
                document.getElementById('resultstwo').innerHTML =
                  'showing omm_video_memes'
              } else if (commands[i] === 'show video templates') {
                document.getElementById('resultstwo').innerHTML =
                  'showing omm_video_templates'
              } else if (commands[i] === 'show image flip') {
                document.getElementById('resultstwo').innerHTML =
                  'showing ImgFlip'
              }
            } else {
              document.getElementById(buttons[i]).click()
            }
          } else {
            alert('please select a text field')
          }
          clicked = true
        }
      }
      if (!clicked) {
        alert('unknown command')
      }
    }

    speech.addEventListener('result', onResult)
  }
}
