// Mock data for Vercel deployment
export const generateMockSalesData = () => {
  const sales = [];
  const now = new Date();
  
  // Generate 365 days of sales data
  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random sales for each day
    const numSales = Math.floor(Math.random() * 20) + 5;
    for (let j = 0; j < numSales; j++) {
      sales.push({
        id: sales.length + 1,
        account_id: Math.floor(Math.random() * 3) + 1,
        product_id: Math.floor(Math.random() * 42) + 1,
        platform: ['shopee', 'tiktok', 'lazada'][Math.floor(Math.random() * 3)],
        order_id: `ORDER_${sales.length + 1}`,
        sale_date: dateStr,
        units_sold: Math.floor(Math.random() * 10) + 1,
        revenue: (Math.random() * 500) + 50,
      });
    }
  }
  
  return sales;
};

export const mockProducts = [
  { id: 1, name: 'Wireless Earbuds Pro', category_name: 'electronics', platform: 'shopee', price: 89.99 },
  { id: 2, name: 'Smart Watch X1', category_name: 'electronics', platform: 'tiktok', price: 199.99 },
  { id: 3, name: 'Phone Case Premium', category_name: 'electronics', platform: 'lazada', price: 29.99 },
  { id: 4, name: 'Portable Charger 20000mAh', category_name: 'electronics', platform: 'shopee', price: 45.99 },
  { id: 5, name: 'Bluetooth Speaker', category_name: 'electronics', platform: 'tiktok', price: 79.99 },
  { id: 6, name: 'USB-C Cable 3-Pack', category_name: 'electronics', platform: 'lazada', price: 19.99 },
  { id: 7, name: 'Laptop Stand', category_name: 'electronics', platform: 'shopee', price: 39.99 },
  { id: 8, name: 'Wireless Mouse', category_name: 'electronics', platform: 'tiktok', price: 34.99 },
  { id: 9, name: 'Keyboard Mechanical', category_name: 'electronics', platform: 'lazada', price: 129.99 },
  { id: 10, name: 'Webcam HD 1080p', category_name: 'electronics', platform: 'shopee', price: 69.99 },
  { id: 11, name: 'Screen Protector', category_name: 'electronics', platform: 'tiktok', price: 14.99 },
  { id: 12, name: 'Phone Holder Car Mount', category_name: 'electronics', platform: 'lazada', price: 24.99 },
  { id: 13, name: 'LED Desk Lamp', category_name: 'electronics', platform: 'shopee', price: 49.99 },
  { id: 14, name: 'Tablet Stand', category_name: 'electronics', platform: 'tiktok', price: 29.99 },
  { id: 15, name: 'Headphone Stand', category_name: 'electronics', platform: 'lazada', price: 19.99 },
  { id: 16, name: 'Cable Organizer', category_name: 'electronics', platform: 'shopee', price: 12.99 },
  { id: 17, name: 'Power Strip USB', category_name: 'electronics', platform: 'tiktok', price: 34.99 },
  { id: 18, name: 'Phone Ring Holder', category_name: 'electronics', platform: 'lazada', price: 9.99 },
  { id: 19, name: 'Casual T-Shirt', category_name: 'fashion', platform: 'shopee', price: 19.99 },
  { id: 20, name: 'Denim Jeans', category_name: 'fashion', platform: 'tiktok', price: 49.99 },
  { id: 21, name: 'Sneakers Sport', category_name: 'fashion', platform: 'lazada', price: 79.99 },
  { id: 22, name: 'Backpack Travel', category_name: 'fashion', platform: 'shopee', price: 59.99 },
  { id: 23, name: 'Sunglasses UV', category_name: 'fashion', platform: 'tiktok', price: 29.99 },
  { id: 24, name: 'Watch Analog', category_name: 'fashion', platform: 'lazada', price: 89.99 },
  { id: 25, name: 'Belt Leather', category_name: 'fashion', platform: 'shopee', price: 24.99 },
  { id: 26, name: 'Hat Cap', category_name: 'fashion', platform: 'tiktok', price: 19.99 },
  { id: 27, name: 'Face Cream SPF50', category_name: 'beauty', platform: 'lazada', price: 34.99 },
  { id: 28, name: 'Lipstick Matte', category_name: 'beauty', platform: 'shopee', price: 14.99 },
  { id: 29, name: 'Serum Vitamin C', category_name: 'beauty', platform: 'tiktok', price: 29.99 },
  { id: 30, name: 'Face Mask Sheet 10pcs', category_name: 'beauty', platform: 'lazada', price: 19.99 },
  { id: 31, name: 'Perfume 50ml', category_name: 'beauty', platform: 'shopee', price: 49.99 },
  { id: 32, name: 'Makeup Brush Set', category_name: 'beauty', platform: 'tiktok', price: 39.99 },
  { id: 33, name: 'Throw Pillow', category_name: 'home-living', platform: 'lazada', price: 24.99 },
  { id: 34, name: 'Bed Sheet Set', category_name: 'home-living', platform: 'shopee', price: 59.99 },
  { id: 35, name: 'Storage Box', category_name: 'home-living', platform: 'tiktok', price: 19.99 },
  { id: 36, name: 'Wall Clock', category_name: 'home-living', platform: 'lazada', price: 29.99 },
  { id: 37, name: 'Action Figure', category_name: 'toys', platform: 'shopee', price: 34.99 },
  { id: 38, name: 'Building Blocks Set', category_name: 'toys', platform: 'tiktok', price: 49.99 },
  { id: 39, name: 'Puzzle 1000pcs', category_name: 'toys', platform: 'lazada', price: 24.99 },
  { id: 40, name: 'Instant Noodles 12-Pack', category_name: 'groceries', platform: 'shopee', price: 14.99 },
  { id: 41, name: 'Coffee Beans 500g', category_name: 'groceries', platform: 'tiktok', price: 29.99 },
  { id: 42, name: 'Snack Mix Box', category_name: 'groceries', platform: 'lazada', price: 19.99 },
];

const mockSales = generateMockSalesData();

export const createMockDb = () => {
  return {
    prepare: (query: string) => ({
      run: (...args: any[]) => ({ changes: 1, lastInsertRowid: 1 }),
      get: (...args: any[]) => {
        const queryLower = query.toLowerCase();
        
        // Handle sales overview queries
        if (queryLower.includes('sum(revenue)') && queryLower.includes('sum(units_sold)')) {
          const totalRevenue = mockSales.reduce((sum, s) => sum + s.revenue, 0);
          const totalUnits = mockSales.reduce((sum, s) => sum + s.units_sold, 0);
          const totalOrders = mockSales.length;
          
          return {
            totalRevenue,
            totalUnits,
            totalOrders,
            revenue: totalRevenue,
            units: totalUnits,
            orders: totalOrders,
          };
        }
        
        // Handle top category query
        if (queryLower.includes('category_name') && queryLower.includes('limit 1')) {
          return { category: 'electronics', revenue: 150000 };
        }
        
        // Handle top platform query
        if (queryLower.includes('platform') && queryLower.includes('limit 1')) {
          return { platform: 'tiktok', revenue: 180000 };
        }
        
        return null;
      },
      all: (...args: any[]) => {
        const queryLower = query.toLowerCase();
        
        // Handle sales by date queries
        if (queryLower.includes('sale_date') && queryLower.includes('group by')) {
          const salesByDate: any = {};
          mockSales.forEach(sale => {
            if (!salesByDate[sale.sale_date]) {
              salesByDate[sale.sale_date] = { revenue: 0, units: 0, orders: 0 };
            }
            salesByDate[sale.sale_date].revenue += sale.revenue;
            salesByDate[sale.sale_date].units += sale.units_sold;
            salesByDate[sale.sale_date].orders += 1;
          });
          
          return Object.entries(salesByDate)
            .map(([date, data]: [string, any]) => ({
              date,
              period: date,
              revenue: data.revenue,
              units: data.units,
              orders: data.orders,
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-90); // Last 90 days
        }
        
        // Handle top products query
        if (queryLower.includes('p.name') && queryLower.includes('totalrevenue desc')) {
          const productSales: any = {};
          mockSales.forEach(sale => {
            const product = mockProducts.find(p => p.id === sale.product_id);
            if (product) {
              const key = `${product.id}_${sale.platform}`;
              if (!productSales[key]) {
                productSales[key] = {
                  name: product.name,
                  category: product.category_name,
                  platform: sale.platform,
                  totalRevenue: 0,
                  totalUnits: 0,
                };
              }
              productSales[key].totalRevenue += sale.revenue;
              productSales[key].totalUnits += sale.units_sold;
            }
          });
          
          const sorted = Object.values(productSales).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue);
          return queryLower.includes('asc') ? sorted.slice(-5) : sorted.slice(0, 10);
        }
        
        // Handle top categories query
        if (queryLower.includes('category_name') && queryLower.includes('group by')) {
          const categorySales: any = {};
          mockSales.forEach(sale => {
            const product = mockProducts.find(p => p.id === sale.product_id);
            if (product) {
              if (!categorySales[product.category_name]) {
                categorySales[product.category_name] = { category: product.category_name, revenue: 0, units: 0 };
              }
              categorySales[product.category_name].revenue += sale.revenue;
              categorySales[product.category_name].units += sale.units_sold;
            }
          });
          
          return Object.values(categorySales).sort((a: any, b: any) => b.revenue - a.revenue);
        }
        
        // Handle platform queries
        if (queryLower.includes('platform') && queryLower.includes('group by')) {
          const platformSales: any = {};
          mockSales.forEach(sale => {
            if (!platformSales[sale.platform]) {
              platformSales[sale.platform] = { platform: sale.platform, revenue: 0, units: 0, orders: 0 };
            }
            platformSales[sale.platform].revenue += sale.revenue;
            platformSales[sale.platform].units += sale.units_sold;
            platformSales[sale.platform].orders += 1;
          });
          
          return Object.values(platformSales);
        }
        
        return [];
      },
    }),
    exec: (query: string) => {},
  };
};
