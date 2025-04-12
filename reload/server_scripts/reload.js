// priority: 0
// Receiving a reload packet causes reload. Should not be packaged with the
// final modpack build.

NetworkEvents.dataReceived('reload_startup', (e) => {
  if (!e.player.hasPermissions(2)) return
  e.server.runCommand('/kubejs reload startup_scripts')
})

NetworkEvents.dataReceived('reload_client', (e) => {
  if (!e.player.hasPermissions(2)) return
  e.server.runCommand('/kubejs reload client_scripts')
})

NetworkEvents.dataReceived('reload', (e) => {
  if (!e.player.hasPermissions(2)) return
  e.server.runCommand('/reload')
})
