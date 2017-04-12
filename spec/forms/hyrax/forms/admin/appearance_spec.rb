require 'spec_helper'

RSpec.describe Hyrax::Forms::Admin::Appearance do
  let(:form) { described_class.new({}) }

  describe "update!" do
    let(:block) { instance_double(ContentBlock) }

    before do
      allow(ContentBlock).to receive(:find_or_create_by).and_return(block)
    end

    it "calls update block 5 times" do
      expect(block).to receive(:update!).exactly(5).times
      form.update!
    end
  end

  describe ".permitted_params" do
    subject { described_class.permitted_params }

    it {
      is_expected.to eq [:header_background_color,
                         :header_text_color,
                         :link_color,
                         :footer_link_color,
                         :primary_button_background_color]
    }
  end
end
