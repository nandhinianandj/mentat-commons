import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.mentatcommons.com';
const CKB_FILE = path.join(process.cwd(), 'data', 'career_knowledge_base.json');
const LOCALES_FILE = path.join(process.cwd(), 'locales', 'en.json');
const SITEMAP_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

// Standard static pages
const STATIC_PAGES = [
  '',
  '/about',
  '/services',
  '/portfolio',
  '/training',
  '/narrative',
  '/faq',
  '/career',
  '/contact',
  '/links',
  '/copilot',
  '/core',
  '/axis1',
  '/axis1/ai-ml-consulting',
  '/axis1/decision-systems',
  '/axis1/research-frameworks',
  '/axis2',
  '/axis2/writing',
  '/axis2/theatre-facilitation',
  '/axis2/applied-improv',
  '/organizational-systems'
];

async function generateSitemap() {
  console.log('Generating dynamic sitemap.xml...');

  try {
    const urls = [];

    // 1. Add static pages
    for (const page of STATIC_PAGES) {
      urls.push(`${BASE_URL}${page}`);
    }

    // 2. Read locales for dynamic service pages
    const localesContent = await fs.readFile(LOCALES_FILE, 'utf-8');
    const locales = JSON.parse(localesContent);
    if (locales.services) {
      Object.keys(locales.services).forEach(slug => {
        urls.push(`${BASE_URL}/services/${slug}`);
      });
    }

    // 3. Read Career Knowledge Base for dynamic node routes
    const ckbContent = await fs.readFile(CKB_FILE, 'utf-8');
    const ckb = JSON.parse(ckbContent);

    // Add Projects
    if (ckb.projects && Array.isArray(ckb.projects)) {
      ckb.projects.forEach(proj => {
        if (proj.id) {
          urls.push(`${BASE_URL}/career?node=${proj.id}`);
        }
      });
    }

    // Add Experiences
    if (ckb.experiences && Array.isArray(ckb.experiences)) {
      ckb.experiences.forEach(exp => {
        if (exp.id) {
          urls.push(`${BASE_URL}/career?node=${exp.id}`);
        }
      });
    }

    // Add Talks
    if (ckb.talks && Array.isArray(ckb.talks)) {
      ckb.talks.forEach(talk => {
        if (talk.id) {
          urls.push(`${BASE_URL}/career?node=${talk.id}`);
        }
      });
    }

    // Add Community Work
    if (ckb.community && Array.isArray(ckb.community)) {
      ckb.community.forEach(comm => {
        if (comm.id) {
          urls.push(`${BASE_URL}/career?node=${comm.id}`);
        }
      });
    }

    // Add Writing
    if (ckb.writing) {
      Object.entries(ckb.writing).forEach(([category, list]) => {
        if (!Array.isArray(list)) return;
        list.forEach(write => {
          if (!write.id) return;
          
          // Every article has a career deep link
          urls.push(`${BASE_URL}/career?node=${write.id}`);

          // Speculative stories, essays, or AI-assisted content are also accessible in narrative route
          if (category === 'stories' || category === 'essays' || write.ai_assisted === true) {
            urls.push(`${BASE_URL}/narrative?node=${write.id}`);
          }
        });
      });
    }

    // 4. Read Organizational Systems for published case & essay routes
    try {
      const orgSystemsFile = path.join(process.cwd(), 'data', 'organizational_systems.json');
      const orgContent = await fs.readFile(orgSystemsFile, 'utf-8');
      const orgData = JSON.parse(orgContent);
      if (orgData.items && Array.isArray(orgData.items)) {
        orgData.items.forEach(item => {
          if (item.publication_status === 'published' && item.slug) {
            urls.push(`${BASE_URL}/organizational-systems/${item.slug}`);
          }
        });
      }
    } catch (err) {
      console.warn('Warning: Could not read organizational_systems.json for sitemap:', err.message);
    }

    // Sort and remove duplicates just in case
    const uniqueUrls = Array.from(new Set(urls)).sort();

    // Generate XML content
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of uniqueUrls) {
      // Escape XML characters (especially & for query parameters)
      const escapedUrl = url.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      xmlContent += `  <url><loc>${escapedUrl}</loc></url>\n`;
    }
    
    xmlContent += '</urlset>\n';

    await fs.writeFile(SITEMAP_FILE, xmlContent, 'utf-8');
    console.log(`✓ Sitemap generated successfully! Added ${uniqueUrls.length} URLs to public/sitemap.xml.`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
