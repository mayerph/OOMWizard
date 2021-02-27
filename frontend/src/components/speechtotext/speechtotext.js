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
