class AddPreferredCurrencyCodeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :preferred_currency_code, :string
  end
end
