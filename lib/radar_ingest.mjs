import { getSources, saveItems } from './radar_db.mjs';

function getTagContent(text, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = regex.exec(text);
  return match ? match[1] : '';
}

export function parseRSS(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const title = getTagContent(itemContent, 'title') || '';
    const link = getTagContent(itemContent, 'link') || '';
    const description = getTagContent(itemContent, 'description') || getTagContent(itemContent, 'summary') || '';
    const pubDate = getTagContent(itemContent, 'pubDate') || getTagContent(itemContent, 'pubdate') || getTagContent(itemContent, 'dc:date') || '';
    const author = getTagContent(itemContent, 'dc:creator') || getTagContent(itemContent, 'author') || '';

    // Clean html and CDATA wrappers
    const cleanTitle = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    const cleanLink = link.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    const cleanAuthor = author.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    const cleanDesc = description.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanTitle && cleanLink) {
      items.push({
        title: cleanTitle,
        url: cleanLink,
        description: cleanDesc.slice(0, 1000),
        author: cleanAuthor || 'Unknown',
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        ingestedAt: new Date().toISOString()
      });
    }
  }
  return items;
}

export function parseArxiv(xmlText) {
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryContent = match[1];
    const title = getTagContent(entryContent, 'title') || '';
    const idLink = getTagContent(entryContent, 'id') || '';
    const summary = getTagContent(entryContent, 'summary') || '';
    const published = getTagContent(entryContent, 'published') || '';
    const author = getTagContent(entryContent, 'name') || '';

    const cleanTitle = title.replace(/\s+/g, ' ').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    const cleanLink = idLink.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    const cleanAuthor = author.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    const cleanDesc = summary.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanTitle && cleanLink) {
      items.push({
        title: cleanTitle,
        url: cleanLink,
        description: cleanDesc.slice(0, 1000),
        author: cleanAuthor || 'arXiv Contributor',
        publishedAt: published ? new Date(published).toISOString() : new Date().toISOString(),
        ingestedAt: new Date().toISOString()
      });
    }
  }
  return items;
}

export async function fetchFeed(source) {
  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mentat-Commons-Radar/1.0',
        'Accept': 'application/xml, text/xml, */*'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    
    let parsed = [];
    if (source.sourceType === 'arxiv') {
      parsed = parseArxiv(text);
    } else {
      parsed = parseRSS(text);
    }
    
    // Set source association
    return parsed.map(item => ({ ...item, sourceId: source.id }));
  } catch (error) {
    console.error(`[Radar Ingest] Error fetching feed '${source.name}':`, error.message);
    return [];
  }
}

export async function ingestAll() {
  const sources = await getSources();
  const activeSources = sources.filter(s => s.active === 1);
  console.log(`[Radar Ingest] Ingesting from ${activeSources.length} active sources...`);
  
  const allIngested = [];
  for (const src of activeSources) {
    const items = await fetchFeed(src);
    console.log(`  - Ingested ${items.length} items from '${src.name}'`);
    allIngested.push(...items);
  }
  
  if (allIngested.length > 0) {
    await saveItems(allIngested);
  }
  console.log(`[Radar Ingest] Completed. Ingested ${allIngested.length} total items.`);
  return allIngested;
}
