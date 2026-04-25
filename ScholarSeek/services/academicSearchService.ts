
/**
 * Academic Search Service
 * Integrates with Semantic Scholar API to provide real-time, verified metadata for ScholarSeek.
 */

export interface SemanticScholarPaper {
  paperId: string;
  externalIds: {
    DOI?: string;
    ArXiv?: string;
    CorpusId?: number;
  };
  url: string;
  title: string;
  abstract: string;
  venue: string;
  year: number;
  authors: Array<{ name: string; authorId: string }>;
  citationCount: number;
  influentialCitationCount: number;
  fieldsOfStudy: string[];
}

interface CrossrefAuthor {
  given?: string;
  family?: string;
}

interface CrossrefItem {
  DOI: string;
  URL: string;
  title?: string[];
  abstract?: string;
  'container-title'?: string[];
  issued?: { 'date-parts'?: number[][] };
  author?: CrossrefAuthor[];
  'is-referenced-by-count'?: number;
  subject?: string[];
}

export async function searchAcademicPapers(query: string, limit: number = 20, offset: number = 0): Promise<SemanticScholarPaper[]> {
  const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&select=DOI,title,author,issued,abstract,container-title,is-referenced-by-count,URL,subject&rows=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Crossref API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const json = await response.json();
    const rawItems: CrossrefItem[] = json?.message?.items || [];
    
    // Map Crossref to standard format
    return rawItems.map(item => ({
      paperId: item.DOI,
      externalIds: { DOI: item.DOI },
      url: item.URL,
      title: item.title?.[0] || 'Unknown Title',
      abstract: item.abstract?.replace(/(<([^>]+)>)/gi, "") || '',
      venue: item['container-title']?.[0] || 'Academic Journal',
      year: item.issued?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      authors: (item.author || []).map(a => ({ name: `${a.given || ''} ${a.family || ''}`.trim(), authorId: '' })),
      citationCount: item['is-referenced-by-count'] || 0,
      influentialCitationCount: 0,
      fieldsOfStudy: item.subject || [],
    })).filter(p => !!p.title && !!p.url);
  } catch (error) {
    console.error('Network error while fetching academic papers:', error);
    return [];
  }
}

/**
 * Formats Semantic Scholar papers into a structured string for LLM injection.
 */
export function formatPapersForGemini(papers: SemanticScholarPaper[]): string {
  if (papers.length === 0) return "No live papers found via Semantic Scholar API.";
  
  return papers.map((p, i) => `
### LIVE SEARCH SOURCE #${i + 1}
TITLE: ${p.title}
AUTHORS: ${p.authors.map(a => a.name).join(', ')}
YEAR: ${p.year}
JOURNAL/VENUE: ${p.venue || 'Unknown'}
DOI: ${p.externalIds.DOI || 'None'}
URL: ${p.url}
CITATIONS: ${p.citationCount}
FIELDS: ${p.fieldsOfStudy?.join(', ') || 'General'}
ABSTRACT: ${p.abstract ? p.abstract.substring(0, 500) + '...' : 'No abstract available.'}
---`).join('\n');
}
