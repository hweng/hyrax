import Default from './autocomplete/default'
import Work from './autocomplete/work'

export default class Autocomplete {
  // This is the initial setup for the form.
  setup (options) {
    var data = options.data
    var element = options.element
    switch (data.autocomplete) {
      case 'work':
        new Work(
          element,
          data.autocompleteUrl,
          data.id
        )
        break
      case 'based_near':
        new LinkedData(element, data.autocompleteUrl)
      default:
        new Default(element, data.autocompleteUrl)
        break
    }
  }
}
