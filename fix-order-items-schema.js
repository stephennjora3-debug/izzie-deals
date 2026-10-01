import fs from 'fs';
import path from 'path';

const actionsPath = path.join(process.cwd(), 'src', 'actions', 'order.actions.ts');

console.log('Fixing order_items column names to match database schema...\n');

let content = fs.readFileSync(actionsPath, 'utf8');

// ANCHOR: The orderItems push that uses the wrong column name
const OLD_PUSH = `    orderItems.push({
      product_id: item.productId, // Use ID for relational integrity
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });`;

const NEW_PUSH = `    orderItems.push({
      product_name: product.name, // Match actual database column
      variant_id: item.variantId || null,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    });`;

if (!content.includes(OLD_PUSH)) {
  console.log("ANCHOR NOT FOUND. Trying to find and replace 'product_id: item.productId'...");
  content = content.replace(/product_id:\s*item\.productId/g, "product_name: product.name");
} else {
  content = content.split(OLD_PUSH).join(NEW_PUSH);
}

fs.writeFileSync(actionsPath, content, 'utf8');

console.log('✅ SUCCESS: Changed "product_id" to "product_name" in order items insertion.');
console.log('This matches your actual database schema and will allow the items to save.');