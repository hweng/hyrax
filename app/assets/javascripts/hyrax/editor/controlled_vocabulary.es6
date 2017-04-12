import { FieldManager } from 'hydra-editor/field_manager'

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
  }

  // Overrides FieldManager
  createNewField($activeField) {
      let fieldName = $activeField.find('input').data('attribute');
      $newField = this._newFieldTemplate(fieldName);
      this._addBehaviorsToInput($newField)
      return $newField
  }

  /* This gives the index for the editor */
  _maxIndex() {
      return $(this.fieldWrapperClass, this.element).size();
  }

  // Overridden because the input is not a direct child of activeField
  inputIsEmpty(activeField) {
      return activeField.find('input.multi-text-field').val() === '';
  }

  _newFieldTemplate(fieldName) {
      let index = this._maxIndex();
      return $(template({ "name": fieldName, "index": index, "class": "controlled_vocabulary" }));
  }

  _addBehaviorsToInput($newField) {
      $newInput = $('input.multi-text-field', $newField);
      $newInput.focus();
      addAutocompleteToEditor($newInput);
      this.element.trigger("managed_field:add", $newInput);
  }

  // Overrides FieldManager
  // Instead of removing the line, we override this method to add a
  // '_destroy' hidden parameter
  removeFromList( event ) {
      event.preventDefault();
      let field = $(event.target).parents(this.fieldWrapperClass);
      field.find('[data-destroy]').val('true')
      field.hide();
      this.element.trigger("managed_field:remove", field);
  }
}
