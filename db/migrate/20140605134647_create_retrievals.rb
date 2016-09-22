class CreateRetrievals < ActiveRecord::Migration
  def change
    create_table :retrievals do |t|
      t.belongs_to :user
      t.text :jsondata

      t.timestamps null: true
    end
  end
end
