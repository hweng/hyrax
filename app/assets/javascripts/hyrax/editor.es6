import RelationshipsControl from 'hyrax/relationships/control'
import SaveWorkControl from 'hyrax/save_work/save_work_control'
import AdminSetWidget from 'hyrax/editor/admin_set_widget'
import ControlledVocabulary from 'hyrax/editor/controlled_vocabulary'

export default class {
  constructor(element) {
    this.element = element
    this.adminSetWidget = new AdminSetWidget(element.find('select[id$="_admin_set_id"]'))
    this.sharingTabElement = $('#tab-share')

    this.controlledVocabularies()
    this.sharingTab()
    this.relationshipsControl()
    this.saveWorkControl()
    this.saveWorkFixed()
  }

  // initialize any controlled vocabulary widgets
  controlledVocabularies() {
    for (var controlled_field of this.element.find('.controlled_vocabulary.form-group')) {
      new ControlledVocabulary(controlled_field)
    }
  }

  // Display the sharing tab if they select an admin set that permits sharing
  sharingTab() {
    if(this.adminSetWidget && !this.adminSetWidget.isEmpty()) {
      this.adminSetWidget.on('change', () => this.sharingTabVisiblity(this.adminSetWidget.isSharing()))
      this.sharingTabVisiblity(this.adminSetWidget.isSharing())
    }
  }

  sharingTabVisiblity(visible) {
      if (visible)
         this.sharingTabElement.removeClass('hidden')
      else
         this.sharingTabElement.addClass('hidden')
  }

  relationshipsControl() {
      new RelationshipsControl(this.element.find('[data-behavior="child-relationships"]'),
                               'work_members_attributes',
                               'tmpl-child-work')
  }

  saveWorkControl() {
      new SaveWorkControl(this.element.find("#form-progress"), this.adminSetWidget)
  }

  saveWorkFixed() {
      // Fixedsticky will polyfill position:sticky
      this.element.find('#savewidget').fixedsticky()
  }
}
