/**
 * This file contains tests for parseTextFormat.js.
 * It is suffixed .cjs as an CommonJS module to prevent it from being loaded by
 * KubeJS. It should be invoked with node for testing.
 */

// Mock Text object to be used by parseTextFormat.js
global.Text = {
  empty: function () {
    return new MockComponent('')
  },
  string: function (str) {
    return new MockComponent(str)
  },
}

/**
 * MockComponent simulates Minecraft's TextComponent behavior for testing.
 * It tracks applied formatting and child components, allowing verification
 * of text formatting operations.
 *
 * @class
 * @param {string} text - The text content of this component
 */
function MockComponent(text) {
  const self = this
  this.text = text
  this.formatters = []
  this.children = []

  // Attach available formatting methods to the MockComponent.
  ;[
    'aqua',
    'black',
    'blue',
    'bold',
    'darkAqua',
    'darkBlue',
    'darkGray',
    'darkGreen',
    'darkPurple',
    'darkRed',
    'gold',
    'gray',
    'green',
    'italic',
    'lightPurple',
    'red',
    'white',
    'yellow',
  ].forEach((method) => {
    self[method] = () => {
      self.formatters.push(method)
      return self
    }
  })

  this.append = (other) => {
    this.children.push(other)
    return this
  }

  this.toString = () => {
    const formatString = this.formatters.length
      ? `[${this.formatters.join(',')}]`
      : ''
    const childString = self.children.map((child) => child.toString()).join('+')
    return formatString + self.text + childString
  }
}

/**
 * ErrorCatcher captures console.warn messages for testing error conditions.
 * Used to verify that parseTextFormat properly warns on invalid inputs.
 *
 * @class
 */
function ErrorCatcher() {
  this.errors = []

  this.catch = global.console.warn = (message) => {
    this.errors.push(message)
  }

  this.reset = () => {
    this.errors = []
  }
}

// Load the parse-text-format library.
require('../parseTextFormat.js')

const errors = new ErrorCatcher()

const expect = (a, b) => {
  if (a !== b) {
    throw new Error(`Expected ${a} to equal ${b}`)
  }
}

// Test case 1: Invalid input
expect(global.parseTextFormat(null).toString(), '')
expect(errors.errors.length, 1)
expect(errors.errors[0], 'parseTextFormat received non-string input: null')
errors.reset()

// Test case 2: Basic single tag formatting
expect(
  global.parseTextFormat('<italic>hello world</italic>').toString(),
  '[italic]hello world'
)
expect(errors.errors.length, 0)

// Test case 3: Nested tags
expect(
  global.parseTextFormat('<bold><red>hello world</red></bold>').toString(),
  '[bold,red]hello world'
)
expect(errors.errors.length, 0)

// Test case 4: Multiple nested segments
expect(
  global
    .parseTextFormat('<italic>hello <green>beautiful</green> world</italic>')
    .toString(),
  '[italic]hello +[italic,green]beautiful+[italic] world'
)
expect(errors.errors.length, 0)

// Test case 5: Overlapping tags (outer tag closes first)
expect(
  global
    .parseTextFormat('<italic>italic <green>both</italic> green</green>')
    .toString(),
  '[italic]italic +[italic,green]both+[green] green'
)
expect(errors.errors.length, 0)

// Test case 6: Multiple formatting with text between
expect(
  global.parseTextFormat('<red>Red</red> plain <blue>Blue</blue>').toString(),
  '[red]Red+ plain +[blue]Blue'
)
expect(errors.errors.length, 0)

// Test case 7: Complex nested formatting
expect(
  global
    .parseTextFormat(
      '<bold>Bold <italic>and italic <red>and red</red> and italic</italic> and bold</bold>'
    )
    .toString(),
  '[bold]Bold +[bold,italic]and italic +[bold,italic,red]and red+[bold,italic] and italic+[bold] and bold'
)
expect(errors.errors.length, 0)

// Test case 8: Multiple color changes
expect(
  global
    .parseTextFormat(
      '<blue>Blue <red>Red <green>Green</green> Red</red> Blue</blue>'
    )
    .toString(),
  '[blue]Blue +[blue,red]Red +[blue,red,green]Green+[blue,red] Red+[blue] Blue'
)
expect(errors.errors.length, 0)

// Test case 9: Unknown modifier
expect(global.parseTextFormat('<unknown>test</unknown>').toString(), 'test')
expect(errors.errors.length, 1)
expect(errors.errors[0], 'Unknown modifier unknown in <unknown>test</unknown>')
errors.reset()

// Test case 10: Extra closing modifier
expect(global.parseTextFormat('<red>test</red></red>').toString(), '[red]test')
expect(errors.errors.length, 1)
expect(errors.errors[0], 'Extra closing modifier red in <red>test</red></red>')
errors.reset()

// Test case 11: Missing closing modifier
expect(global.parseTextFormat('<red>test').toString(), '[red]test')
expect(errors.errors.length, 1)
expect(errors.errors[0], 'Unclosed modifier red in <red>test')
errors.reset()

// Test case 12: Duplicate modifier
expect(
  global.parseTextFormat('<red><red>test</red></red>').toString(),
  '[red]test'
)
expect(errors.errors.length, 2)
expect(errors.errors[0], 'Extra modifier red in <red><red>test</red></red>')
expect(
  errors.errors[1],
  'Extra closing modifier red in <red><red>test</red></red>'
)
errors.reset()

// Test case 13: Multiple errors
expect(
  global.parseTextFormat('<red><unknown>test</unknown></red></red>').toString(),
  '[red]test'
)
expect(errors.errors.length, 2)
expect(
  errors.errors[0],
  'Unknown modifier unknown in <red><unknown>test</unknown></red></red>'
)
expect(
  errors.errors[1],
  'Extra closing modifier red in <red><unknown>test</unknown></red></red>'
)
errors.reset()

// Test case 14: Multiple unclosed modifiers
expect(global.parseTextFormat('<red><blue>test').toString(), '[red,blue]test')
expect(errors.errors.length, 2)
expect(errors.errors[0], 'Unclosed modifier red in <red><blue>test')
expect(errors.errors[1], 'Unclosed modifier blue in <red><blue>test')
errors.reset()

console.info('All tests passed!')
