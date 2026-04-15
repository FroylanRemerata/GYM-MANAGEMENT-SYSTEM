-- Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('sale', 'restock', 'adjustment', 'damage')),
  quantity INTEGER NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT quantity_positive CHECK (quantity > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_inventory_transactions_item_id ON inventory_transactions(inventory_item_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_created_by ON inventory_transactions(created_by);
CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX idx_inventory_transactions_lookup ON inventory_transactions(inventory_item_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view all transactions (read-only for members, full access for admins)
CREATE POLICY "inventory_transactions_select" ON inventory_transactions
  FOR SELECT USING (true);

-- Only admins can create transactions
CREATE POLICY "inventory_transactions_insert" ON inventory_transactions
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );

-- Only super_admin can delete transactions (for audit purposes)
CREATE POLICY "inventory_transactions_delete" ON inventory_transactions
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- Create trigger function to automatically update inventory_items quantity
CREATE OR REPLACE FUNCTION update_inventory_quantity()
RETURNS TRIGGER AS $$
DECLARE
  quantity_change INTEGER;
BEGIN
  -- Determine quantity change based on transaction type
  CASE NEW.transaction_type
    WHEN 'sale' THEN
      quantity_change := -NEW.quantity;
    WHEN 'restock' THEN
      quantity_change := NEW.quantity;
    WHEN 'adjustment' THEN
      quantity_change := NEW.quantity; -- Can be positive or negative based on sign
    WHEN 'damage' THEN
      quantity_change := -NEW.quantity;
    ELSE
      quantity_change := 0;
  END CASE;

  -- Update the inventory item quantity
  UPDATE inventory_items
  SET quantity = quantity + quantity_change,
      last_restocked = CASE 
        WHEN NEW.transaction_type = 'restock' THEN NOW()
        ELSE last_restocked
      END,
      updated_at = NOW()
  WHERE id = NEW.inventory_item_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to execute quantity update after transaction insert
CREATE TRIGGER inventory_transactions_update_quantity_trigger
  AFTER INSERT ON inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_quantity();

-- Create view for inventory summary
CREATE OR REPLACE VIEW inventory_summary AS
SELECT 
  ii.id,
  ii.name,
  ii.category,
  ii.quantity,
  ii.unit_price,
  (ii.quantity * ii.unit_price) as total_value,
  ii.reorder_level,
  CASE WHEN ii.quantity <= ii.reorder_level THEN 'Low Stock' ELSE 'OK' END as status,
  ii.supplier,
  ii.expiry_date,
  ii.last_restocked,
  ii.created_at,
  ii.updated_at,
  (SELECT COUNT(*) FROM inventory_transactions WHERE inventory_item_id = ii.id) as total_transactions
FROM inventory_items ii;
