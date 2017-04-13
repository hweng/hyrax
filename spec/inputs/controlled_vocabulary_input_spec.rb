require 'spec_helper'

RSpec.describe 'ControlledVocabularyInput', type: :input do
  let(:work) { GenericWork.new }
  let(:builder) { SimpleForm::FormBuilder.new(:generic_work, work, view, {}) }
  let(:input) { ControlledVocabularyInput.new(builder, :creator, nil, :multi_value, {}) }

  describe '#input' do
    before { allow(work).to receive(:[]).with(:creator).and_return([item1, item2]) }
    let(:item1) { double('value 1', rdf_label: ['Item 1'], rdf_subject: 'http://example.org/1', node?: false) }
    let(:item2) { double('value 2', rdf_label: ['Item 2'], rdf_subject: 'http://example.org/2') }

    it 'renders multi-value' do
      expect(input).to receive(:build_field).with(item1, 0)
      expect(input).to receive(:build_field).with(item2, 1)
      input.input({})
    end
  end

  describe '#build_field' do
    subject { input.send(:build_field, value, 0) }

    context 'for a resource' do
      let(:value) { double('value 1', rdf_label: ['Item 1'], rdf_subject: 'http://example.org/1', node?: false) }

      it 'renders multi-value' do
        expect(subject).to have_selector('input.generic_work_creator.multi_value')
        expect(subject).to have_field('generic_work[creator_attributes][0][hidden_label]', with: 'Item 1')
        expect(subject).to have_selector('input[name="generic_work[creator_attributes][0][id]"][value="http://example.org/1"]', visible: false)
        expect(subject).to have_selector('input[name="generic_work[creator_attributes][0][_destroy]"][value=""][data-destroy]', visible: false)
      end
    end
  end
end
