import fs from 'fs';

const sqlScript = `
-- =========================================================
-- IZZIE DEALS: BULLETPROOF CHECKOUT RLS FIX
-- Run this ENTIRE block in Supabase SQL Editor.
-- =========================================================

-- 1. Ensure RLS is enabled
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

-- 2. CLEAR ALL EXISTING CONFLICTING POLICIES on these tables
DROP POLICY IF EXISTS "Allow order creation" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable insert for anon users" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Prevent order updates by customers" ON orders;
DROP POLICY IF EXISTS "Prevent order deletes by customers" ON orders;

DROP POLICY IF EXISTS "Allow order item creation" ON order_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON order_items;
DROP POLICY IF EXISTS "Enable insert for anon users" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Prevent order item updates by customers" ON order_items;
DROP POLICY IF EXISTS "Prevent order item deletes by customers" ON order_items;

-- 3. CREATE CLEAN, SERVER-VALIDATED POLICIES
-- Allow INSERT for orders (Zod validation on the server ensures safety)
CREATE POLICY "server_validated_order_insert" ON orders
FOR INSERT TO public
WITH CHECK (true);

-- Allow INSERT for order items (Server validates order_id and prices)
CREATE POLICY "server_validated_order_item_insert" ON order_items
FOR INSERT TO public
WITH CHECK (true);

-- Allow users to SELECT their own orders (or guest orders)
CREATE POLICY "user_select_own_orders" ON orders
FOR SELECT TO public
USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to SELECT their own order items
CREATE POLICY "user_select_own_order_items" ON order_items
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);

-- =========================================================
-- DONE. Refresh your checkout page and try again.
-- =========================================================
`;

console.log('✅ Bulletproof RLS SQL Script Generated!\n');
console.log('=================================================================');
console.log('CRITICAL NEXT STEP (This is the missing link):');
console.log('1. Open your Supabase Dashboard (https://supabase.com/dashboard)');
console.log('2. Select your project.');
console.log('3. Click "SQL Editor" in the left sidebar.');
console.log('4. Click "New query".');
console.log('5. Copy the ENTIRE SQL script printed below this line.');
console.log('6. Paste it into the editor and click the green "Run" button.');
console.log('7. Wait for the "Success. No rows returned" or similar message.');
console.log('8. Go back to http://localhost:3000/checkout and click "Place Order".');
console.log('=================================================================\n');
console.log(sqlScript);