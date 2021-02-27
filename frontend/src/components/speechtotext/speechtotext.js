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

/* export function speechtotextreturn(fieldid, trying, obj) {
  console.log(obj)
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  if (typeof SpeechRecognition === 'undefined') {
  } else {
    let result = ''
    const testinput = document.getElementById(fieldid)
    console.log(testinput)
    const speech = new SpeechRecognition()
    trying ? speech.stop() : speech.start()

    const onResult = (event) => {
      for (const res of event.results) {
        result = res[0].transcript
        console.log(result)
        obj({ nameinput: result })
        //testinput.value = result
      }
    }
    speech.continuous = true
    speech.interimResults = true
    speech.addEventListener('result', onResult)
  }
} */
