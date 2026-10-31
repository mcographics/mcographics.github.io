export const sortOptions = [
  ['oldest', 'Earliest date → latest'],
  ['newest', 'Latest date → earliest'],
  ['az', 'Title: A → Z'],
  ['za', 'Title: Z → A'],
];

export const archiveSortStorageKey = 'majestic-archive-sort';
const legacyStorageKey = 'forgemcp-archive-sort';

export function loadArchiveSort(fallback = 'oldest') {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = window.localStorage.getItem(archiveSortStorageKey);
    if (saved && sortOptions.some(([value]) => value === saved)) return saved;
    const legacy = window.localStorage.getItem(legacyStorageKey);
    if (legacy && sortOptions.some(([value]) => value === legacy)) {
      window.localStorage.setItem(archiveSortStorageKey, legacy);
      return legacy;
    }
  } catch { /* Storage may be unavailable; sorting still works for this view. */ }
  return fallback;
}

export function saveArchiveSort(value) {
  if (!sortOptions.some(([option]) => option === value)) return;
  try { window.localStorage.setItem(archiveSortStorageKey, value); }
  catch { /* Keep the selected order for this page when storage is unavailable. */ }
}

/** @template {{title:string,path?:string,slug?:string,id?:string,date:string|null,archiveOrder?:number|null}} T
 * @param {T[]} records
 * @param {string} order
 * @returns {T[]}
 */
export function orderRecords(records, order) {
  const compare = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare;
  const pathOf = (record) => record.path || record.slug || record.id || '';
  return [...records].sort((a, b) => {
    const alpha = compare(a.title, b.title) || compare(pathOf(a), pathOf(b));
    if (order === 'az') return alpha;
    if (order === 'za') return -alpha;
    if (!a.date && !b.date) return alpha;
    if (!a.date) return 1;
    if (!b.date) return -1;
    const chronological = a.date.localeCompare(b.date);
    const dateOrder = (order === 'newest' ? -chronological : chronological);
    if (dateOrder) return dateOrder;
    if ('archiveOrder' in a || 'archiveOrder' in b) {
      const aOrder = a.archiveOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.archiveOrder ?? Number.MAX_SAFE_INTEGER;
      return aOrder === bOrder ? compare(pathOf(a), pathOf(b)) : aOrder - bOrder;
    }
    return alpha;
  });
}
