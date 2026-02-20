// Mock database for Vercel deployment
// In production, this would be replaced with a proper database like Vercel Postgres
const mockDb = {
  prepare: (query: string) => ({
    run: (...args: any[]) => ({ changes: 0, lastInsertRowid: 0 }),
    get: (...args: any[]) => null,
    all: (...args: any[]) => [],
  }),
  exec: (query: string) => {},
};

const db = mockDb as any;

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS connected_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    shop_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at DATETIME,
    shop_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, platform, shop_id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    product_id TEXT NOT NULL,
    sku TEXT,
    name TEXT NOT NULL,
    category_id TEXT,
    category_name TEXT,
    price REAL,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES connected_accounts(id),
    UNIQUE(account_id, platform, product_id)
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    order_id TEXT NOT NULL,
    sale_date DATE NOT NULL,
    units_sold INTEGER NOT NULL,
    revenue REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES connected_accounts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_units REAL NOT NULL,
    confidence REAL,
    factors TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
  CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_name);
`);

export default db;

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface ConnectedAccount {
  id: number;
  user_id: number;
  platform: 'shopee' | 'tiktok' | 'lazada';
  shop_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  shop_name?: string;
  created_at: string;
}

export interface Product {
  id: number;
  account_id: number;
  platform: string;
  product_id: string;
  sku?: string;
  name: string;
  category_id?: string;
  category_name?: string;
  price?: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: number;
  account_id: number;
  product_id: number;
  platform: string;
  order_id: string;
  sale_date: string;
  units_sold: number;
  revenue: number;
  created_at: string;
}

export interface Forecast {
  id: number;
  product_id: number;
  forecast_date: string;
  predicted_units: number;
  confidence?: number;
  factors?: string;
  created_at: string;
}
