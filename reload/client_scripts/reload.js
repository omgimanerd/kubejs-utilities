// priority: 0

ClientEvents.tick((e) => {
  if (global.RELOAD_KEY === null || global.RELOAD_KEY === undefined) return
  if (!global.RELOAD_KEY.consumeClick()) return
  if (Client.currentScreen !== null) return
  if (Client.shiftDown) {
    e.player.sendData('reload_client')
  } else if (Client.altDown) {
    e.player.sendData('reload_startup')
  } else {
    e.player.sendData('reload')
  }
})
