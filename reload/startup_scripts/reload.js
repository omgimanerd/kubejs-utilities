// priority: 0
// Registers a keybind for reloading kubejs scripts. Requires Architectury.

if (!global.RELOAD_KEY) global.RELOAD_KEY = {}

ClientEvents.init(() => {
  const $KeyMappingRegistry = Java.loadClass(
    'dev.architectury.registry.client.keymappings.KeyMappingRegistry'
  )
  const $KeyMapping = Java.loadClass('net.minecraft.client.KeyMapping')
  const $GLFWKey = Java.loadClass('org.lwjgl.glfw.GLFW')

  global.RELOAD_KEY = new $KeyMapping(
    'key.kubejs.reload',
    $GLFWKey.GLFW_KEY_R,
    'key.categories.kubejs'
  )
  $KeyMappingRegistry.register(global.RELOAD_KEY)
})
