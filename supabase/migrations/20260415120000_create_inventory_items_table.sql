-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('water', 'sports_drink', 'juice', 'energy_drink', 'other')),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC(10, 2) NOT NULL,
  supplier VARCHAR(255),
  reorder_level INTEGER NOT NULL DEFAULT 20,
  expiry_date DATE,
  last_restocked TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT quantity_non_negative CHECK (quantity >= 0),
  CONSTRAINT unit_price_positive CHECK (unit_price > 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_inventory_items_category ON inventory_items(category);
CREATE INDEX idx_inventory_items_created_by ON inventory_items(created_by);
CREATE INDEX idx_inventory_items_created_at ON inventory_items(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view all inventory items (read-only for members, full access for admins)
CREATE POLICY "inventory_items_select" ON inventory_items
  FOR SELECT USING (true);

-- Only admins can create inventory items
CREATE POLICY "inventory_items_insert" ON inventory_items
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );

-- Only admins can update inventory items
CREATE POLICY "inventory_items_update" ON inventory_items
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  ) WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );

-- Only super_admin can delete inventory items
CREATE POLICY "inventory_items_delete" ON inventory_items
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'super_admin'
    )
  );

-- Create trigger to update the updated_at timestamp on modification
CREATE OR REPLACE FUNCTION update_inventory_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_items_updated_at_trigger
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_items_updated_at();
