import React, { useState, useMemo, useRef } from 'react';
import { 
  Database, 
  X, 
  Play, 
  Table as TableIcon, 
  Search, 
  Download, 
  RefreshCw, 
  Server, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Filter, 
  Copy, 
  FileCode, 
  Layers, 
  ChevronRight, 
  Sparkles,
  ArrowUpDown,
  ListFilter,
  Eye,
  Info,
  BookOpen,
  Code2,
  Check,
  Plus,
  Trash2,
  Link2,
  Pencil,
  Workflow,
  Save,
  Activity,
  HardDrive,
  Hash,
  Percent,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

export type SqlEngine = 'postgresql' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql' | 'msaccess';

export interface SqlColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  nullable?: boolean;
  defaultValue?: string;
}

export interface SqlTable {
  name: string;
  rowCount: number;
  columns: SqlColumn[];
  rows: Record<string, any>[];
  description?: string;
}

export interface SqlDatabase {
  id: string;
  name: string;
  engine: SqlEngine;
  version: string;
  host: string;
  port: number;
  databaseName: string;
  tables: SqlTable[];
  connected: boolean;
}

// Sample Mock Databases including MySQL, PostgreSQL, MS SQL Server, & MS Access
const SAMPLE_DATABASES: SqlDatabase[] = [
  {
    id: 'pg-ecommerce',
    name: 'E-Commerce Production DB',
    engine: 'postgresql',
    version: 'PostgreSQL 16.2',
    host: 'db.prod-aws.internal',
    port: 5432,
    databaseName: 'ecommerce_store',
    connected: true,
    tables: [
      {
        name: 'products',
        rowCount: 8,
        description: 'Catalog items, inventory count, unit prices & ratings',
        columns: [
          { name: 'product_id', type: 'INTEGER', isPrimary: true },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
          { name: 'category', type: 'VARCHAR(100)' },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'stock_quantity', type: 'INTEGER' },
          { name: 'rating', type: 'DECIMAL(3,2)' },
          { name: 'created_at', type: 'TIMESTAMP' }
        ],
        rows: [
          { product_id: 101, title: 'Apex Pro Mechanical Keyboard', category: 'Peripherals', price: 149.99, stock_quantity: 42, rating: 4.8, created_at: '2026-01-15 10:00:00' },
          { product_id: 102, title: 'UltraSync Wireless Mouse', category: 'Peripherals', price: 79.50, stock_quantity: 85, rating: 4.6, created_at: '2026-01-18 14:30:00' },
          { product_id: 103, title: 'Retina Curved Monitor 32"', category: 'Displays', price: 599.00, stock_quantity: 12, rating: 4.9, created_at: '2026-02-01 09:15:00' },
          { product_id: 104, title: 'Ergonomic Standing Desk', category: 'Furniture', price: 420.00, stock_quantity: 19, rating: 4.7, created_at: '2026-02-05 11:20:00' },
          { product_id: 105, title: 'Studio Noise-Canceling Headset', category: 'Audio', price: 199.95, stock_quantity: 64, rating: 4.5, created_at: '2026-02-10 16:45:00' },
          { product_id: 106, title: 'USB-C Thunderbolt Dock 11-in-1', category: 'Peripherals', price: 129.00, stock_quantity: 38, rating: 4.4, created_at: '2026-02-12 13:00:00' },
          { product_id: 107, title: '4K Ultra WebCam with Ring Light', category: 'Video', price: 89.99, stock_quantity: 51, rating: 4.3, created_at: '2026-02-20 08:30:00' },
          { product_id: 108, title: 'Acoustic Desk Studio Baffles', category: 'Furniture', price: 110.00, stock_quantity: 27, rating: 4.2, created_at: '2026-03-01 15:10:00' }
        ]
      },
      {
        name: 'orders',
        rowCount: 7,
        description: 'Customer purchase transactions and fulfillment status',
        columns: [
          { name: 'order_id', type: 'UUID', isPrimary: true },
          { name: 'customer_email', type: 'VARCHAR(255)' },
          { name: 'order_status', type: 'VARCHAR(50)' },
          { name: 'total_amount', type: 'NUMERIC(12,2)' },
          { name: 'discount_applied', type: 'DECIMAL(5,2)' },
          { name: 'payment_method', type: 'VARCHAR(50)' },
          { name: 'order_date', type: 'DATE' }
        ],
        rows: [
          { order_id: 'ord-8801', customer_email: 'alex.smith@example.com', order_status: 'Completed', total_amount: 828.49, discount_applied: 15.00, payment_method: 'Credit Card', order_date: '2026-03-01' },
          { order_id: 'ord-8802', customer_email: 'maria.g@devcorp.io', order_status: 'Completed', total_amount: 229.49, discount_applied: 0.00, payment_method: 'Apple Pay', order_date: '2026-03-02' },
          { order_id: 'ord-8803', customer_email: 'liam.dev@startup.co', order_status: 'Processing', total_amount: 149.99, discount_applied: 10.00, payment_method: 'PayPal', order_date: '2026-03-03' },
          { order_id: 'ord-8804', customer_email: 'sarah.k@design.net', order_status: 'Completed', total_amount: 1019.00, discount_applied: 50.00, payment_method: 'Credit Card', order_date: '2026-03-03' },
          { order_id: 'ord-8805', customer_email: 'jordan.b@analytics.org', order_status: 'Shipped', total_amount: 328.95, discount_applied: 0.00, payment_method: 'Google Pay', order_date: '2026-03-04' },
          { order_id: 'ord-8806', customer_email: 'elena.r@techblog.com', order_status: 'Pending', total_amount: 89.99, discount_applied: 5.00, payment_method: 'Credit Card', order_date: '2026-03-04' },
          { order_id: 'ord-8807', customer_email: 'david.h@cloud.internal', order_status: 'Completed', total_amount: 549.00, discount_applied: 25.00, payment_method: 'Bank Wire', order_date: '2026-03-05' }
        ]
      },
      {
        name: 'users',
        rowCount: 5,
        description: 'User accounts, role assignments, and subscription tiers',
        columns: [
          { name: 'user_id', type: 'BIGINT', isPrimary: true },
          { name: 'username', type: 'VARCHAR(100)', nullable: false },
          { name: 'email', type: 'VARCHAR(255)', nullable: false },
          { name: 'role', type: 'VARCHAR(50)' },
          { name: 'loyalty_points', type: 'INTEGER' },
          { name: 'is_active', type: 'BOOLEAN' }
        ],
        rows: [
          { user_id: 1, username: 'alex_dev', email: 'alex.smith@example.com', role: 'admin', loyalty_points: 1450, is_active: true },
          { user_id: 2, username: 'maria_ui', email: 'maria.g@devcorp.io', role: 'customer', loyalty_points: 320, is_active: true },
          { user_id: 3, username: 'liam_backend', email: 'liam.dev@startup.co', role: 'customer', loyalty_points: 150, is_active: true },
          { user_id: 4, username: 'sarah_lead', email: 'sarah.k@design.net', role: 'VIP', loyalty_points: 2900, is_active: true },
          { user_id: 5, username: 'jordan_data', email: 'jordan.b@analytics.org', role: 'customer', loyalty_points: 600, is_active: false }
        ]
      }
    ]
  },
  {
    id: 'mssql-finance',
    name: 'Enterprise Financial Ledger DB',
    engine: 'mssql',
    version: 'Microsoft SQL Server 2022 (v16.0)',
    host: 'sqlserver-prod.corp.internal',
    port: 1433,
    databaseName: 'FinanceLedgerDB',
    connected: true,
    tables: [
      {
        name: 'financial_ledgers',
        rowCount: 7,
        description: 'T-SQL General ledger postings, debit/credit audit logs & fiscal period balances',
        columns: [
          { name: 'ledger_id', type: 'INT IDENTITY(1,1)', isPrimary: true },
          { name: 'account_code', type: 'NVARCHAR(50)', nullable: false },
          { name: 'account_name', type: 'NVARCHAR(200)' },
          { name: 'debit_amount', type: 'DECIMAL(18,2)' },
          { name: 'credit_amount', type: 'DECIMAL(18,2)' },
          { name: 'posting_date', type: 'DATETIME2' },
          { name: 'is_reconciled', type: 'BIT' }
        ],
        rows: [
          { ledger_id: 10001, account_code: '1010-CASH', account_name: 'Operating Cash Account', debit_amount: 145000.00, credit_amount: 0.00, posting_date: '2026-03-01 08:30:00', is_reconciled: 1 },
          { ledger_id: 10002, account_code: '4000-REV', account_name: 'Software Subscription Sales', debit_amount: 0.00, credit_amount: 85200.00, posting_date: '2026-03-01 10:15:00', is_reconciled: 1 },
          { ledger_id: 10003, account_code: '5200-SERVERS', account_name: 'Cloud Compute Host Charges', debit_amount: 12400.50, credit_amount: 0.00, posting_date: '2026-03-02 11:45:00', is_reconciled: 1 },
          { ledger_id: 10004, account_code: '1200-AR', account_name: 'Accounts Receivable Client Invoices', debit_amount: 38900.00, credit_amount: 0.00, posting_date: '2026-03-03 09:00:00', is_reconciled: 0 },
          { ledger_id: 10005, account_code: '2100-AP', account_name: 'Accounts Payable Vendor Invoices', debit_amount: 0.00, credit_amount: 19450.00, posting_date: '2026-03-03 16:20:00', is_reconciled: 1 },
          { ledger_id: 10006, account_code: '6100-PAYROLL', account_name: 'Engineering Staff Wages', debit_amount: 98000.00, credit_amount: 0.00, posting_date: '2026-03-04 14:00:00', is_reconciled: 1 },
          { ledger_id: 10007, account_code: '1010-CASH', account_name: 'Operating Cash Account', debit_amount: 25000.00, credit_amount: 0.00, posting_date: '2026-03-05 17:10:00', is_reconciled: 0 }
        ]
      },
      {
        name: 'vendors',
        rowCount: 5,
        description: 'Vendor directory, tax identifiers, payment terms & credit limits',
        columns: [
          { name: 'vendor_id', type: 'INT IDENTITY(1,1)', isPrimary: true },
          { name: 'vendor_name', type: 'NVARCHAR(200)', nullable: false },
          { name: 'tax_id', type: 'NVARCHAR(50)' },
          { name: 'credit_limit_usd', type: 'DECIMAL(18,2)' },
          { name: 'status', type: 'NVARCHAR(30)' }
        ],
        rows: [
          { vendor_id: 201, vendor_name: 'Azure Compute Global', tax_id: 'XX-9871234', credit_limit_usd: 250000.00, status: 'Approved' },
          { vendor_id: 202, vendor_name: 'Redmond Hardware Corp', tax_id: 'XX-4567891', credit_limit_usd: 100000.00, status: 'Approved' },
          { vendor_id: 203, vendor_name: 'Apex Network Solutions', tax_id: 'XX-1122334', credit_limit_usd: 50000.00, status: 'Pending Audit' },
          { vendor_id: 204, vendor_name: 'Office Space Real Estate', tax_id: 'XX-9988776', credit_limit_usd: 500000.00, status: 'Approved' },
          { vendor_id: 205, vendor_name: 'DevTools Licensing Inc', tax_id: 'XX-3344556', credit_limit_usd: 75000.00, status: 'Approved' }
        ]
      }
    ]
  },
  {
    id: 'msaccess-inventory',
    name: 'Small Business Operations (.accdb)',
    engine: 'msaccess',
    version: 'Microsoft Access 365 (Jet/ACE Engine)',
    host: 'local-file://C:/Data/Operations.accdb',
    port: 0,
    databaseName: 'Operations.accdb',
    connected: true,
    tables: [
      {
        name: 'client_contacts',
        rowCount: 6,
        description: 'MS Access client address book, company ties & subscription statuses',
        columns: [
          { name: 'ContactID', type: 'AUTOINCREMENT', isPrimary: true },
          { name: 'ContactName', type: 'TEXT(255)', nullable: false },
          { name: 'CompanyName', type: 'TEXT(255)' },
          { name: 'EmailAddress', type: 'TEXT(255)' },
          { name: 'Phone', type: 'TEXT(50)' },
          { name: 'IsActiveClient', type: 'YESNO' }
        ],
        rows: [
          { ContactID: 1, ContactName: 'Robert Vance', CompanyName: 'Vance Refrigeration', EmailAddress: 'rvance@vancerefrig.com', Phone: '(555) 019-2834', IsActiveClient: true },
          { ContactID: 2, ContactName: 'Pam Beesly', CompanyName: 'Dunder Mifflin Paper', EmailAddress: 'pbeesly@dundermifflin.com', Phone: '(555) 012-9845', IsActiveClient: true },
          { ContactID: 3, ContactName: 'Dwight Schrute', CompanyName: 'Schrute Farms LLC', EmailAddress: 'dwight@schrutefarms.org', Phone: '(555) 018-4422', IsActiveClient: true },
          { ContactID: 4, ContactName: 'Jim Halpert', CompanyName: 'Athleap Sports Media', EmailAddress: 'jhalpert@athleap.io', Phone: '(555) 016-7788', IsActiveClient: true },
          { ContactID: 5, ContactName: 'Angela Martin', CompanyName: 'Accounting Solutions', EmailAddress: 'amartin@accountingsolutions.com', Phone: '(555) 014-3321', IsActiveClient: false },
          { ContactID: 6, ContactName: 'Stanley Hudson', CompanyName: 'Crossword Publishing', EmailAddress: 'stanley@crosswords.net', Phone: '(555) 011-6677', IsActiveClient: true }
        ]
      },
      {
        name: 'service_tickets',
        rowCount: 5,
        description: 'Support requests, assigned contacts, estimated costs & priorities',
        columns: [
          { name: 'TicketID', type: 'AUTOINCREMENT', isPrimary: true },
          { name: 'ContactID', type: 'LONG', isForeign: true },
          { name: 'IssueTitle', type: 'TEXT(255)', nullable: false },
          { name: 'Priority', type: 'TEXT(50)' },
          { name: 'EstimatedCost', type: 'CURRENCY' },
          { name: 'CreatedDate', type: 'DATETIME' }
        ],
        rows: [
          { TicketID: 801, ContactID: 1, IssueTitle: 'HVAC Server Room Cooling Malfunction', Priority: 'High', EstimatedCost: 1250.00, CreatedDate: '2026-03-01' },
          { TicketID: 802, ContactID: 2, IssueTitle: 'Paper Copier Network Driver Setup', Priority: 'Medium', EstimatedCost: 180.00, CreatedDate: '2026-03-02' },
          { TicketID: 803, ContactID: 3, IssueTitle: 'Irrigation Sensor Access Database Backup', Priority: 'Low', EstimatedCost: 95.00, CreatedDate: '2026-03-03' },
          { TicketID: 804, ContactID: 4, IssueTitle: 'Live Streaming Video Equipment Install', Priority: 'High', EstimatedCost: 3400.00, CreatedDate: '2026-03-04' },
          { TicketID: 805, ContactID: 6, IssueTitle: 'Office Workstation RAM Upgrade', Priority: 'Low', EstimatedCost: 220.00, CreatedDate: '2026-03-05' }
        ]
      }
    ]
  },
  {
    id: 'mysql-analytics',
    name: 'Web Analytics & Events DB',
    engine: 'mysql',
    version: 'MySQL 8.0.35',
    host: 'mysql-cluster.gcp.internal',
    port: 3306,
    databaseName: 'web_analytics',
    connected: true,
    tables: [
      {
        name: 'daily_pageviews',
        rowCount: 7,
        description: 'Daily visitor traffic breakdown by device & bounce rate',
        columns: [
          { name: 'log_date', type: 'DATE', isPrimary: true },
          { name: 'pageviews', type: 'INT' },
          { name: 'unique_visitors', type: 'INT' },
          { name: 'bounce_rate_pct', type: 'FLOAT' },
          { name: 'avg_session_sec', type: 'INT' }
        ],
        rows: [
          { log_date: '2026-03-01', pageviews: 12450, unique_visitors: 4820, bounce_rate_pct: 34.2, avg_session_sec: 185 },
          { log_date: '2026-03-02', pageviews: 14200, unique_visitors: 5310, bounce_rate_pct: 32.8, avg_session_sec: 198 },
          { log_date: '2026-03-03', pageviews: 18900, unique_visitors: 7120, bounce_rate_pct: 29.5, avg_session_sec: 220 },
          { log_date: '2026-03-04', pageviews: 16500, unique_visitors: 6240, bounce_rate_pct: 31.0, avg_session_sec: 210 },
          { log_date: '2026-03-05', pageviews: 21300, unique_visitors: 8400, bounce_rate_pct: 27.4, avg_session_sec: 245 },
          { log_date: '2026-03-06', pageviews: 23800, unique_visitors: 9150, bounce_rate_pct: 26.1, avg_session_sec: 260 },
          { log_date: '2026-03-07', pageviews: 19800, unique_visitors: 7800, bounce_rate_pct: 28.9, avg_session_sec: 230 }
        ]
      },
      {
        name: 'event_logs',
        rowCount: 6,
        description: 'Feature usage telemetry & conversion funnel triggers',
        columns: [
          { name: 'event_id', type: 'INT AUTO_INCREMENT', isPrimary: true },
          { name: 'event_type', type: 'VARCHAR(100)' },
          { name: 'browser', type: 'VARCHAR(50)' },
          { name: 'os_platform', type: 'VARCHAR(50)' },
          { name: 'event_count', type: 'INT' }
        ],
        rows: [
          { event_id: 501, event_type: 'Click Export Code', browser: 'Chrome', os_platform: 'macOS', event_count: 1420 },
          { event_id: 502, event_type: 'Run Groovy Linter', browser: 'Chrome', os_platform: 'Windows', event_count: 980 },
          { event_id: 503, event_type: 'Validate XSD Schema', browser: 'Firefox', os_platform: 'macOS', event_count: 620 },
          { event_id: 504, event_type: 'Open XML Structure Tree', browser: 'Safari', os_platform: 'iOS', event_count: 410 },
          { event_id: 505, event_type: 'Format Document', browser: 'Edge', os_platform: 'Windows', event_count: 890 },
          { event_id: 506, event_type: 'Convert XML to JSON', browser: 'Chrome', os_platform: 'Linux', event_count: 730 }
        ]
      }
    ]
  },
  {
    id: 'mariadb-galera-inventory',
    name: 'MariaDB Galera Cluster DB',
    engine: 'mariadb',
    version: 'MariaDB 11.3.2 (Galera 4 Multi-Master)',
    host: 'mariadb-galera.prod.internal',
    port: 3306,
    databaseName: 'supply_chain_db',
    connected: true,
    tables: [
      {
        name: 'inventory_warehouses',
        rowCount: 6,
        description: 'MariaDB Galera cluster warehouse hubs, stock quotas & logistics status',
        columns: [
          { name: 'warehouse_id', type: 'INT AUTO_INCREMENT', isPrimary: true },
          { name: 'hub_code', type: 'VARCHAR(50)', nullable: false },
          { name: 'city_location', type: 'VARCHAR(100)' },
          { name: 'total_pallets', type: 'INT' },
          { name: 'occupied_pallets', type: 'INT' },
          { name: 'is_active', type: 'TINYINT(1)' }
        ],
        rows: [
          { warehouse_id: 101, hub_code: 'WH-AMS-01', city_location: 'Amsterdam, NL', total_pallets: 15000, occupied_pallets: 12400, is_active: 1 },
          { warehouse_id: 102, hub_code: 'WH-FRA-02', city_location: 'Frankfurt, DE', total_pallets: 22000, occupied_pallets: 18900, is_active: 1 },
          { warehouse_id: 103, hub_code: 'WH-LND-01', city_location: 'London, UK', total_pallets: 18000, occupied_pallets: 14200, is_active: 1 },
          { warehouse_id: 104, hub_code: 'WH-CDG-03', city_location: 'Paris, FR', total_pallets: 12500, occupied_pallets: 9800, is_active: 1 },
          { warehouse_id: 105, hub_code: 'WH-ZRH-01', city_location: 'Zurich, CH', total_pallets: 8000, occupied_pallets: 7100, is_active: 1 },
          { warehouse_id: 106, hub_code: 'WH-MAD-02', city_location: 'Madrid, ES', total_pallets: 14000, occupied_pallets: 10500, is_active: 0 }
        ]
      },
      {
        name: 'shipments',
        rowCount: 5,
        description: 'Multi-node replicated shipment dispatches, carriers & transit status',
        columns: [
          { name: 'shipment_id', type: 'BIGINT AUTO_INCREMENT', isPrimary: true },
          { name: 'warehouse_id', type: 'INT', isForeign: true },
          { name: 'tracking_code', type: 'VARCHAR(100)', nullable: false },
          { name: 'carrier', type: 'VARCHAR(100)' },
          { name: 'freight_cost_eur', type: 'DECIMAL(10,2)' },
          { name: 'status', type: 'VARCHAR(50)' }
        ],
        rows: [
          { shipment_id: 9001, warehouse_id: 101, tracking_code: 'TRK-EU-99210', carrier: 'DHL Express Global', freight_cost_eur: 420.50, status: 'In Transit' },
          { shipment_id: 9002, warehouse_id: 102, tracking_code: 'TRK-EU-99211', carrier: 'FedEx International', freight_cost_eur: 890.00, status: 'Delivered' },
          { shipment_id: 9003, warehouse_id: 103, tracking_code: 'TRK-EU-99212', carrier: 'UPS Supply Chain', freight_cost_eur: 310.20, status: 'Customs Clearance' },
          { shipment_id: 9004, warehouse_id: 101, tracking_code: 'TRK-EU-99213', carrier: 'DB Schenker Logistics', freight_cost_eur: 1150.00, status: 'In Transit' },
          { shipment_id: 9005, warehouse_id: 104, tracking_code: 'TRK-EU-99214', carrier: 'Kuehne+Nagel Air', freight_cost_eur: 670.80, status: 'Out for Delivery' }
        ]
      }
    ]
  },
  {
    id: 'pg-hr-company',
    name: 'HR & Personnel Database',
    engine: 'postgresql',
    version: 'PostgreSQL 15.4',
    host: 'postgresql-hr.internal',
    port: 5432,
    databaseName: 'company_hr',
    connected: true,
    tables: [
      {
        name: 'employees',
        rowCount: 6,
        description: 'Staff compensation, department assignment, and tenure',
        columns: [
          { name: 'emp_id', type: 'INT', isPrimary: true },
          { name: 'first_name', type: 'VARCHAR(100)' },
          { name: 'last_name', type: 'VARCHAR(100)' },
          { name: 'department', type: 'VARCHAR(100)' },
          { name: 'salary_usd', type: 'NUMERIC(10,2)' },
          { name: 'performance_score', type: 'INTEGER' }
        ],
        rows: [
          { emp_id: 1001, first_name: 'Sophia', last_name: 'Chen', department: 'Engineering', salary_usd: 145000, performance_score: 95 },
          { emp_id: 1002, first_name: 'Marcus', last_name: 'Vance', department: 'Product', salary_usd: 132000, performance_score: 91 },
          { emp_id: 1003, first_name: 'Elena', last_name: 'Rostova', department: 'Engineering', salary_usd: 158000, performance_score: 98 },
          { emp_id: 1004, first_name: 'David', last_name: 'Kim', department: 'Design', salary_usd: 118000, performance_score: 88 },
          { emp_id: 1005, first_name: 'Amara', last_name: 'Okonkwo', department: 'Marketing', salary_usd: 105000, performance_score: 89 },
          { emp_id: 1006, first_name: 'Lucas', last_name: 'Wright', department: 'Engineering', salary_usd: 128000, performance_score: 92 }
        ]
      }
    ]
  }
];

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export interface SqlSnippetTemplate {
  id: string;
  title: string;
  category: 'JOINs' | 'Aggregations' | 'Formatting' | 'Window Functions' | 'DDL & Schema';
  engineTag: string;
  description: string;
  snippetSql: string;
}

const SQL_SNIPPETS_LIBRARY: SqlSnippetTemplate[] = [
  {
    id: 'snip-inner-join',
    title: 'INNER JOIN with Aliases & Filtering',
    category: 'JOINs',
    engineTag: 'PostgreSQL & MySQL',
    description: 'Combine order transactions with product metadata matching key identifiers',
    snippetSql: `SELECT \n  a.order_id,\n  a.customer_email,\n  a.total_amount,\n  a.order_date,\n  p.title AS product_name,\n  p.price\nFROM orders a\nINNER JOIN products p ON a.order_id = p.product_id\nWHERE a.order_status = 'Completed'\nORDER BY a.order_date DESC\nLIMIT 50;`
  },
  {
    id: 'snip-left-join-agg',
    title: 'LEFT JOIN with Aggregation & COALESCE',
    category: 'JOINs',
    engineTag: 'PostgreSQL & MySQL',
    description: 'Include all users even if they have 0 orders, calculating lifetime spend safely',
    snippetSql: `SELECT \n  u.user_id,\n  u.username,\n  u.email,\n  COUNT(o.order_id) AS total_orders,\n  COALESCE(SUM(o.total_amount), 0.00) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.email = o.customer_email\nGROUP BY u.user_id, u.username, u.email\nORDER BY total_spent DESC;`
  },
  {
    id: 'snip-self-join',
    title: 'Self JOIN for Intra-Table Comparisons',
    category: 'JOINs',
    engineTag: 'ANSI SQL',
    description: 'Compare rows within the same table (e.g. employee peer salary comparison)',
    snippetSql: `SELECT \n  e1.emp_id,\n  CONCAT(e1.first_name, ' ', e1.last_name) AS employee,\n  e1.salary_usd AS employee_salary,\n  CONCAT(e2.first_name, ' ', e2.last_name) AS peer_in_dept,\n  e2.salary_usd AS peer_salary\nFROM employees e1\nINNER JOIN employees e2 ON e1.department = e2.department AND e1.emp_id <> e2.emp_id\nWHERE e1.salary_usd < e2.salary_usd;`
  },
  {
    id: 'snip-group-having',
    title: 'GROUP BY Category with HAVING Filter',
    category: 'Aggregations',
    engineTag: 'ANSI SQL',
    description: 'Calculate average, minimum, and maximum values filtered by aggregated counts',
    snippetSql: `SELECT \n  category,\n  COUNT(*) AS item_count,\n  ROUND(AVG(price), 2) AS avg_price,\n  MIN(price) AS min_price,\n  MAX(price) AS max_price\nFROM products\nGROUP BY category\nHAVING COUNT(*) >= 1\nORDER BY avg_price DESC;`
  },
  {
    id: 'snip-count-distinct',
    title: 'COUNT(DISTINCT) & Ratio Analytics',
    category: 'Aggregations',
    engineTag: 'ANSI SQL',
    description: 'Aggregate unique metric counts and calculate averages per group',
    snippetSql: `SELECT \n  browser,\n  COUNT(DISTINCT event_id) AS unique_events,\n  SUM(event_count) AS total_event_volume,\n  ROUND(AVG(event_count), 1) AS avg_volume_per_event\nFROM event_logs\nGROUP BY browser\nORDER BY total_event_volume DESC;`
  },
  {
    id: 'snip-rollup',
    title: 'Multi-Level Rollup Summary (WITH ROLLUP)',
    category: 'Aggregations',
    engineTag: 'PostgreSQL & MySQL',
    description: 'Generate subtotal and grand total summary rows across departments',
    snippetSql: `SELECT \n  COALESCE(department, 'ALL DEPARTMENTS') AS department,\n  COUNT(*) AS total_employees,\n  SUM(salary_usd) AS department_payroll\nFROM employees\nGROUP BY department WITH ROLLUP;`
  },
  {
    id: 'snip-case-when',
    title: 'CASE WHEN Conditional Bucketing',
    category: 'Formatting',
    engineTag: 'ANSI SQL',
    description: 'Classify rows into custom logical tiers based on conditional criteria',
    snippetSql: `SELECT \n  title,\n  price,\n  stock_quantity,\n  CASE \n    WHEN stock_quantity = 0 THEN 'Out of Stock'\n    WHEN stock_quantity < 20 THEN 'Low Stock Alert'\n    WHEN stock_quantity BETWEEN 20 AND 50 THEN 'Moderate Stock'\n    ELSE 'Well Stocked'\n  END AS inventory_status\nFROM products\nORDER BY stock_quantity ASC;`
  },
  {
    id: 'snip-date-trunc',
    title: 'Date Extraction & Time Truncation',
    category: 'Formatting',
    engineTag: 'PostgreSQL & MySQL',
    description: 'Format timestamp values by year, month, or day for time-series reports',
    snippetSql: `SELECT \n  order_id,\n  customer_email,\n  total_amount,\n  order_date,\n  EXTRACT(YEAR FROM order_date) AS order_year,\n  EXTRACT(MONTH FROM order_date) AS order_month\nFROM orders\nWHERE order_date >= '2026-01-01'\nORDER BY order_date DESC;`
  },
  {
    id: 'snip-coalesce-concat',
    title: 'String CONCAT & COALESCE Fallbacks',
    category: 'Formatting',
    engineTag: 'ANSI SQL',
    description: 'Merge text fields and provide safe default fallbacks for NULL column values',
    snippetSql: `SELECT \n  emp_id,\n  CONCAT(first_name, ' ', last_name) AS full_name,\n  COALESCE(department, 'Unassigned / Bench') AS assigned_department,\n  COALESCE(salary_usd, 0.00) AS base_compensation\nFROM employees;`
  },
  {
    id: 'snip-row-number-rank',
    title: 'ROW_NUMBER() & DENSE_RANK() Windowing',
    category: 'Window Functions',
    engineTag: 'PostgreSQL & MySQL 8+',
    description: 'Rank items within specific partitions without collapsing rows',
    snippetSql: `SELECT \n  title,\n  category,\n  price,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category,\n  DENSE_RANK() OVER (ORDER BY price DESC) AS overall_price_rank\nFROM products;`
  },
  {
    id: 'snip-running-total',
    title: 'Cumulative Running Total (SUM OVER)',
    category: 'Window Functions',
    engineTag: 'PostgreSQL & MySQL 8+',
    description: 'Calculate cumulative rolling revenue sum ordered by transaction dates',
    snippetSql: `SELECT \n  order_date,\n  total_amount,\n  SUM(total_amount) OVER (\n    ORDER BY order_date ASC \n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS cumulative_revenue\nFROM orders\nORDER BY order_date ASC;`
  },
  {
    id: 'snip-lag-lead',
    title: 'LAG & LEAD Historical Delta Comparison',
    category: 'Window Functions',
    engineTag: 'PostgreSQL & MySQL 8+',
    description: 'Fetch previous or next row values to compute period-over-period growth',
    snippetSql: `SELECT \n  log_date,\n  pageviews,\n  LAG(pageviews, 1) OVER (ORDER BY log_date ASC) AS prev_day_views,\n  (pageviews - LAG(pageviews, 1) OVER (ORDER BY log_date ASC)) AS daily_view_delta\nFROM daily_pageviews\nORDER BY log_date ASC;`
  },
  {
    id: 'snip-cte-with',
    title: 'CTE (Common Table Expression - WITH Clause)',
    category: 'Window Functions',
    engineTag: 'ANSI SQL',
    description: 'Simplify complex multi-step queries into readable temporary result sets',
    snippetSql: `WITH HighValueOrders AS (\n  SELECT order_id, customer_email, total_amount\n  FROM orders\n  WHERE total_amount > 200.00\n)\nSELECT \n  h.customer_email,\n  COUNT(h.order_id) AS high_value_count,\n  SUM(h.total_amount) AS total_spent\nFROM HighValueOrders h\nGROUP BY h.customer_email\nORDER BY total_spent DESC;`
  },
  {
    id: 'snip-create-table',
    title: 'CREATE TABLE with Foreign Keys & Constraints',
    category: 'DDL & Schema',
    engineTag: 'PostgreSQL & MySQL',
    description: 'Define relational table structures with primary keys, checks, and cascading FKs',
    snippetSql: `CREATE TABLE IF NOT EXISTS customer_reviews (\n  review_id SERIAL PRIMARY KEY,\n  product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,\n  user_email VARCHAR(255) NOT NULL,\n  rating_stars INTEGER CHECK (rating_stars BETWEEN 1 AND 5),\n  review_comment TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`
  },
  {
    id: 'snip-upsert',
    title: 'Upsert (INSERT ... ON CONFLICT DO UPDATE)',
    category: 'DDL & Schema',
    engineTag: 'PostgreSQL / MySQL',
    description: 'Atomically insert a record or update existing values if unique key conflicts',
    snippetSql: `INSERT INTO products (product_id, title, category, price, stock_quantity)\nVALUES (109, 'Pro Vertical Ergonomic Mouse', 'Peripherals', 89.99, 35)\nON CONFLICT (product_id) \nDO UPDATE SET \n  price = EXCLUDED.price,\n  stock_quantity = EXCLUDED.stock_quantity;`
  },
  {
    id: 'snip-tsql-top-nolock',
    title: 'T-SQL SELECT TOP with WITH(NOLOCK)',
    category: 'Formatting',
    engineTag: 'Microsoft SQL Server',
    description: 'Fetch top records in MS SQL Server using non-blocking dirty read lock hint',
    snippetSql: `SELECT TOP 20 \n  ledger_id,\n  account_code,\n  account_name,\n  debit_amount,\n  credit_amount,\n  posting_date\nFROM financial_ledgers WITH (NOLOCK)\nWHERE is_reconciled = 1\nORDER BY posting_date DESC;`
  },
  {
    id: 'snip-tsql-cross-apply',
    title: 'T-SQL CROSS APPLY / OUTER APPLY',
    category: 'JOINs',
    engineTag: 'Microsoft SQL Server',
    description: 'Join table-valued functions or correlated subqueries per row in MS SQL Server',
    snippetSql: `SELECT \n  v.vendor_name,\n  v.tax_id,\n  po.po_id,\n  po.total_usd\nFROM vendors v\nCROSS APPLY (\n  SELECT TOP 1 po_id, total_usd\n  FROM purchase_orders\n  WHERE vendor_id = v.vendor_id\n  ORDER BY created_date DESC\n) po;`
  },
  {
    id: 'snip-msaccess-iif-nz',
    title: 'MS Access IIF() & NZ() Null Handlers',
    category: 'Formatting',
    engineTag: 'Microsoft Access',
    description: 'Jet SQL conditional logic and null substitution for Access databases',
    snippetSql: `SELECT \n  ContactName,\n  CompanyName,\n  IIF([IsActiveClient] = True, 'Active Client', 'Inactive / Archived') AS ClientStatus,\n  NZ([Phone], 'No Phone On Record') AS DisplayPhone\nFROM client_contacts;`
  },
  {
    id: 'snip-mariadb-system-versioning',
    title: 'MariaDB Temporal System-Versioned Table',
    category: 'DDL & Schema',
    engineTag: 'MariaDB 10.3+',
    description: 'Query point-in-time historical row revisions using FOR SYSTEM_TIME ALL in MariaDB',
    snippetSql: `SELECT \n  warehouse_id,\n  hub_code,\n  occupied_pallets,\n  row_start,\n  row_end\nFROM inventory_warehouses FOR SYSTEM_TIME ALL\nORDER BY row_start DESC;`
  },
  {
    id: 'snip-mariadb-sequence',
    title: 'MariaDB NEXT VALUE FOR Sequence',
    category: 'DDL & Schema',
    engineTag: 'MariaDB 10.3+',
    description: 'Atomic numeric sequence generator syntax native to MariaDB engines',
    snippetSql: `SELECT \n  NEXT VALUE FOR shipment_seq AS new_shipment_id,\n  101 AS warehouse_id,\n  'DHL Express' AS carrier,\n  550.00 AS freight_cost_eur;`
  },
  {
    id: 'snip-mariadb-wsrep-cluster',
    title: 'MariaDB Galera WSREP Multi-Master Status',
    category: 'Aggregations',
    engineTag: 'MariaDB Galera',
    description: 'Inspect multi-master node cluster size, replication state & local node status',
    snippetSql: `SHOW STATUS LIKE 'wsrep_cluster_size';\nSHOW STATUS LIKE 'wsrep_local_state_comment';\nSHOW STATUS LIKE 'wsrep_incoming_addresses';`
  }
];

export interface DesignerColumn {
  id: string;
  name: string;
  type: string;
  isPrimary: boolean;
  isAutoIncrement: boolean;
  nullable: boolean;
  defaultValue?: string;
  foreignKey?: {
    targetTable: string;
    targetColumn: string;
  };
}

export interface DesignerTable {
  id: string;
  name: string;
  columns: DesignerColumn[];
}

export function generateDdlSql(tables: DesignerTable[], dialect: SqlEngine): string {
  if (!tables || tables.length === 0) {
    return '-- No tables defined in Schema Designer.\n-- Click "+ New Table" or "Load Selected DB Schema" above to start designing.';
  }

  let sql = `-- Generated DDL Schema for ${dialect.toUpperCase()}\n`;
  sql += `-- Created via Visual Schema Designer\n\n`;

  tables.forEach((table) => {
    const tableName = table.name.trim() || 'unnamed_table';

    if (dialect === 'mssql') {
      sql += `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}')\nCREATE TABLE [${tableName}] (\n`;
    } else if (dialect === 'msaccess') {
      sql += `CREATE TABLE [${tableName}] (\n`;
    } else {
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    }

    const columnDefs: string[] = [];
    const pkColumns: string[] = [];
    const fkConstraints: string[] = [];

    table.columns.forEach((col) => {
      const colName = col.name.trim() || 'unnamed_col';
      let typeStr = col.type;

      // Dialect adjustments
      if (dialect === 'postgresql') {
        if (col.isAutoIncrement && col.isPrimary && (col.type === 'INTEGER' || col.type === 'BIGINT')) {
          typeStr = col.type === 'BIGINT' ? 'BIGSERIAL' : 'SERIAL';
        }
      } else if (dialect === 'sqlite') {
        if (col.type.startsWith('VARCHAR') || col.type === 'TEXT' || col.type === 'JSONB') {
          typeStr = 'TEXT';
        } else if (col.type === 'TIMESTAMP') {
          typeStr = 'DATETIME';
        }
      } else if (dialect === 'mariadb') {
        if (col.type.startsWith('VARCHAR')) typeStr = `VARCHAR(${col.type.match(/\d+/)?.[0] || '255'})`;
        else if (col.type === 'TEXT') typeStr = 'LONGTEXT';
        else if (col.type === 'BOOLEAN') typeStr = 'TINYINT(1)';
        else if (col.type === 'TIMESTAMP') typeStr = 'DATETIME';
      } else if (dialect === 'mssql') {
        if (col.type.startsWith('VARCHAR')) typeStr = `NVARCHAR(${col.type.match(/\d+/)?.[0] || '255'})`;
        else if (col.type === 'TEXT') typeStr = 'NVARCHAR(MAX)';
        else if (col.type === 'BOOLEAN') typeStr = 'BIT';
        else if (col.type === 'TIMESTAMP') typeStr = 'DATETIME2';
      } else if (dialect === 'msaccess') {
        if (col.type.startsWith('VARCHAR')) typeStr = `TEXT(${col.type.match(/\d+/)?.[0] || '255'})`;
        else if (col.type === 'TEXT') typeStr = 'MEMO';
        else if (col.type.includes('INT')) typeStr = 'LONG';
        else if (col.type.includes('DECIMAL') || col.type.includes('NUMERIC')) typeStr = 'CURRENCY';
        else if (col.type === 'BOOLEAN') typeStr = 'YESNO';
        else if (col.type === 'TIMESTAMP') typeStr = 'DATETIME';
      }

      const formattedColName = (dialect === 'mssql' || dialect === 'msaccess') ? `[${colName}]` : colName;
      let line = `  ${formattedColName} ${typeStr}`;

      if (col.isPrimary) {
        pkColumns.push(formattedColName);
        if (dialect === 'sqlite' && col.isAutoIncrement) {
          line += ' PRIMARY KEY AUTOINCREMENT';
        } else if ((dialect === 'mysql' || dialect === 'mariadb') && col.isAutoIncrement) {
          line += ' AUTO_INCREMENT';
        } else if (dialect === 'mssql' && col.isAutoIncrement) {
          line += ' IDENTITY(1,1)';
        } else if (dialect === 'msaccess' && col.isAutoIncrement) {
          line = `  ${formattedColName} AUTOINCREMENT PRIMARY KEY`;
        }
      }

      if (!col.nullable && !col.isPrimary && dialect !== 'msaccess') {
        line += ' NOT NULL';
      }

      if (col.defaultValue && col.defaultValue.trim() !== '') {
        line += ` DEFAULT ${col.defaultValue.trim()}`;
      }

      if (col.foreignKey && col.foreignKey.targetTable && col.foreignKey.targetColumn) {
        const targetTab = (dialect === 'mssql' || dialect === 'msaccess') ? `[${col.foreignKey.targetTable}]` : col.foreignKey.targetTable;
        const targetCol = (dialect === 'mssql' || dialect === 'msaccess') ? `[${col.foreignKey.targetColumn}]` : col.foreignKey.targetColumn;
        fkConstraints.push(
          `  CONSTRAINT fk_${tableName}_${colName} FOREIGN KEY (${formattedColName}) REFERENCES ${targetTab}(${targetCol}) ON DELETE CASCADE`
        );
      }

      columnDefs.push(line);
    });

    if (pkColumns.length > 0 && dialect !== 'sqlite' && dialect !== 'msaccess') {
      columnDefs.push(`  CONSTRAINT PK_${tableName} PRIMARY KEY (${pkColumns.join(', ')})`);
    }

    columnDefs.push(...fkConstraints);

    sql += columnDefs.join(',\n');
    if (dialect === 'mariadb') {
      sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    } else if (dialect === 'mysql') {
      sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;
    } else {
      sql += `\n);\n\n`;
    }
  });

  return sql.trim();
}

const INITIAL_DESIGNER_TABLES: DesignerTable[] = [
  {
    id: 'tbl-users',
    name: 'users',
    columns: [
      { id: 'col-u1', name: 'user_id', type: 'INTEGER', isPrimary: true, isAutoIncrement: true, nullable: false },
      { id: 'col-u2', name: 'username', type: 'VARCHAR(255)', isPrimary: false, isAutoIncrement: false, nullable: false },
      { id: 'col-u3', name: 'email', type: 'VARCHAR(255)', isPrimary: false, isAutoIncrement: false, nullable: false },
      { id: 'col-u4', name: 'role', type: 'VARCHAR(50)', isPrimary: false, isAutoIncrement: false, nullable: false, defaultValue: "'user'" },
      { id: 'col-u5', name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    id: 'tbl-orders',
    name: 'orders',
    columns: [
      { id: 'col-o1', name: 'order_id', type: 'INTEGER', isPrimary: true, isAutoIncrement: true, nullable: false },
      { id: 'col-o2', name: 'user_id', type: 'INTEGER', isPrimary: false, isAutoIncrement: false, nullable: false, foreignKey: { targetTable: 'users', targetColumn: 'user_id' } },
      { id: 'col-o3', name: 'total_amount', type: 'DECIMAL(10,2)', isPrimary: false, isAutoIncrement: false, nullable: false, defaultValue: '0.00' },
      { id: 'col-o4', name: 'order_status', type: 'VARCHAR(50)', isPrimary: false, isAutoIncrement: false, nullable: false, defaultValue: "'Pending'" },
      { id: 'col-o5', name: 'order_date', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  }
];

export interface SqlSuggestion {
  text: string;
  type: 'keyword' | 'table' | 'column';
  detail?: string;
}

export interface SqlSyntaxError {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  line?: number;
  fixable?: boolean;
  fixType?: 'add_semicolon' | 'close_quote' | 'close_paren' | 'remove_trailing_comma' | 'add_from';
  fixDescription?: string;
}

export const COMMON_SQL_KEYWORDS: string[] = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN',
  'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
  'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'COUNT(*)', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'ROW_NUMBER()', 'RANK()', 'OVER', 'PARTITION BY', 'WITH', 'UNION ALL', 'DISTINCT', 'ASC', 'DESC'
];

export function validateSqlSyntax(query: string, availableTableNames: string[] = []): SqlSyntaxError[] {
  const errors: SqlSyntaxError[] = [];
  const trimmed = query.trim();

  if (!trimmed) return errors;

  // 1. Check unclosed quotes & parentheses
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let openParenCount = 0;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const prevChar = i > 0 ? query[i - 1] : '';

    if (char === "'" && !inDoubleQuote && !inBacktick && prevChar !== '\\') {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote && !inBacktick && prevChar !== '\\') {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '`' && !inSingleQuote && !inDoubleQuote && prevChar !== '\\') {
      inBacktick = !inBacktick;
    } else if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (char === '(') openParenCount++;
      if (char === ')') openParenCount--;
    }
  }

  if (inSingleQuote) {
    errors.push({
      id: 'unclosed-single-quote',
      severity: 'error',
      message: "Unclosed single quote (') detected.",
      fixable: true,
      fixType: 'close_quote',
      fixDescription: "Add missing single quote (') at end"
    });
  }
  if (inDoubleQuote) {
    errors.push({
      id: 'unclosed-double-quote',
      severity: 'error',
      message: 'Unclosed double quote (") detected.',
      fixable: true,
      fixType: 'close_quote',
      fixDescription: 'Add missing double quote (") at end'
    });
  }
  if (inBacktick) {
    errors.push({
      id: 'unclosed-backtick',
      severity: 'error',
      message: 'Unclosed backtick (`) detected.',
      fixable: true,
      fixType: 'close_quote',
      fixDescription: 'Add missing backtick (`) at end'
    });
  }

  if (openParenCount > 0) {
    errors.push({
      id: 'unclosed-paren',
      severity: 'error',
      message: `Unclosed parenthesis detected (${openParenCount} missing ')').`,
      fixable: true,
      fixType: 'close_paren',
      fixDescription: `Add ${openParenCount} closing parenthesis ')'`
    });
  } else if (openParenCount < 0) {
    errors.push({
      id: 'extra-closing-paren',
      severity: 'error',
      message: "Unexpected extra closing parenthesis ')' found."
    });
  }

  // Sanitize query string for token inspection
  const cleanSql = query
    .replace(/'[^']*'/g, "''")
    .replace(/"[^"]*"/g, '""')
    .replace(/`[^`]*`/g, '``')
    .replace(/--.*$/gm, '')
    .trim();

  const cleanUpper = cleanSql.toUpperCase();

  // 2. Trailing Comma check
  if (/,\s*(FROM|WHERE|GROUP|ORDER|LIMIT|;|$)/i.test(cleanSql)) {
    errors.push({
      id: 'trailing-comma',
      severity: 'error',
      message: 'Syntax Error: Trailing comma before clause or statement end.',
      fixable: true,
      fixType: 'remove_trailing_comma',
      fixDescription: 'Remove trailing comma'
    });
  }

  // 3. Missing FROM clause in SELECT query
  if (cleanUpper.startsWith('SELECT') || /\bSELECT\b/.test(cleanUpper)) {
    if (!/\bFROM\b/.test(cleanUpper) && !/SELECT\s+\d+/.test(cleanUpper) && !/SELECT\s+(NOW|CURRENT_TIMESTAMP|VERSION|DATABASE)\b/.test(cleanUpper)) {
      errors.push({
        id: 'missing-from',
        severity: 'warning',
        message: "SELECT statement is missing a FROM clause.",
        fixable: availableTableNames.length > 0,
        fixType: 'add_from',
        fixDescription: `Append FROM ${availableTableNames[0] || 'table_name'}`
      });
    }
  }

  // 4. Dangling Keywords
  const danglingKeywords = ['WHERE', 'JOIN', 'ON', 'AND', 'OR', 'SET', 'GROUP BY', 'ORDER BY', 'HAVING', 'IN'];
  const lastTokenMatch = cleanUpper.match(/\b([A-Z\s]+)\s*;?\s*$/);
  if (lastTokenMatch) {
    const lastToken = lastTokenMatch[1].trim();
    if (danglingKeywords.includes(lastToken)) {
      errors.push({
        id: 'dangling-keyword',
        severity: 'error',
        message: `Incomplete statement: Trailing '${lastToken}' keyword expects target expression.`
      });
    }
  }

  // 5. Unknown Table Validation
  if (availableTableNames.length > 0) {
    const fromMatches = Array.from(cleanSql.matchAll(/\b(?:FROM|JOIN|UPDATE|INSERT INTO)\s+([a-zA-Z0-9_]+)/gi));
    fromMatches.forEach(m => {
      const tName = m[1];
      const isKnown = availableTableNames.some(t => t.toLowerCase() === tName.toLowerCase());
      if (!isKnown && !['SELECT', 'DUAL'].includes(tName.toUpperCase())) {
        errors.push({
          id: `unknown-table-${tName}`,
          severity: 'warning',
          message: `Table '${tName}' not found in active schema '${availableTableNames.join(', ')}'.`
        });
      }
    });
  }

  // 6. Missing trailing semicolon
  if (!cleanSql.endsWith(';')) {
    errors.push({
      id: 'missing-semicolon',
      severity: 'warning',
      message: 'Query missing trailing semicolon (;).',
      fixable: true,
      fixType: 'add_semicolon',
      fixDescription: 'Add trailing semicolon (;)'
    });
  }

  return errors;
}

interface SqlDatabaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  onExportSqlToProject?: (filename: string, sqlContent: string) => void;
}

export const SqlDatabaseExplorerModal: React.FC<SqlDatabaseExplorerModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
  onExportSqlToProject
}) => {
  if (!isOpen) return null;

  // Selected Database & Table state
  const [selectedDbId, setSelectedDbId] = useState<string>(SAMPLE_DATABASES[0].id);
  const [selectedTableName, setSelectedTableName] = useState<string>(SAMPLE_DATABASES[0].tables[0].name);
  const [activeTab, setActiveTab] = useState<'grid' | 'stats' | 'visualizer' | 'query' | 'snippets' | 'designer' | 'connection'>('grid');

  // Visual Schema Designer State
  const [designerDialect, setDesignerDialect] = useState<SqlEngine>('postgresql');
  const [designerTables, setDesignerTables] = useState<DesignerTable[]>(INITIAL_DESIGNER_TABLES);
  const [designerNotice, setDesignerNotice] = useState<string | null>(null);
  const [copiedDdl, setCopiedDdl] = useState<boolean>(false);

  // Snippets tab search & category filter state
  const [snippetCategory, setSnippetCategory] = useState<string>('All');
  const [snippetSearchQuery, setSnippetSearchQuery] = useState<string>('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [insertedNotice, setInsertedNotice] = useState<string | null>(null);

  // Custom connection form state
  const [connEngine, setConnEngine] = useState<SqlEngine>('postgresql');
  const [connHost, setConnHost] = useState<string>('localhost');
  const [connPort, setConnPort] = useState<number>(5432);
  const [connDbName, setConnDbName] = useState<string>('my_app_db');
  const [connUser, setConnUser] = useState<string>('postgres');
  const [connPass, setConnPass] = useState<string>('••••••••');
  const [connStatus, setConnStatus] = useState<string | null>(null);

  // Table Data Search & Filter State
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Query Editor State
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<{
    rows?: Record<string, any>[];
    columns?: string[];
    executionTimeMs?: number;
    error?: string;
  } | null>(null);

  // Selected Row Detail Inspector Modal
  const [inspectedRow, setInspectedRow] = useState<Record<string, any> | null>(null);

  const activeDb = useMemo(() => {
    return SAMPLE_DATABASES.find(db => db.id === selectedDbId) || SAMPLE_DATABASES[0];
  }, [selectedDbId]);

  const activeTable = useMemo(() => {
    return activeDb.tables.find(t => t.name === selectedTableName) || activeDb.tables[0];
  }, [activeDb, selectedTableName]);

  // Database & Table Statistics Engine
  const dbStatistics = useMemo(() => {
    let totalRows = 0;
    let totalCols = 0;
    let totalFks = 0;
    let totalPks = 0;
    const typeCounts: Record<string, number> = {
      'INTEGER / Numeric': 0,
      'VARCHAR / Text': 0,
      'DATE / Timestamp': 0,
      'BOOLEAN / Bit / YesNo': 0,
      'UUID / Other': 0
    };

    activeDb.tables.forEach(t => {
      totalRows += t.rowCount;
      t.columns.forEach(c => {
        totalCols++;
        if (c.isPrimary) totalPks++;
        if (c.isForeign || c.name.endsWith('_id') || c.name.endsWith('ID')) totalFks++;

        const typeUpper = c.type.toUpperCase();
        if (typeUpper.includes('INT') || typeUpper.includes('DECIMAL') || typeUpper.includes('NUMERIC') || typeUpper.includes('FLOAT') || typeUpper.includes('LONG') || typeUpper.includes('CURRENCY')) {
          typeCounts['INTEGER / Numeric']++;
        } else if (typeUpper.includes('VARCHAR') || typeUpper.includes('TEXT') || typeUpper.includes('NVARCHAR') || typeUpper.includes('MEMO')) {
          typeCounts['VARCHAR / Text']++;
        } else if (typeUpper.includes('DATE') || typeUpper.includes('TIME')) {
          typeCounts['DATE / Timestamp']++;
        } else if (typeUpper.includes('BOOL') || typeUpper.includes('BIT') || typeUpper.includes('YESNO')) {
          typeCounts['BOOLEAN / Bit / YesNo']++;
        } else {
          typeCounts['UUID / Other']++;
        }
      });
    });

    const estSizeKb = (totalRows * 0.12 + totalCols * 0.4).toFixed(1);

    const typeDistributionData = Object.entries(typeCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));

    const tableDistributionData = activeDb.tables.map(t => ({
      name: t.name,
      rows: t.rowCount,
      columns: t.columns.length
    }));

    // Active Table Column Stats
    const colStats = activeTable.columns.map(col => {
      const vals = activeTable.rows.map(r => r[col.name]);
      const nonNullVals = vals.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
      const nullCount = vals.length - nonNullVals.length;
      const fillRate = vals.length > 0 ? (nonNullVals.length / vals.length) * 100 : 100;

      const uniqueSet = new Set(nonNullVals.map(v => String(v)));

      // Numeric stats
      const numVals = nonNullVals.map(v => Number(v)).filter(n => !isNaN(n));
      let minVal: number | null = null;
      let maxVal: number | null = null;
      let avgVal: number | null = null;
      let sumVal: number | null = null;

      if (numVals.length > 0) {
        minVal = Math.min(...numVals);
        maxVal = Math.max(...numVals);
        sumVal = numVals.reduce((a, b) => a + b, 0);
        avgVal = Number((sumVal / numVals.length).toFixed(2));
      }

      // Mode / Most Frequent
      const freqMap = new Map<string, number>();
      nonNullVals.forEach(v => {
        const s = String(v);
        freqMap.set(s, (freqMap.get(s) || 0) + 1);
      });
      let topVal = '-';
      let maxFreq = 0;
      freqMap.forEach((count, val) => {
        if (count > maxFreq) {
          maxFreq = count;
          topVal = val;
        }
      });

      return {
        colName: col.name,
        colType: col.type,
        isPrimary: col.isPrimary,
        isForeign: col.isForeign || col.name.endsWith('_id') || col.name.endsWith('ID'),
        nullCount,
        fillRate,
        uniqueCount: uniqueSet.size,
        minVal,
        maxVal,
        avgVal,
        sumVal,
        topVal,
        isNumeric: numVals.length > 0 && numVals.length === nonNullVals.length
      };
    });

    const activeTableNullabilityAvg = colStats.reduce((acc, c) => acc + c.fillRate, 0) / (colStats.length || 1);

    return {
      totalTables: activeDb.tables.length,
      totalRows,
      totalCols,
      totalPks,
      totalFks,
      estSizeKb,
      typeDistributionData,
      tableDistributionData,
      colStats,
      activeTableNullabilityAvg
    };
  }, [activeDb, activeTable]);

  // SQL Auto-Completion State & Logic
  const sqlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number>(0);

  // Compute matching suggestions based on cursor word fragment
  const autocompleteSuggestions = useMemo(() => {
    if (!sqlTextareaRef.current) return [];
    const textarea = sqlTextareaRef.current;
    const cursorPos = textarea.selectionStart ?? sqlQuery.length;
    const textBefore = sqlQuery.slice(0, cursorPos);
    const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
    const currentWord = match ? match[1] : '';

    const candidates: SqlSuggestion[] = [];

    // 1. Table names from current activeDb schema
    activeDb.tables.forEach(t => {
      candidates.push({
        text: t.name,
        type: 'table',
        detail: `Table (${t.rowCount} rows)`
      });
    });

    // 2. Column names from current activeDb schema
    activeDb.tables.forEach(t => {
      t.columns.forEach(c => {
        candidates.push({
          text: c.name,
          type: 'column',
          detail: `${t.name}.${c.name} (${c.type})`
        });
      });
    });

    // 3. Common SQL Keywords
    COMMON_SQL_KEYWORDS.forEach(kw => {
      candidates.push({
        text: kw,
        type: 'keyword',
        detail: 'SQL Keyword'
      });
    });

    // Deduplicate candidates
    const uniqueMap = new Map<string, SqlSuggestion>();
    candidates.forEach(c => {
      const key = `${c.text.toLowerCase()}:${c.type}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, c);
      }
    });

    const uniqueCandidates = Array.from(uniqueMap.values());

    if (!currentWord.trim()) {
      return uniqueCandidates.slice(0, 8);
    }

    const q = currentWord.toLowerCase();
    const filtered = uniqueCandidates.filter(item => 
      item.text.toLowerCase().includes(q)
    );

    // Contextual scoring
    const textBeforeLower = textBefore.toLowerCase();
    const expectingTable = textBeforeLower.endsWith('from ') || textBeforeLower.endsWith('join ') || textBeforeLower.endsWith('into ') || textBeforeLower.endsWith('update ');

    filtered.sort((a, b) => {
      const aText = a.text.toLowerCase();
      const bText = b.text.toLowerCase();
      const aPrefix = aText.startsWith(q);
      const bPrefix = bText.startsWith(q);

      if (aPrefix && !bPrefix) return -1;
      if (!aPrefix && bPrefix) return 1;

      if (expectingTable) {
        if (a.type === 'table' && b.type !== 'table') return -1;
        if (a.type !== 'table' && b.type === 'table') return 1;
      }

      return aText.localeCompare(bText);
    });

    return filtered.slice(0, 10);
  }, [sqlQuery, activeDb, showAutocomplete]);

  const updateAutocompleteOnInput = () => {
    if (!sqlTextareaRef.current) return;
    const textarea = sqlTextareaRef.current;
    const cursorPos = textarea.selectionStart ?? sqlQuery.length;
    const textBefore = sqlQuery.slice(0, cursorPos);
    const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
    const currentWord = match ? match[1] : '';

    if (currentWord.length >= 1) {
      setShowAutocomplete(true);
      setAutocompleteIndex(0);
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleApplySuggestion = (suggestion: SqlSuggestion) => {
    if (!sqlTextareaRef.current) return;
    const textarea = sqlTextareaRef.current;
    const cursorPos = textarea.selectionStart ?? sqlQuery.length;
    const textBefore = sqlQuery.slice(0, cursorPos);
    const textAfter = sqlQuery.slice(cursorPos);

    const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
    const wordToReplace = match ? match[1] : '';
    const replaceStart = cursorPos - wordToReplace.length;

    const newTextBefore = sqlQuery.slice(0, replaceStart) + suggestion.text + ' ';
    const newQuery = newTextBefore + textAfter;
    const newCursorPos = newTextBefore.length;

    setSqlQuery(newQuery);
    setShowAutocomplete(false);

    setTimeout(() => {
      if (sqlTextareaRef.current) {
        sqlTextareaRef.current.focus();
        sqlTextareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAutocomplete && autocompleteSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocompleteIndex(prev => (prev + 1) % autocompleteSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocompleteIndex(prev => (prev - 1 + autocompleteSuggestions.length) % autocompleteSuggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleApplySuggestion(autocompleteSuggestions[autocompleteIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        return;
      }
    }

    if (e.ctrlKey && e.key === ' ') {
      e.preventDefault();
      setShowAutocomplete(prev => !prev);
      setAutocompleteIndex(0);
    }
  };

  // Real-time SQL Syntax Validation Analysis
  const syntaxErrors = useMemo(() => {
    const tableNames = activeDb.tables.map(t => t.name);
    return validateSqlSyntax(sqlQuery, tableNames);
  }, [sqlQuery, activeDb]);

  const syntaxErrorCount = useMemo(() => {
    return syntaxErrors.filter(e => e.severity === 'error').length;
  }, [syntaxErrors]);

  const syntaxWarningCount = useMemo(() => {
    return syntaxErrors.filter(e => e.severity === 'warning').length;
  }, [syntaxErrors]);

  const handleApplySyntaxFix = (error: SqlSyntaxError) => {
    if (!error.fixType) return;

    if (error.fixType === 'add_semicolon') {
      setSqlQuery(prev => prev.trimEnd() + ';');
    } else if (error.fixType === 'close_quote') {
      if (error.id === 'unclosed-single-quote') setSqlQuery(prev => prev + "'");
      else if (error.id === 'unclosed-double-quote') setSqlQuery(prev => prev + '"');
      else if (error.id === 'unclosed-backtick') setSqlQuery(prev => prev + '`');
    } else if (error.fixType === 'close_paren') {
      const match = error.message.match(/\d+/);
      const missingCount = match ? parseInt(match[0], 10) : 1;
      setSqlQuery(prev => prev + ')'.repeat(missingCount));
    } else if (error.fixType === 'remove_trailing_comma') {
      setSqlQuery(prev => prev.replace(/,\s*(FROM|WHERE|GROUP|ORDER|LIMIT|;|$)/i, ' $1'));
    } else if (error.fixType === 'add_from') {
      const defaultTable = activeDb.tables[0]?.name || 'table_name';
      setSqlQuery(prev => prev.trimEnd() + ` FROM ${defaultTable}`);
    }
  };

  // Handle table switch
  const handleSelectTable = (tblName: string) => {
    setSelectedTableName(tblName);
    setSearchFilter('');
    setSortColumn(null);
    setSqlQuery(`SELECT * FROM ${tblName} LIMIT 50;`);
  };

  // Filter & Sort table rows
  const displayedRows = useMemo(() => {
    let rows = [...activeTable.rows];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      rows = rows.filter(row => 
        Object.values(row).some(val => 
          String(val ?? '').toLowerCase().includes(q)
        )
      );
    }

    if (sortColumn) {
      rows.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return sortDirection === 'asc' 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
    }

    return rows;
  }, [activeTable, searchFilter, sortColumn, sortDirection]);

  // Handle Sort Toggle
  const handleToggleSort = (colName: string) => {
    if (sortColumn === colName) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(colName);
      setSortDirection('asc');
    }
  };

  // Run Custom SQL Query
  const handleExecuteQuery = () => {
    const startTime = performance.now();
    const cleanSql = sqlQuery.trim().toLowerCase();

    if (!cleanSql) {
      setQueryResult({ error: 'Please enter a valid SQL query.' });
      return;
    }

    // Basic SQL simulation engine against active table
    try {
      if (cleanSql.startsWith('select')) {
        let rows = [...activeTable.rows];
        
        // Check for simple WHERE condition
        if (cleanSql.includes('where')) {
          const whereParts = cleanSql.split('where')[1].split('order by')[0].split('limit')[0].trim();
          if (whereParts.includes('>')) {
            const [col, val] = whereParts.split('>').map(s => s.trim());
            const numVal = parseFloat(val);
            if (!isNaN(numVal)) {
              rows = rows.filter(r => (r[col] ?? 0) > numVal);
            }
          }
        }

        const columns = activeTable.columns.map(c => c.name);
        const elapsed = Math.round(performance.now() - startTime + 8);
        setQueryResult({
          rows,
          columns,
          executionTimeMs: elapsed
        });
      } else if (cleanSql.startsWith('insert') || cleanSql.startsWith('update') || cleanSql.startsWith('delete')) {
        const elapsed = Math.round(performance.now() - startTime + 12);
        setQueryResult({
          rows: [],
          columns: ['status', 'rows_affected'],
          executionTimeMs: elapsed
        });
      } else {
        setQueryResult({
          rows: activeTable.rows,
          columns: activeTable.columns.map(c => c.name),
          executionTimeMs: 10
        });
      }
    } catch (err: any) {
      setQueryResult({ error: err?.message || 'Syntax error in SQL query' });
    }
  };

  // Export CSV function
  const handleExportCsv = () => {
    if (!activeTable.rows.length) return;
    const headers = activeTable.columns.map(c => c.name).join(',');
    const rowLines = activeTable.rows.map(r => 
      activeTable.columns.map(c => `"${String(r[c.name] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rowLines].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTable.name}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export SQL file to Project
  const handleExportSqlFile = () => {
    const createTableSql = `CREATE TABLE IF NOT EXISTS ${activeTable.name} (\n` +
      activeTable.columns.map(c => {
        let def = `  ${c.name} ${c.type}`;
        if (c.isPrimary) def += ' PRIMARY KEY';
        if (c.nullable === false) def += ' NOT NULL';
        return def;
      }).join(',\n') + '\n);\n\n';

    const insertRowsSql = activeTable.rows.map(r => {
      const cols = activeTable.columns.map(c => c.name).join(', ');
      const vals = activeTable.columns.map(c => {
        const v = r[c.name];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number' || typeof v === 'boolean') return v;
        return `'${String(v).replace(/'/g, "''")}'`;
      }).join(', ');
      return `INSERT INTO ${activeTable.name} (${cols}) VALUES (${vals});`;
    }).join('\n');

    const fullSql = `-- Database Schema & Data Export: ${activeDb.name}\n-- Generated by ApexStudio SQL Explorer\n\n` + createTableSql + insertRowsSql;

    if (onExportSqlToProject) {
      onExportSqlToProject(`schema_${activeTable.name}.sql`, fullSql);
    } else {
      navigator.clipboard.writeText(fullSql);
      alert(`Copied SQL table schema & rows to clipboard!`);
    }
  };

  // Analytics column detectors for Visualizer Tab
  const numericColumns = useMemo(() => {
    return activeTable.columns.filter(c => 
      ['INTEGER', 'DECIMAL', 'NUMERIC', 'FLOAT', 'INT', 'BIGINT'].some(t => c.type.includes(t))
    );
  }, [activeTable]);

  const categoricalColumn = useMemo(() => {
    return activeTable.columns.find(c => 
      ['VARCHAR', 'TEXT', 'DATE', 'TIMESTAMP'].some(t => c.type.includes(t)) && !c.isPrimary
    ) || activeTable.columns[0];
  }, [activeTable]);

  const primaryNumericCol = numericColumns[0]?.name || activeTable.columns[1]?.name;
  const secondNumericCol = numericColumns[1]?.name;

  // Filter Snippets Library
  const filteredSnippets = useMemo(() => {
    return SQL_SNIPPETS_LIBRARY.filter(snip => {
      const matchesCategory = snippetCategory === 'All' || snip.category === snippetCategory;
      const q = snippetSearchQuery.trim().toLowerCase();
      const matchesQuery = !q || (
        snip.title.toLowerCase().includes(q) ||
        snip.description.toLowerCase().includes(q) ||
        snip.snippetSql.toLowerCase().includes(q) ||
        snip.category.toLowerCase().includes(q)
      );
      return matchesCategory && matchesQuery;
    });
  }, [snippetCategory, snippetSearchQuery]);

  const handleInsertSnippet = (snippet: SqlSnippetTemplate) => {
    setSqlQuery(snippet.snippetSql);
    setActiveTab('query');
    setInsertedNotice(`Inserted "${snippet.title}" into Query Editor!`);
    setTimeout(() => setInsertedNotice(null), 3000);
  };

  const handleCopySnippet = (snippet: SqlSnippetTemplate) => {
    navigator.clipboard.writeText(snippet.snippetSql);
    setCopiedSnippetId(snippet.id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Computed generated DDL SQL
  const generatedDdlSql = useMemo(() => {
    return generateDdlSql(designerTables, designerDialect);
  }, [designerTables, designerDialect]);

  // Designer Table Operations
  const handleAddDesignerTable = () => {
    const newId = `tbl-${Date.now()}`;
    const newName = `table_${designerTables.length + 1}`;
    const newTable: DesignerTable = {
      id: newId,
      name: newName,
      columns: [
        { id: `col-${Date.now()}-1`, name: 'id', type: 'INTEGER', isPrimary: true, isAutoIncrement: true, nullable: false },
        { id: `col-${Date.now()}-2`, name: 'name', type: 'VARCHAR(255)', isPrimary: false, isAutoIncrement: false, nullable: false },
        { id: `col-${Date.now()}-3`, name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isAutoIncrement: false, nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    };
    setDesignerTables(prev => [...prev, newTable]);
  };

  const handleDeleteDesignerTable = (tableId: string) => {
    setDesignerTables(prev => prev.filter(t => t.id !== tableId));
  };

  const handleRenameDesignerTable = (tableId: string, newName: string) => {
    setDesignerTables(prev => prev.map(t => t.id === tableId ? { ...t, name: newName } : t));
  };

  const handleAddDesignerColumn = (tableId: string) => {
    setDesignerTables(prev => prev.map(t => {
      if (t.id !== tableId) return t;
      const colNum = t.columns.length + 1;
      const newCol: DesignerColumn = {
        id: `col-${Date.now()}-${colNum}`,
        name: `column_${colNum}`,
        type: 'VARCHAR(255)',
        isPrimary: false,
        isAutoIncrement: false,
        nullable: true
      };
      return { ...t, columns: [...t.columns, newCol] };
    }));
  };

  const handleUpdateDesignerColumn = (tableId: string, columnId: string, updates: Partial<DesignerColumn>) => {
    setDesignerTables(prev => prev.map(t => {
      if (t.id !== tableId) return t;
      return {
        ...t,
        columns: t.columns.map(c => c.id === columnId ? { ...c, ...updates } : c)
      };
    }));
  };

  const handleDeleteDesignerColumn = (tableId: string, columnId: string) => {
    setDesignerTables(prev => prev.map(t => {
      if (t.id !== tableId) return t;
      return {
        ...t,
        columns: t.columns.filter(c => c.id !== columnId)
      };
    }));
  };

  const handleLoadCurrentDbSchemaIntoDesigner = () => {
    const loaded: DesignerTable[] = activeDb.tables.map((tbl, idx) => ({
      id: `loaded-tbl-${idx}-${tbl.name}`,
      name: tbl.name,
      columns: tbl.columns.map((c, cIdx) => ({
        id: `loaded-col-${idx}-${cIdx}-${c.name}`,
        name: c.name,
        type: c.type || 'VARCHAR(255)',
        isPrimary: !!c.isPrimary,
        isAutoIncrement: !!c.isPrimary && c.type.includes('INT'),
        nullable: c.nullable ?? !c.isPrimary,
        defaultValue: c.defaultValue,
        foreignKey: c.isForeign ? {
          targetTable: activeDb.tables.find(other => other.name !== tbl.name && other.columns.some(oc => oc.name === c.name || (oc.isPrimary && c.name.endsWith('_id'))))?.name || '',
          targetColumn: c.name
        } : undefined
      }))
    }));
    setDesignerTables(loaded);
    setDesignerNotice(`Loaded ${loaded.length} tables from "${activeDb.name}" into Visual Designer!`);
    setTimeout(() => setDesignerNotice(null), 3500);
  };

  const handleInsertDdlToQuery = () => {
    setSqlQuery(generatedDdlSql);
    setActiveTab('query');
    setInsertedNotice(`Inserted generated DDL schema into Query Runner!`);
    setTimeout(() => setInsertedNotice(null), 3000);
  };

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(generatedDdlSql);
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-6xl h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header Bar */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between select-none ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base tracking-tight">SQL Database Studio</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                  activeDb.engine === 'postgresql'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : activeDb.engine === 'mariadb'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : activeDb.engine === 'mssql'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : activeDb.engine === 'msaccess'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : activeDb.engine === 'sqlite'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {activeDb.engine}
                </span>
                <span className="text-xs text-slate-400 font-mono">({activeDb.version})</span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect schema tables, query relational databases, & visualize data metrics
              </p>
            </div>
          </div>

          {/* Database Selector Dropdown & Close */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <Server className="w-3.5 h-3.5 text-cyan-400 ml-1.5" />
              <select
                value={selectedDbId}
                onChange={(e) => {
                  setSelectedDbId(e.target.value);
                  const db = SAMPLE_DATABASES.find(d => d.id === e.target.value);
                  if (db && db.tables.length > 0) {
                    setSelectedTableName(db.tables[0].name);
                  }
                }}
                className="bg-transparent text-xs font-semibold text-slate-200 outline-none pr-2 cursor-pointer"
              >
                {SAMPLE_DATABASES.map(db => (
                  <option key={db.id} value={db.id} className="bg-slate-900 text-slate-200">
                    {db.name} ({db.engine})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Database Explorer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Layout: Left Sidebar + Right Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Schema Tables Inspector */}
          <div className={`w-64 border-r flex flex-col ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="p-3 border-b border-slate-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tables & Schema</span>
                </span>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                  {activeDb.tables.length}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                db: <span className="text-cyan-300 font-semibold">{activeDb.databaseName}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {activeDb.tables.map(tbl => {
                const isSelected = tbl.name === selectedTableName;
                return (
                  <button
                    key={tbl.name}
                    onClick={() => handleSelectTable(tbl.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-xs'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <TableIcon className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`} />
                      <span className="font-mono font-medium truncate">{tbl.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-cyan-900/60 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tbl.rowCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Schema Column Quick Inspector */}
            <div className="p-3 border-t border-slate-800/60 bg-slate-950/80">
              <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Columns in `{activeTable.name}`</span>
                <span className="text-[10px] text-slate-500">{activeTable.columns.length} fields</span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                {activeTable.columns.map(col => (
                  <div key={col.name} className="flex items-center justify-between text-[10px] font-mono py-0.5">
                    <span className="flex items-center space-x-1 text-slate-300 truncate">
                      {col.isPrimary && <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                      <span className="truncate">{col.name}</span>
                    </span>
                    <span className="text-slate-500 shrink-0">{col.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Area: Navigation Tabs & Tab Views */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/40">
            {/* Tab Header Bar */}
            <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'grid'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Data Grid</span>
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'stats'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Common Statistics</span>
                </button>

                <button
                  onClick={() => setActiveTab('visualizer')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'visualizer'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Data Visualizer</span>
                </button>

                <button
                  onClick={() => setActiveTab('query')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'query'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-300" />
                  <span>SQL Query Runner</span>
                </button>

                <button
                  onClick={() => setActiveTab('snippets')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'snippets'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>SQL Snippets</span>
                </button>

                <button
                  onClick={() => setActiveTab('designer')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'designer'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Workflow className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Schema Designer</span>
                </button>

                <button
                  onClick={() => setActiveTab('connection')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'connection'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Connection Config</span>
                </button>
              </div>

              {/* Action Buttons: Export CSV & SQL */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCsv}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all"
                  title="Export current table data to CSV file"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleExportSqlFile}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium transition-all"
                  title="Export table schema & data into project .sql file"
                >
                  <FileCode className="w-3 h-3 text-cyan-400" />
                  <span>Export SQL to Project</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: Data Grid Table View */}
            {activeTab === 'grid' && (
              <div className="flex-1 flex flex-col overflow-hidden p-4">
                {/* Search & Filter Bar */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder={`Search in ${activeTable.name}...`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                    />
                    {searchFilter && (
                      <button 
                        onClick={() => setSearchFilter('')}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <span>Showing <strong className="text-cyan-300">{displayedRows.length}</strong> of {activeTable.rowCount} rows</span>
                    {sortColumn && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                        Sorted by `{sortColumn}` ({sortDirection})
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Data Table */}
                <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-300 font-mono z-10">
                      <tr>
                        <th className="p-2.5 w-10 text-center text-slate-500 border-r border-slate-800">#</th>
                        {activeTable.columns.map(col => (
                          <th key={col.name} className="p-2.5 border-r border-slate-800 hover:bg-slate-800/80 transition-colors">
                            <button
                              onClick={() => handleToggleSort(col.name)}
                              className="flex items-center space-x-1.5 w-full text-left cursor-pointer group"
                            >
                              <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                                {col.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({col.type})
                              </span>
                              <ArrowUpDown className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 ml-auto" />
                            </button>
                          </th>
                        ))}
                        <th className="p-2.5 w-12 text-center text-slate-500">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      {displayedRows.length === 0 ? (
                        <tr>
                          <td colSpan={activeTable.columns.length + 2} className="p-8 text-center text-slate-500">
                            No records found matching "{searchFilter}"
                          </td>
                        </tr>
                      ) : (
                        displayedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="p-2.5 text-center text-slate-500 border-r border-slate-800 text-[11px]">
                              {idx + 1}
                            </td>
                            {activeTable.columns.map(col => {
                              const val = row[col.name];
                              return (
                                <td key={col.name} className="p-2.5 border-r border-slate-800/60 text-[11px] truncate max-w-xs">
                                  {col.isPrimary ? (
                                    <span className="text-amber-300 font-semibold">{String(val ?? '')}</span>
                                  ) : typeof val === 'boolean' ? (
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${val ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                      {String(val)}
                                    </span>
                                  ) : typeof val === 'number' ? (
                                    <span className="text-cyan-300 font-semibold">{val}</span>
                                  ) : (
                                    <span>{String(val ?? '')}</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => setInspectedRow(row)}
                                className="p-1 rounded text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                                title="Inspect Row JSON"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Common Statistics Dashboard */}
            {activeTab === 'stats' && (
              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-5">
                {/* Statistics Header Banner */}
                <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-950 border border-blue-900/50 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-bold text-sm text-slate-100">Database & Table Common Statistics</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {activeDb.engine.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Real-time schema health, row counts, memory footprint, data type breakdown, and column metrics for <strong className="text-white">{activeDb.name}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('grid')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inspect Active Table Grid</span>
                    </button>
                  </div>
                </div>

                {/* Metric Cards Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Total Tables</span>
                    <div className="text-2xl font-black text-cyan-300 font-mono">{dbStatistics.totalTables}</div>
                    <span className="text-[10px] text-slate-500 font-mono">In active schema</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Total Records</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{dbStatistics.totalRows}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Row entries across tables</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Total Fields</span>
                    <div className="text-2xl font-black text-purple-400 font-mono">{dbStatistics.totalCols}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Schema columns</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Est. Size</span>
                    <div className="text-2xl font-black text-amber-300 font-mono">{dbStatistics.estSizeKb} <span className="text-xs">KB</span></div>
                    <span className="text-[10px] text-slate-500 font-mono">Memory allocation</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Foreign Keys</span>
                    <div className="text-2xl font-black text-indigo-400 font-mono">{dbStatistics.totalFks}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Linked relations</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Fill Rate Avg</span>
                    <div className="text-2xl font-black text-teal-300 font-mono">{dbStatistics.activeTableNullabilityAvg.toFixed(0)}%</div>
                    <span className="text-[10px] text-slate-500 font-mono">Non-null ratio</span>
                  </div>
                </div>

                {/* Charts Row: Data Type Distribution & Table Rows Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Chart 1: Table Row Volume Comparison */}
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        <h5 className="font-bold text-xs text-slate-200">Table Row Counts & Schema Volume</h5>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Records per table</span>
                    </div>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dbStatistics.tableDistributionData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
                          />
                          <Bar dataKey="rows" fill="#06b6d4" name="Row Count" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="columns" fill="#8b5cf6" name="Columns Count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Data Types Breakdown Donut */}
                  <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                      <div className="flex items-center space-x-2">
                        <PieChartIcon className="w-4 h-4 text-emerald-400" />
                        <h5 className="font-bold text-xs text-slate-200">Data Type Breakdown</h5>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Field categories</span>
                    </div>
                    <div className="h-56 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dbStatistics.typeDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {dbStatistics.typeDistributionData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
                          />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Column Statistical Breakdown Table */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <div className="flex items-center space-x-2">
                      <TableIcon className="w-4 h-4 text-purple-400" />
                      <h5 className="font-bold text-xs text-slate-200">
                        Column Statistical Breakdown: <strong className="text-cyan-300">`{activeTable.name}`</strong>
                      </h5>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeTable.columns.length} columns | {activeTable.rowCount} rows
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-900 text-slate-300 font-mono border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Column</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Constraints</th>
                          <th className="p-2.5">Fill Rate</th>
                          <th className="p-2.5">Unique Values</th>
                          <th className="p-2.5">Summary Statistics / Min-Max-Avg</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-mono">
                        {dbStatistics.colStats.map((col) => (
                          <tr key={col.colName} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-2.5 font-bold text-slate-200 flex items-center space-x-1.5">
                              <span>{col.colName}</span>
                              {col.isPrimary && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                              {col.isForeign && <Link2 className="w-3 h-3 text-purple-400 shrink-0" />}
                            </td>
                            <td className="p-2.5 text-cyan-300">{col.colType}</td>
                            <td className="p-2.5 text-slate-400">
                              {col.isPrimary ? <span className="text-amber-400 font-bold">PRIMARY KEY</span> : col.isForeign ? <span className="text-purple-300 font-bold">FOREIGN KEY</span> : col.nullCount === 0 ? 'NOT NULL' : 'NULLABLE'}
                            </td>
                            <td className="p-2.5">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${col.fillRate === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                    style={{ width: `${col.fillRate}%` }}
                                  />
                                </div>
                                <span className="text-[11px] text-slate-300">{col.fillRate.toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="p-2.5 text-slate-300">{col.uniqueCount} unique</td>
                            <td className="p-2.5 text-slate-300 text-[11px]">
                              {col.isNumeric ? (
                                <div className="space-x-2">
                                  <span className="text-emerald-400">Min: {col.minVal}</span>
                                  <span className="text-cyan-400">Max: {col.maxVal}</span>
                                  <span className="text-amber-300">Avg: {col.avgVal}</span>
                                  <span className="text-purple-300">Sum: {col.sumVal}</span>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-slate-400">Top Value: </span>
                                  <span className="text-cyan-300">"{col.topVal}"</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Data Visualizer ("What's best for the database data") */}
            {activeTab === 'visualizer' && (
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-800/40 p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-200">
                      Automatic Data Visualizer: Analyzing columns in <strong className="text-white">`{activeTable.name}`</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-mono">
                    Categorical: `{categoricalColumn.name}` | Numeric: `{primaryNumericCol}`
                  </span>
                </div>

                {/* KPI Card Summaries */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-400 font-medium mb-1">Total Record Count</div>
                    <div className="text-2xl font-bold text-white font-mono">{activeTable.rowCount}</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ Active database rows</div>
                  </div>

                  {primaryNumericCol && (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 font-medium mb-1">
                        Average `{primaryNumericCol}`
                      </div>
                      <div className="text-2xl font-bold text-cyan-400 font-mono">
                        {(activeTable.rows.reduce((acc, r) => acc + (Number(r[primaryNumericCol]) || 0), 0) / activeTable.rows.length).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Computed across all rows</div>
                    </div>
                  )}

                  {primaryNumericCol && (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 font-medium mb-1">
                        Max `{primaryNumericCol}`
                      </div>
                      <div className="text-2xl font-bold text-amber-400 font-mono">
                        {Math.max(...activeTable.rows.map(r => Number(r[primaryNumericCol]) || 0))}
                      </div>
                      <div className="text-[10px] text-amber-400/80 mt-1">Peak row value</div>
                    </div>
                  )}
                </div>

                {/* Chart 1: Bar Chart Visualizer */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      <span>Value Distribution by `{categoricalColumn.name}`</span>
                    </h4>
                    <span className="text-[10px] text-slate-500">Bar Chart Representation</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeTable.rows} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey={categoricalColumn.name} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                        {primaryNumericCol && <Bar dataKey={primaryNumericCol} fill="#6366f1" radius={[4, 4, 0, 0]} />}
                        {secondNumericCol && <Bar dataKey={secondNumericCol} fill="#10b981" radius={[4, 4, 0, 0]} />}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Donut / Pie Distribution */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-2">
                      <PieChartIcon className="w-4 h-4 text-emerald-400" />
                      <span>Categorical Proportion (`{categoricalColumn.name}`)</span>
                    </h4>
                    <span className="text-[10px] text-slate-500">Pie Breakdown</span>
                  </div>
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activeTable.rows}
                          dataKey={primaryNumericCol || 'rowCount'}
                          nameKey={categoricalColumn.name}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={3}
                          label={({ name }) => String(name).slice(0, 15)}
                        >
                          {activeTable.rows.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Interactive SQL Query Runner */}
            {activeTab === 'query' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-3">
                {/* Header Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>SQL Query Editor</span>
                    <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full flex items-center space-x-1 font-mono">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>Syntax Autocomplete Active</span>
                    </span>

                    {/* Syntax Status Badge */}
                    {sqlQuery.trim().length > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 font-mono border font-bold ${
                          syntaxErrorCount > 0
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : syntaxWarningCount > 0
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {syntaxErrorCount > 0 ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-rose-400 animate-pulse" />
                            <span>{syntaxErrorCount} Syntax Error{syntaxErrorCount > 1 ? 's' : ''}</span>
                          </>
                        ) : syntaxWarningCount > 0 ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>{syntaxWarningCount} Syntax Warning{syntaxWarningCount > 1 ? 's' : ''}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Valid Syntax</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <button
                      onClick={() => {
                        setShowAutocomplete(prev => !prev);
                        if (sqlTextareaRef.current) sqlTextareaRef.current.focus();
                      }}
                      className={`px-2 py-0.5 rounded border text-xs font-mono font-semibold flex items-center space-x-1 cursor-pointer transition-all ${
                        showAutocomplete
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-purple-300 border-slate-800'
                      }`}
                      title="Press Ctrl+Space in editor to toggle auto-complete suggestions"
                    >
                      <Sparkles className="w-3 h-3 text-purple-300" />
                      <span>Auto-complete (Ctrl+Space)</span>
                    </button>

                    <span className="text-slate-600">|</span>
                    <span>Presets:</span>
                    <button
                      onClick={() => setSqlQuery(`SELECT * FROM ${activeTable.name} LIMIT 20;`)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono cursor-pointer"
                    >
                      SELECT ALL
                    </button>
                    <button
                      onClick={() => setSqlQuery(`SELECT * FROM ${activeTable.name} WHERE ${primaryNumericCol || activeTable.columns[0].name} > 50;`)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono cursor-pointer"
                    >
                      WHERE FILTER
                    </button>
                    <button
                      onClick={() => setActiveTab('snippets')}
                      className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono flex items-center space-x-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>SNIPPETS →</span>
                    </button>
                  </div>
                </div>

                {/* SQL Code Textarea Container with Autocomplete Popover */}
                <div className="relative flex-col">
                  <textarea
                    ref={sqlTextareaRef}
                    value={sqlQuery}
                    onChange={(e) => {
                      setSqlQuery(e.target.value);
                      updateAutocompleteOnInput();
                    }}
                    onKeyUp={updateAutocompleteOnInput}
                    onClick={updateAutocompleteOnInput}
                    onSelect={updateAutocompleteOnInput}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Type SQL query (e.g. SELECT * FROM users WHERE role = 'admin')... Live syntax error highlighter & auto-complete active!"
                    className={`w-full h-28 bg-slate-950 border rounded-xl p-3 font-mono text-xs text-purple-200 outline-none transition-colors custom-scrollbar ${
                      sqlQuery.trim().length > 0 && syntaxErrorCount > 0
                        ? 'border-rose-500/80 focus:border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                        : sqlQuery.trim().length > 0 && syntaxWarningCount > 0
                        ? 'border-amber-500/80 focus:border-amber-400'
                        : 'border-slate-800 focus:border-purple-500'
                    }`}
                  />

                  {/* Floating Auto-complete Suggestion Popover */}
                  {showAutocomplete && autocompleteSuggestions.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 z-40 w-full max-w-md bg-slate-950/95 border border-purple-500/50 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden animate-fade-in divide-y divide-slate-800/80">
                      <div className="p-2 bg-slate-900/90 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center space-x-1 font-bold text-purple-300">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Suggestions ({autocompleteSuggestions.length})</span>
                        </span>
                        <span>↑↓ Navigate • Tab/Enter Insert</span>
                      </div>

                      <div className="max-h-48 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                        {autocompleteSuggestions.map((item, index) => {
                          const isSelected = index === autocompleteIndex;
                          return (
                            <button
                              key={`${item.text}-${item.type}-${index}`}
                              onClick={() => handleApplySuggestion(item)}
                              onMouseEnter={() => setAutocompleteIndex(index)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-900/80 text-white font-bold border border-purple-500/60 shadow-sm'
                                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase border ${
                                    item.type === 'keyword'
                                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                                      : item.type === 'table'
                                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                      : 'bg-amber-950 text-amber-300 border-amber-800'
                                  }`}
                                >
                                  {item.type}
                                </span>
                                <span className={isSelected ? 'text-cyan-200 font-bold' : 'text-slate-100'}>
                                  {item.text}
                                </span>
                              </div>

                              {item.detail && (
                                <span className="text-[10px] text-slate-400 font-normal truncate max-w-[150px]">
                                  {item.detail}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-1.5 bg-slate-900/60 text-[10px] text-slate-500 font-mono text-center flex items-center justify-between px-3">
                        <span>Press <kbd className="bg-slate-800 px-1 rounded text-slate-300">Esc</kbd> to dismiss</span>
                        <span>Press <kbd className="bg-slate-800 px-1 rounded text-slate-300">Ctrl+Space</kbd> for options</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleExecuteQuery}
                    className="absolute right-3 bottom-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer z-10"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Query</span>
                  </button>
                </div>

                {/* Real-time Syntax Linter & Error Highlighter Panel */}
                {sqlQuery.trim().length > 0 && (
                  <div className="space-y-1.5 animate-fade-in">
                    {syntaxErrors.length === 0 ? (
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold">Valid SQL Syntax</span>
                        <span className="text-[10px] text-emerald-500/80 font-normal ml-auto">Ready to run query</span>
                      </div>
                    ) : (
                      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className={`w-4 h-4 shrink-0 ${syntaxErrorCount > 0 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
                            <span className="font-bold text-slate-200">
                              {syntaxErrorCount > 0
                                ? `${syntaxErrorCount} Syntax Error${syntaxErrorCount > 1 ? 's' : ''} Detected`
                                : `${syntaxWarningCount} Syntax Warning${syntaxWarningCount > 1 ? 's' : ''}`}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">Real-time Syntax Highlighter</span>
                        </div>

                        <div className="space-y-1 max-h-28 overflow-y-auto custom-scrollbar">
                          {syntaxErrors.map((err) => (
                            <div
                              key={err.id}
                              className={`flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border ${
                                err.severity === 'error'
                                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                                  : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                              }`}
                            >
                              <div className="flex items-center space-x-2 shrink-0">
                                <span
                                  className={`px-1.5 py-0.2 text-[9px] font-bold uppercase rounded border ${
                                    err.severity === 'error'
                                      ? 'bg-rose-900/80 text-rose-200 border-rose-700'
                                      : 'bg-amber-900/80 text-amber-200 border-amber-700'
                                  }`}
                                >
                                  {err.severity}
                                </span>
                                <span>{err.message}</span>
                              </div>

                              {err.fixable && err.fixDescription && (
                                <button
                                  onClick={() => handleApplySyntaxFix(err)}
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/50 rounded text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-all ml-auto"
                                  title="Click to automatically fix this syntax issue"
                                >
                                  <Sparkles className="w-3 h-3 text-cyan-400" />
                                  <span>Fix: {err.fixDescription}</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Schema Insertion Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400 py-1 border-t border-slate-900">
                  <span className="text-slate-500 font-bold">Quick Schema Insert:</span>
                  {activeDb.tables.map(tbl => (
                    <button
                      key={tbl.name}
                      onClick={() => handleApplySuggestion({ text: tbl.name, type: 'table' })}
                      className="px-2 py-0.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 rounded text-[10px] font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                      title={`Insert table "${tbl.name}" at cursor position`}
                    >
                      <TableIcon className="w-3 h-3 text-cyan-400" />
                      <span>{tbl.name}</span>
                    </button>
                  ))}

                  {activeTable.columns.slice(0, 4).map(col => (
                    <button
                      key={col.name}
                      onClick={() => handleApplySuggestion({ text: col.name, type: 'column' })}
                      className="px-2 py-0.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 rounded text-[10px] font-semibold transition-all cursor-pointer"
                      title={`Insert column "${col.name}" at cursor position`}
                    >
                      <span>+{col.name}</span>
                    </button>
                  ))}
                </div>

                {/* Query Results View */}
                <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs custom-scrollbar">
                  {queryResult === null ? (
                    <div className="h-full flex items-center justify-center text-slate-500">
                      Click "Run Query" or select a preset snippet above to execute SQL
                    </div>
                  ) : queryResult.error ? (
                    <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-lg text-red-300 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <strong className="block font-bold">SQL Execution Error</strong>
                        <p>{queryResult.error}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Query executed successfully</span>
                        </span>
                        <span>Execution time: <strong className="text-white">{queryResult.executionTimeMs} ms</strong></span>
                      </div>

                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            {queryResult.columns?.map(col => (
                              <th key={col} className="p-2 border-r border-slate-800">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {queryResult.rows?.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-900/80">
                              {queryResult.columns?.map(col => (
                                <td key={col} className="p-2 border-r border-slate-800/60">{String(r[col] ?? '')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: SQL Snippets Library */}
            {activeTab === 'snippets' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-3">
                {/* Search, Filter & Status Toast Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl shrink-0">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['All', 'JOINs', 'Aggregations', 'Formatting', 'Window Functions', 'DDL & Schema'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSnippetCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          snippetCategory === cat
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Input & Notice */}
                  <div className="flex items-center space-x-3">
                    {insertedNotice && (
                      <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg animate-fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{insertedNotice}</span>
                      </span>
                    )}

                    <div className="relative w-48 sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={snippetSearchQuery}
                        onChange={(e) => setSnippetSearchQuery(e.target.value)}
                        placeholder="Search SQL templates..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Snippets Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  {filteredSnippets.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <BookOpen className="w-8 h-8 text-slate-600" />
                      <p className="text-xs">No SQL templates found matching "{snippetSearchQuery}"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-2">
                      {filteredSnippets.map(snip => (
                        <div
                          key={snip.id}
                          className="bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between transition-all shadow-sm group"
                        >
                          <div>
                            {/* Card Header: Title & Badges */}
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h5 className="font-mono font-bold text-xs text-slate-100 flex items-center space-x-2">
                                <Code2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="group-hover:text-amber-300 transition-colors">{snip.title}</span>
                              </h5>
                              <div className="flex items-center space-x-1 shrink-0">
                                <span className="px-2 py-0.5 text-[10px] rounded-md font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                                  {snip.category}
                                </span>
                                <span className="px-1.5 py-0.5 text-[10px] rounded text-slate-400 font-mono bg-slate-900 border border-slate-800">
                                  {snip.engineTag}
                                </span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-400 mb-2.5">
                              {snip.description}
                            </p>

                            {/* SQL Code Block */}
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 mb-3 font-mono text-[11px] text-amber-200/90 overflow-x-auto max-h-36 custom-scrollbar whitespace-pre">
                              {snip.snippetSql}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                            <span className="text-[10px] text-slate-500 font-mono">
                              Engine: {snip.engineTag}
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCopySnippet(snip)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
                                title="Copy SQL template to clipboard"
                              >
                                {copiedSnippetId === snip.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-400" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleInsertSnippet(snip)}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                                title="Insert into Query Editor and open Query tab"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Insert & Run</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Visual Schema Designer */}
            {activeTab === 'designer' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-3">
                {/* Designer Toolbar Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl shrink-0">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Dialect Selector */}
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                      <span className="text-[11px] text-slate-400 font-mono font-bold uppercase">Dialect:</span>
                      <select
                        value={designerDialect}
                        onChange={(e) => setDesignerDialect(e.target.value as SqlEngine)}
                        className="bg-transparent text-xs font-bold text-cyan-300 font-mono outline-none cursor-pointer"
                      >
                        <option value="postgresql" className="bg-slate-900 text-slate-200">PostgreSQL</option>
                        <option value="mysql" className="bg-slate-900 text-slate-200">MySQL</option>
                        <option value="sqlite" className="bg-slate-900 text-slate-200">SQLite</option>
                        <option value="mariadb" className="bg-slate-900 text-slate-200">MariaDB</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={handleAddDesignerTable}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Table</span>
                    </button>

                    <button
                      onClick={handleLoadCurrentDbSchemaIntoDesigner}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                      title="Load tables from selected active database into designer"
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Import Active DB Schema</span>
                    </button>

                    <button
                      onClick={() => setDesignerTables(INITIAL_DESIGNER_TABLES)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-lg text-xs font-medium transition-all cursor-pointer"
                      title="Reset schema to default starter template"
                    >
                      <span>Reset Starter Schema</span>
                    </button>
                  </div>

                  {/* Feedback Notice Toast */}
                  {designerNotice && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg animate-fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{designerNotice}</span>
                    </span>
                  )}

                  <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 font-bold">
                      {designerTables.length} Tables
                    </span>
                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-300 font-bold">
                      {designerTables.reduce((acc, t) => acc + t.columns.length, 0)} Fields
                    </span>
                  </div>
                </div>

                {/* Main Workspace: Left Interactive Tables Grid + Right Live DDL Preview Panel */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
                  {/* Left Column: Interactive Table Cards */}
                  <div className="lg:col-span-7 xl:col-span-8 overflow-y-auto custom-scrollbar pr-1 space-y-4">
                    {designerTables.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 space-y-3">
                        <Workflow className="w-10 h-10 text-slate-600" />
                        <p className="text-xs">No tables defined in Schema Designer.</p>
                        <button
                          onClick={handleAddDesignerTable}
                          className="px-3 py-1.5 bg-cyan-600 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Your First Table</span>
                        </button>
                      </div>
                    ) : (
                      designerTables.map((tbl) => (
                        <div
                          key={tbl.id}
                          className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 transition-all shadow-sm space-y-3"
                        >
                          {/* Table Card Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-900 gap-2">
                            <div className="flex items-center space-x-2 flex-1">
                              <TableIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                              <input
                                type="text"
                                value={tbl.name}
                                onChange={(e) => handleRenameDesignerTable(tbl.id, e.target.value)}
                                className="bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded px-2 py-0.5 font-mono font-bold text-xs text-cyan-200 outline-none w-48 transition-colors"
                                placeholder="table_name"
                              />
                              <span className="text-[10px] text-slate-500 font-mono">
                                ({tbl.columns.length} columns)
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => handleAddDesignerColumn(tbl.id)}
                                className="px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                                title="Add Column to this table"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Col</span>
                              </button>

                              <button
                                onClick={() => handleDeleteDesignerTable(tbl.id)}
                                className="p-1 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                                title="Delete table"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Columns List Table */}
                          <div className="space-y-1.5">
                            {tbl.columns.map((col, cIdx) => (
                              <div
                                key={col.id}
                                className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-900/80 border border-slate-800/80 p-2 rounded-lg text-xs"
                              >
                                {/* Column Name */}
                                <div className="flex items-center space-x-1.5 flex-1 min-w-[120px]">
                                  <span className="text-[10px] font-mono text-slate-600 w-4">{cIdx + 1}.</span>
                                  <input
                                    type="text"
                                    value={col.name}
                                    onChange={(e) => handleUpdateDesignerColumn(tbl.id, col.id, { name: e.target.value })}
                                    className="bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded px-1.5 py-0.5 font-mono text-xs text-slate-100 outline-none w-full"
                                    placeholder="column_name"
                                  />
                                </div>

                                {/* Data Type Selector */}
                                <select
                                  value={col.type}
                                  onChange={(e) => handleUpdateDesignerColumn(tbl.id, col.id, { type: e.target.value })}
                                  className="bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                                >
                                  <option value="INTEGER">INTEGER</option>
                                  <option value="BIGINT">BIGINT</option>
                                  <option value="VARCHAR(255)">VARCHAR(255)</option>
                                  <option value="TEXT">TEXT</option>
                                  <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                                  <option value="BOOLEAN">BOOLEAN</option>
                                  <option value="TIMESTAMP">TIMESTAMP</option>
                                  <option value="UUID">UUID</option>
                                  <option value="JSONB">JSONB</option>
                                </select>

                                {/* Toggle Primary Key */}
                                <button
                                  onClick={() => handleUpdateDesignerColumn(tbl.id, col.id, { isPrimary: !col.isPrimary })}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                    col.isPrimary
                                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                                      : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                                  }`}
                                  title="Toggle Primary Key constraint"
                                >
                                  PK
                                </button>

                                {/* Toggle Nullable */}
                                <button
                                  onClick={() => handleUpdateDesignerColumn(tbl.id, col.id, { nullable: !col.nullable })}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                    col.nullable
                                      ? 'bg-blue-950 text-blue-300 border border-blue-800/80'
                                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                                  }`}
                                  title="Toggle NOT NULL constraint"
                                >
                                  {col.nullable ? 'NULL' : 'NOT NULL'}
                                </button>

                                {/* Foreign Key Config Selector */}
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => {
                                      if (col.foreignKey) {
                                        handleUpdateDesignerColumn(tbl.id, col.id, { foreignKey: undefined });
                                      } else {
                                        const otherTable = designerTables.find(t => t.id !== tbl.id);
                                        handleUpdateDesignerColumn(tbl.id, col.id, {
                                          foreignKey: {
                                            targetTable: otherTable?.name || '',
                                            targetColumn: otherTable?.columns[0]?.name || 'id'
                                          }
                                        });
                                      }
                                    }}
                                    className={`p-1 rounded transition-colors cursor-pointer ${
                                      col.foreignKey
                                        ? 'bg-purple-900/60 text-purple-300 border border-purple-700/80'
                                        : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                                    }`}
                                    title="Configure Foreign Key reference"
                                  >
                                    <Link2 className="w-3 h-3" />
                                  </button>

                                  {col.foreignKey && (
                                    <select
                                      value={`${col.foreignKey.targetTable}.${col.foreignKey.targetColumn}`}
                                      onChange={(e) => {
                                        const [tTab, tCol] = e.target.value.split('.');
                                        handleUpdateDesignerColumn(tbl.id, col.id, {
                                          foreignKey: { targetTable: tTab || '', targetColumn: tCol || '' }
                                        });
                                      }}
                                      className="bg-purple-950/80 border border-purple-800 text-[10px] font-mono text-purple-200 rounded px-1 py-0.5 outline-none max-w-[110px]"
                                    >
                                      {designerTables.filter(t => t.id !== tbl.id).map(t => (
                                        t.columns.map(c => (
                                          <option key={`${t.name}.${c.name}`} value={`${t.name}.${c.name}`}>
                                            → {t.name}.{c.name}
                                          </option>
                                        ))
                                      ))}
                                    </select>
                                  )}
                                </div>

                                {/* Default Value Input */}
                                <input
                                  type="text"
                                  value={col.defaultValue || ''}
                                  onChange={(e) => handleUpdateDesignerColumn(tbl.id, col.id, { defaultValue: e.target.value })}
                                  placeholder="Default..."
                                  className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-300 w-20 outline-none focus:border-cyan-500"
                                />

                                {/* Delete Column Button */}
                                <button
                                  onClick={() => handleDeleteDesignerColumn(tbl.id, col.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Delete Column"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Column: Live DDL SQL Generator Preview */}
                  <div className="lg:col-span-5 xl:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between overflow-hidden">
                    <div className="flex flex-col h-full overflow-hidden space-y-2">
                      {/* DDL Preview Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-900 shrink-0">
                        <div className="flex items-center space-x-2">
                          <Code2 className="w-4 h-4 text-cyan-400" />
                          <h5 className="font-bold text-xs text-slate-200">Generated DDL Script</h5>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                          {designerDialect.toUpperCase()}
                        </span>
                      </div>

                      {/* SQL Output Box */}
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-cyan-200/90 overflow-y-auto custom-scrollbar whitespace-pre">
                        {generatedDdlSql}
                      </div>

                      {/* Action Buttons Footer */}
                      <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
                        <button
                          onClick={handleCopyDdl}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
                        >
                          {copiedDdl ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy DDL</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center space-x-2">
                          {onExportSqlToProject && (
                            <button
                              onClick={() => onExportSqlToProject('schema.sql', generatedDdlSql)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
                              title="Save schema.sql file directly to project workspace"
                            >
                              <Save className="w-3.5 h-3.5 text-amber-400" />
                              <span>Save to File</span>
                            </button>
                          )}

                          <button
                            onClick={handleInsertDdlToQuery}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1 shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
                            title="Insert into Query Runner and execute"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run in Query Tab</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: Connection Configurator */}
            {activeTab === 'connection' && (
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl max-w-2xl mx-auto space-y-4">
                  <h4 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Connect to Custom PostgreSQL / MySQL Server</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Database Engine</label>
                      <select
                        value={connEngine}
                        onChange={(e) => setConnEngine(e.target.value as SqlEngine)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono outline-none"
                      >
                        <option value="postgresql">PostgreSQL</option>
                        <option value="mysql">MySQL Engine</option>
                        <option value="mariadb">MariaDB (Galera / ColumnStore)</option>
                        <option value="mssql">Microsoft SQL Server (T-SQL)</option>
                        <option value="msaccess">Microsoft Access (.accdb)</option>
                        <option value="sqlite">SQLite3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Host / Server Endpoint</label>
                      <input
                        type="text"
                        value={connHost}
                        onChange={(e) => setConnHost(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Port</label>
                      <input
                        type="number"
                        value={connPort}
                        onChange={(e) => setConnPort(parseInt(e.target.value) || 5432)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Database Name</label>
                      <input
                        type="text"
                        value={connDbName}
                        onChange={(e) => setConnDbName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Username</label>
                      <input
                        type="text"
                        value={connUser}
                        onChange={(e) => setConnUser(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Password</label>
                      <input
                        type="password"
                        value={connPass}
                        onChange={(e) => setConnPass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setConnStatus('testing');
                        setTimeout(() => {
                          setConnStatus(`Successfully pinged ${connEngine.toUpperCase()} host at ${connHost}:${connPort}! (Latency: 14ms)`);
                        }, 600);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${connStatus === 'testing' ? 'animate-spin' : ''}`} />
                      <span>Test Server Connection</span>
                    </button>

                    {connStatus && connStatus !== 'testing' && (
                      <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{connStatus}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row JSON Detail Inspector Modal */}
      {inspectedRow && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-200">Row Record Inspector</h4>
              <button onClick={() => setInspectedRow(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-cyan-300 font-mono overflow-auto max-h-80">
              {JSON.stringify(inspectedRow, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
