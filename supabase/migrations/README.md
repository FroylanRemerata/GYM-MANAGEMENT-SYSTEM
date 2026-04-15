# Inventory Database Migrations

## Overview
These migrations create the database schema for the inventory management system in Astral Gym.

### Tables Created

#### 1. `inventory_items`
Stores information about inventory items (drinks).

**Columns:**
- `id` - UUID primary key
- `name` - Item name (e.g., "Sports Drink - Red Bull")
- `category` - Category: water, sports_drink, juice, energy_drink, other
- `quantity` - Current stock quantity
- `unit_price` - Price per unit
- `supplier` - Supplier name
- `reorder_level` - Threshold quantity for low-stock alerts
- `expiry_date` - Optional expiry date
- `last_restocked` - Timestamp of last restock
- `created_at` - Creation timestamp
- `updated_at` - Last modification timestamp
- `created_by` - User ID who created the item

**Constraints:**
- Quantity must be non-negative
- Unit price must be positive
- Category limited to predefined options
- Updates to `updated_at` happen automatically

**Indexes:**
- Category (for filtering by drink type)
- Created by (for audit trails)
- Created at (for sorting by date)

**RLS Policies:**
- **SELECT**: Anyone can view items
- **INSERT**: Admin and super_admin only
- **UPDATE**: Admin and super_admin only
- **DELETE**: Super_admin only

#### 2. `inventory_transactions`
Records all stock movements (sales, restocks, adjustments, damage).

**Columns:**
- `id` - UUID primary key
- `inventory_item_id` - Reference to inventory_items
- `transaction_type` - Type: sale, restock, adjustment, damage
- `quantity` - Quantity moved
- `notes` - Optional notes about the transaction
- `created_by` - User ID who recorded the transaction
- `created_at` - Transaction timestamp

**Constraints:**
- Quantity must be positive
- Transaction type limited to predefined options

**Indexes:**
- Item ID (for queries by item)
- Transaction type (for filtering)
- Created by (for audit trails)
- Created at (for chronological sorting)
- Composite index on item ID + created at (for performance)

**RLS Policies:**
- **SELECT**: Anyone can view transactions
- **INSERT**: Admin and super_admin only
- **DELETE**: Super_admin only (for audit revisions)

#### 3. `inventory_summary` (View)
Denormalized view for quick inventory overview.

**Columns:**
- All inventory_items columns
- `total_value` - Quantity × unit_price
- `status` - 'Low Stock' or 'OK' based on reorder_level
- `total_transactions` - Count of transactions for this item

### Automatic Features

#### Quantity Auto-Update Trigger
When a transaction is inserted, the inventory item's quantity is automatically updated:
- **Sale**: Quantity decreases
- **Restock**: Quantity increases, `last_restocked` updated
- **Adjustment**: Quantity changes (can be +/-)
- **Damage**: Quantity decreases

#### Timestamp Tracking
- `inventory_items.updated_at` automatically updates on modification
- All transaction timestamps are immutable (created_at only)

## How to Apply Migrations

### Option 1: Via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of each migration file (in order)
4. Execute each SQL file individually in the SQL Editor

### Option 2: Via Supabase CLI
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link to your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

### Option 3: Manual Execution
1. Connect to your Supabase database using a PostgreSQL client
2. Execute the SQL statements from the migration files in order

## Verification

After applying migrations, verify with these queries:

```sql
-- Check inventory_items table
SELECT * FROM inventory_items;

-- Check inventory_transactions table
SELECT * FROM inventory_transactions;

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename IN ('inventory_items', 'inventory_transactions');

-- Check view
SELECT * FROM inventory_summary;
```

## Testing

1. Create a test inventory item in the app's inventory page
2. Record a transaction (e.g., restock)
3. Verify the quantity updated automatically
4. Check the inventory_summary view shows correct totals
5. Test permission restrictions (try deleting as non-super_admin)

## Rollback

To remove these migrations (if needed):

```sql
DROP VIEW IF EXISTS inventory_summary;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS inventory_items;
DROP FUNCTION IF EXISTS update_inventory_quantity();
DROP FUNCTION IF EXISTS update_inventory_items_updated_at();
```

## Notes

- Migrations must be applied in order (items table first, then transactions)
- RLS policies enforce permissions at the database level
- Triggers ensure data consistency automatically
- The inventory_summary view is read-only (for queries only)
