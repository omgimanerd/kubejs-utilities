// priority: 100

BlockEvents.rightClicked('minecraft:note_block', (e) => {
  const { player, item, block, level } = e
  // Only works if shift clicking with an empty hand. Otherwise, if the player
  // is holding a block it will place the block for an instant.
  if (!player.isCrouching() || item.id !== 'minecraft:air') return

  // Set the block note to the previous note
  // https://minecraft.fandom.com/wiki/Note_Block
  const TOTAL_NOTES = 25
  const properties = block.properties
  const newNote =
    (parseInt(properties.getOrDefault('note', 0), 10) + 24) % TOTAL_NOTES
  const instrument = properties.getOrDefault('instrument', 'harp')
  block.set(block.id, {
    instrument: new String(instrument),
    note: new String(newNote),
    powered: new String(properties.getOrDefault('powered', false)),
  })

  // Display the note particle like the normal right click event
  const soundEvent = `block.note_block.${instrument}`
  // Pitch formula, which is the same as the /playsound command
  const pitch = Math.pow(2, (newNote - 12) / 12)
  level.playSound(
    null, // player
    block.x,
    block.y,
    block.z,
    soundEvent,
    'blocks', // soundSource
    3, // volume
    pitch
  )
  const particlePos = block.pos.getCenter().add(0, 0.7, 0)
  level.spawnParticles(
    'minecraft:note',
    true, // overrideLimiter
    particlePos.x(), // x
    particlePos.y(), // y
    particlePos.z(), // z
    newNote / 24, // vx, used as pitch when count is 0
    0, // vy, unused
    0, // vz, unused
    0, // count, must be 0 for pitch argument to work
    1 // speed, must be 1 for pitch argument to work
  )

  // Cancel the default sound event
  e.cancel()
})
