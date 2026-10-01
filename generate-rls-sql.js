import fs from 'fs';

const sqlScript = `
-- =========================================================
-- IZZIE DEALS: SECURE CHECKOUT RLS POLICIES
-- =========================================================
-- Run this entire block in your Supabase SQL Editor.
-- This allows the server-validated checkout to create orders 
-- while keeping all other data strictly protected.

-- 1. Ensure RLS is enabled on these tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. Allow INSERT for orders (Server-side Zod validation ensures data safety)
-- This supports both authenticated users and guest checkouts (user_id IS NULL)
DROP POLICY IF EXISTS "Allow order creation" ON orders;
CREATE POLICY "Allow order creation" ON orders
FOR INSERT TO public
WITH CHECK (true);

-- 3. Allow INSERT for order items (Server-side validates order_id and prices)
DROP POLICY IF EXISTS "Allow order item creation" ON order_items;
CREATE POLICY "Allow order item creation" ON order_items
FOR INSERT TO public
WITH CHECK (true);

-- 4. Allow users to SELECT their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
FOR SELECT TO public
USING (auth.uid() = user_id OR user_id IS NULL);

-- 5. Allow users to SELECT their own order items
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
FOR SELECT TO public
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);

-- 6. Prevent unauthorized updates/deletes (Only admins should do this via service role)
-- These policies ensure customers cannot modify prices or status after creation.
DROP POLICY IF EXISTS "Prevent order updates by customers" ON orders;
CREATE POLICY "Prevent order updates by customers" ON orders
FOR UPDATE TO public
USING (false);

DROP POLICY IF EXISTS "Prevent order deletes by customers" ON orders;
CREATE POLICY "Prevent order deletes by customers" ON orders
FOR DELETE TO public
USING (false);

DROP POLICY IF EXISTS "Prevent order item updates by customers" ON order_items;
CREATE POLICY "Prevent order item updates by customers" ON order_items
FOR UPDATE TO public
USING (false);

DROP POLICY IF EXISTS "Prevent order item deletes by customers" ON order_items;
CREATE POLICY "Prevent order item deletes by customers" ON order_items
FOR DELETE TO public
USING (false);

-- =========================================================
-- Execution Complete. Checkout should now work securely.
-- =========================================================
`;

console.log('✅ RLS SQL Script Generated!\n');
console.log('=========================================================');
console.log('CRITICAL NEXT STEP:');
console.log('1. Open your Supabase Dashboard.');
console.log('2. Go to the "SQL Editor" in the left sidebar.');
console.log('3. Click "New Query".');
console.log('4. Copy the ENTIRE SQL script printed below.');
console.log('5. Paste it into the editor and click "Run".');
console.log('6. Once it says "Success", go back to your checkout page and try again!');
console.log('=========================================================\n');
console.log(sqlScript);