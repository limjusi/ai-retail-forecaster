import db from '../lib/db';

console.log('🗑️  Clearing all data...\n');

try {
  db.exec(`
    DELETE FROM forecasts;
    DELETE FROM sales;
    DELETE FROM products;
    DELETE FROM connected_accounts;
    DELETE FROM users;
  `);

  console.log('✅ All data cleared successfully!\n');
} catch (error) {
  console.error('❌ Error clearing data:', error);
  process.exit(1);
}
