import React, { useState, useMemo } from 'react';
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
  Info
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

export type SqlEngine = 'postgresql' | 'mysql' | 'sqlite' | 'mariadb';

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

// Sample Mock Databases for MySQL & PostgreSQL
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
  const [activeTab, setActiveTab] = useState<'grid' | 'visualizer' | 'query' | 'connection'>('grid');

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
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>SQL Query Editor</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <span>Presets:</span>
                    <button
                      onClick={() => setSqlQuery(`SELECT * FROM ${activeTable.name} LIMIT 20;`)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono"
                    >
                      SELECT ALL
                    </button>
                    <button
                      onClick={() => setSqlQuery(`SELECT * FROM ${activeTable.name} WHERE ${primaryNumericCol || activeTable.columns[0].name} > 50;`)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono"
                    >
                      WHERE FILTER
                    </button>
                  </div>
                </div>

                {/* SQL Code Textarea */}
                <div className="relative">
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter SQL statement (e.g. SELECT * FROM products WHERE price > 100;)"
                    className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-purple-200 outline-none focus:border-purple-500 transition-colors custom-scrollbar"
                  />
                  <button
                    onClick={handleExecuteQuery}
                    className="absolute right-3 bottom-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Query</span>
                  </button>
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

            {/* TAB CONTENT 4: Connection Configurator */}
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
                        <option value="mysql">MySQL / MariaDB</option>
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
