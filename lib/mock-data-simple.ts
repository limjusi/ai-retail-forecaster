// Simplified mock data that always returns data regardless of query
export const generateSimpleMockData = () => {
  const now = new Date();
  const sales = [];
  
  // Generate 90 days of sales
  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Multiple sales per day
    for (let j = 0; j < 15; j++) {
      sales.push({
        id: sales.length + 1,
        sale_date: dateStr,
        platform: ['shopee', 'tiktok', 'lazada'][j % 3],
        revenue: Math.random() * 300 + 100,
        units_sold: Math.floor(Math.random() * 5) + 1,
        product_id: (j % 42) + 1,
        category_name: ['electronics', 'fashion', 'beauty', 'home-living', 'toys', 'groceries'][j % 6],
      });
    }
  }
  
  return sales;
};

const mockSalesData = generateSimpleMockData();

// Pre-calculated aggregations for fast responses
const totalRevenue = mockSalesData.reduce((sum, s) => sum + s.revenue, 0);
const totalUnits = mockSalesData.reduce((sum, s) => sum + s.units_sold, 0);
const totalOrders = mockSalesData.length;

// Platform aggregations
const platformData = {
  shopee: { totalRevenue: 0, totalUnits: 0, totalOrders: 0 },
  tiktok: { totalRevenue: 0, totalUnits: 0, totalOrders: 0 },
  lazada: { totalRevenue: 0, totalUnits: 0, totalOrders: 0 },
};

mockSalesData.forEach(sale => {
  platformData[sale.platform as keyof typeof platformData].totalRevenue += sale.revenue;
  platformData[sale.platform as keyof typeof platformData].totalUnits += sale.units_sold;
  platformData[sale.platform as keyof typeof platformData].totalOrders += 1;
});

export const createSimpleMockDb = () => {
  return {
    prepare: () => ({
      run: () => ({ changes: 1, lastInsertRowid: 1 }),
      get: () => ({
        totalRevenue,
        totalUnits,
        totalOrders,
        revenue: totalRevenue,
        units: totalUnits,
        orders: totalOrders,
        category: 'electronics',
        platform: 'tiktok',
      }),
      all: () => {
        // Always return some data
        return [
          // Platform data
          { platform: 'shopee', totalRevenue: platformData.shopee.totalRevenue, totalUnits: platformData.shopee.totalUnits, totalOrders: platformData.shopee.totalOrders, revenue: platformData.shopee.totalRevenue, units: platformData.shopee.totalUnits, orders: platformData.shopee.totalOrders },
          { platform: 'tiktok', totalRevenue: platformData.tiktok.totalRevenue, totalUnits: platformData.tiktok.totalUnits, totalOrders: platformData.tiktok.totalOrders, revenue: platformData.tiktok.totalRevenue, units: platformData.tiktok.totalUnits, orders: platformData.tiktok.totalOrders },
          { platform: 'lazada', totalRevenue: platformData.lazada.totalRevenue, totalUnits: platformData.lazada.totalUnits, totalOrders: platformData.lazada.totalOrders, revenue: platformData.lazada.totalRevenue, units: platformData.lazada.totalUnits, orders: platformData.lazada.totalOrders },
          
          // Top products
          { name: 'Wireless Earbuds Pro', category: 'electronics', platform: 'tiktok', totalRevenue: 15000, totalUnits: 250 },
          { name: 'Smart Watch X1', category: 'electronics', platform: 'shopee', totalRevenue: 12000, totalUnits: 180 },
          { name: 'Phone Case Premium', category: 'electronics', platform: 'lazada', totalRevenue: 8000, totalUnits: 300 },
          { name: 'Portable Charger', category: 'electronics', platform: 'tiktok', totalRevenue: 7500, totalUnits: 200 },
          { name: 'Bluetooth Speaker', category: 'electronics', platform: 'shopee', totalRevenue: 6800, totalUnits: 150 },
          
          // Categories
          { category: 'electronics', revenue: 45000, units: 1200 },
          { category: 'fashion', revenue: 28000, units: 800 },
          { category: 'beauty', revenue: 22000, units: 650 },
          { category: 'home-living', revenue: 15000, units: 400 },
          { category: 'toys', revenue: 12000, units: 350 },
          { category: 'groceries', revenue: 8000, units: 500 },
          
          // Sales by date (last 30 days)
          ...mockSalesData.slice(-30).reduce((acc: any[], sale) => {
            const existing = acc.find(d => d.date === sale.sale_date);
            if (existing) {
              existing.revenue += sale.revenue;
              existing.units += sale.units_sold;
              existing.orders += 1;
            } else {
              acc.push({
                date: sale.sale_date,
                period: sale.sale_date,
                revenue: sale.revenue,
                units: sale.units_sold,
                orders: 1,
              });
            }
            return acc;
          }, []),
        ];
      },
    }),
    exec: () => {},
  };
};
