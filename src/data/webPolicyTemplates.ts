export interface WebPolicyPreset {
  id: string;
  filename: string;
  displayName: string;
  description: string;
  category: string;
  iconName: string;
  defaultContent: string;
}

export const WEB_POLICY_PRESETS: WebPolicyPreset[] = [
  {
    id: 'robots-txt',
    filename: 'robots.txt',
    displayName: 'robots.txt',
    description: 'Directives for search engine web crawlers (Google, Bing, DuckDuckGo)',
    category: 'SEO & Crawling',
    iconName: 'Bot',
    defaultContent: `# robots.txt - Search Engine Crawler Directives
# Standard documentation: https://www.robotstxt.org/

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /tmp/

# Crawl-delay for rate limiting (seconds)
Crawl-delay: 10

# Sitemap location
Sitemap: https://example.com/sitemap.xml
`
  },
  {
    id: 'security-txt',
    filename: 'security.txt',
    displayName: 'security.txt',
    description: 'RFC 9116 Vulnerability Disclosure Contact & Security Policy',
    category: 'Security & RFC 9116',
    iconName: 'ShieldCheck',
    defaultContent: `# security.txt - RFC 9116 Security Vulnerability Disclosure Standard
# Standard documentation: https://securitytxt.org/

Contact: mailto:security@example.com
Contact: https://example.com/security/report
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en, es, fr
Canonical: https://example.com/.well-known/security.txt
Policy: https://example.com/security/policy
Hiring: https://example.com/careers
`
  },
  {
    id: 'ads-txt',
    filename: 'ads.txt',
    displayName: 'ads.txt',
    description: 'IAB Tech Lab Authorized Digital Sellers Verification',
    category: 'Advertising & Monetization',
    iconName: 'DollarSign',
    defaultContent: `# ads.txt - Authorized Digital Sellers (IAB Tech Lab Standard)
# Standard documentation: https://iabtechlab.com/ads-txt/
# Format: <Domain Name>, <Publisher Account ID>, <Account Type (DIRECT|RESELLER)>, <Certificate Authority ID>

# Google AdSense / Ad Exchange
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# Example Reseller networks
# rubiconproject.com, 1234, RESELLER, 0bf1b92d9b83b102
# appnexus.com, 5678, RESELLER, f5b72fdda170a312
`
  },
  {
    id: 'trust-txt',
    filename: 'trust.txt',
    displayName: 'Trust.txt / trust.txt',
    description: 'Digital Journalism & Publisher Ownership Specification',
    category: 'Publisher Trust & Ownership',
    iconName: 'FileCheck',
    defaultContent: `# trust.txt - Digital Journalism & Publisher Ownership Specification
# Standard documentation: https://trusttxt.org/

# Contact & Ownership Disclosures
contact=mailto:editor@example.com
vendor=example.com
member=https://trusttxt.org/
social=https://twitter.com/example
policy=https://example.com/editorial-policy
publisher=Example Media Group LLC
`
  }
];

export function getWebPolicyDefaultContent(filename: string): string | null {
  const normalized = filename.trim().toLowerCase();
  if (normalized === 'robots.txt') {
    return WEB_POLICY_PRESETS.find(p => p.id === 'robots-txt')?.defaultContent || null;
  }
  if (normalized === 'security.txt') {
    return WEB_POLICY_PRESETS.find(p => p.id === 'security-txt')?.defaultContent || null;
  }
  if (normalized === 'ads.txt') {
    return WEB_POLICY_PRESETS.find(p => p.id === 'ads-txt')?.defaultContent || null;
  }
  if (normalized === 'trust.txt') {
    return WEB_POLICY_PRESETS.find(p => p.id === 'trust-txt')?.defaultContent || null;
  }
  return null;
}
