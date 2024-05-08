/**
 * @author omgimanerd
 */

/**
 * Given a string or array of strings with XML-style opening and closing tags,
 * this helper returns a text component with the tag formatting applied.
 * Unlike real XML, this syntax allows for tags to be overlapped.
 *
 * Example usage:
 *   global.parseTextFormat(
 *     '<italic>hello <green> world!</green> it's me!</italic>')
 *   global.parseTextFormat(
 *     '<italic>italic <green> italic and green </italic> green </green>')
 *
 * @param {string} t
 * @returns {Internal.MutableComponent}
 */
global.parseTextFormat = (t) => {
  let modifiers = {}
  let component = Text.empty()
  const parts = t.split(/(<\/{0,1}[a-z]+>)/)
  for (const /** @type {string} */ part of parts) {
    let openMatch = part.match(/^<([a-z]+)>$/)
    let closeMatch = part.match(/^<\/([a-z]+)>$/)
    if (openMatch !== null && openMatch.length === 2) {
      let modifier = /** @type {string} */ openMatch[1]
      if (modifiers[modifier]) {
        console.warn(`Extra modifier ${modifier} in ${t}`)
      }
      modifiers[modifier] = true
    } else if (closeMatch !== null && closeMatch.length == 2) {
      let modifier = /** @type {string} */ closeMatch[1]
      if (!modifiers[modifier]) {
        console.warn(`Extra closing modifier ${modifier} in ${t}`)
      }
      delete modifiers[modifier]
    } else {
      let newComponent = Text.string(part)
      for (const [modifier, _] of Object.entries(modifiers)) {
        newComponent = newComponent[modifier]()
      }
      component = component.append(newComponent)
    }
  }
  return component
}
