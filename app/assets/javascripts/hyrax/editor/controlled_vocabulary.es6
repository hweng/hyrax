//= require handlebars-v4.0.5

import { FieldManager } from 'hydra-editor/field_manager'
import Handlebars from 'handlebars'

export default class ControlledVocabulary extends FieldManager {

  constructor(element) {
      let options = {
        /* callback to run after add is called */
        add:    null,
        /* callback to run after remove is called */
        remove: null,

        controlsHtml:      '<span class=\"input-group-btn field-controls\">',
        fieldWrapperClass: '.field-wrapper',
        warningClass:      '.has-warning',
        listClass:         '.listing',

        addHtml:           '<button type=\"button\" class=\"btn btn-link add\"><span class=\"glyphicon glyphicon-plus\"></span><span class="controls-add-text"></span></button>',
        addText:           'Add another',

        removeHtml:        '<button type=\"button\" class=\"btn btn-link remove\"><span class=\"glyphicon glyphicon-remove\"></span><span class="controls-remove-text"></span> <span class=\"sr-only\"> previous <span class="controls-field-name-text">field</span></span></button>',
        removeText:         'Remove',

        labelControls:      true,
      }
      super(element, options)
      this.workType = 'generic_work' // TODO: configure this
  }

  // Overrides FieldManager, because field manager uses the wrong selector
  addToList( event ) {
          event.preventDefault();
          let $listing = $(event.target).closest('.multi_value').find(this.listClass)
          let $activeField = $listing.children('li').last()

          if (this.inputIsEmpty($activeField)) {
              this.displayEmptyWarning();
          } else {
              this.clearEmptyWarning();
              $listing.append(this._newField($activeField));
          }

          this._manageFocus()
  }

  // Overrides FieldManager
  createNewField($activeField) {
      let fieldName = $activeField.find('input').data('attribute')
      console.log(`field name is ${fieldName}`)
      console.log($activeField)
      let $newField = this._newFieldTemplate(fieldName)
      this._addBehaviorsToInput($newField)
      return $newField
  }

  /* This gives the index for the editor */
  _maxIndex() {
      return $(this.fieldWrapperClass, this.element).size()
  }

  // Overridden because the input is not a direct child of activeField
  inputIsEmpty(activeField) {
      return activeField.find('input.multi-text-field').val() === ''
  }

  _newFieldTemplate(fieldName) {
      let index = this._maxIndex()
      let row = this._template()
      return $(row({ "workType": this.workType,
                        "name": fieldName,
                        "index": index,
                        "class": "controlled_vocabulary" }))
  }

  get _source() {
      return "<li class=\"field-wrapper input-group input-append\">" +
        "<input class=\"string {{class}} optional form-control {{workType}}_{{name}} form-control multi-text-field\" name=\"{{workType}}[{{name}}_attributes][{{index}}][hidden_label]\" value=\"\" id=\"{{workType}}_{{name}}_attributes_{{index}}_hidden_label\" data-attribute=\"{{name}}\" type=\"text\">" +
        "<input name=\"{{workType}}[{{name}}_attributes][{{index}}][id]\" value=\"\" id=\"{{workType}}_{{name}}_attributes_{{index}}_id\" type=\"hidden\" data-id=\"remote\">" +
        "<input name=\"{{workType}}[{{name}}_attributes][{{index}}][_destroy]\" id=\"{{workType}}_{{name}}_attributes_{{index}}__destroy\" value=\"\" data-destroy=\"true\" type=\"hidden\"><span class=\"input-group-btn field-controls\"><button class=\"btn btn-success add\"><i class=\"icon-white glyphicon-plus\"></i><span>Add</span></button></span></li>"
  }

  _template() {
      return Handlebars.compile(this._source)
  }

  _addBehaviorsToInput($newField) {
      let $newInput = $('input.multi-text-field', $newField)
      $newInput.focus()
      addAutocompleteToEditor($newInput)
      this.element.trigger("managed_field:add", $newInput)
  }

  // Overrides FieldManager
  // Instead of removing the line, we override this method to add a
  // '_destroy' hidden parameter
  removeFromList( event ) {
      event.preventDefault()
      let field = $(event.target).parents(this.fieldWrapperClass)
      field.find('[data-destroy]').val('true')
      field.hide()
      this.element.trigger("managed_field:remove", field)
  }
}
