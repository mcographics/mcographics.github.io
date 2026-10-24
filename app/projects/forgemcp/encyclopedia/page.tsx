import type { Metadata } from 'next';
import Encyclopedia from './Encyclopedia';
import './encyclopedia.css';

export const metadata: Metadata = {
  title: 'ForgeMCP Encyclopedia · Engineering Archive',
  description: 'Source-backed ForgeMCP architecture, development reports, failures, milestones and historical acceptance evidence.',
  alternates: { canonical: '/projects/forgemcp/encyclopedia/' },
};

export default function EncyclopediaPage() { return <Encyclopedia />; }
