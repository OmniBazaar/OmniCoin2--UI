function initWebsocket() {
  return eventChannel(emitter => {
    ws = new WebSocket('ws://127.0.0.1:8099')
    ws.onopen = () => {
      console.log('Connection opened')
    };
    ws.onerror = (error) => {
      console.log('WebSocket error ' + error)
    };
    ws.onmessage = (e) => {
      let msg = null;
      try {
        msg = JSON.parse(e.data)
      } catch(e) {
        console.error(`Error parsing : ${e.data}`)
      }
      if (msg) {
        console.log('MSG ', msg);
      }
    };
    // unsubscribe function
    return () => {
      console.log('Socket off')
    }
  })
}
export default function* wsSagas() {
  const channel = yield call(initWebsocket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
