import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { judasChapters } from '@/lib/judas-data';

export async function generateStaticParams() {
  return judasChapters.map(chapter => ({
    capitulo: chapter.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ capitulo: string }> }): Promise<Metadata> {
  const { capitulo } = await params;
  const chapter = judasChapters.find(c => c.id === capitulo);
  return {
    title: chapter ? `${chapter.name} | JUDAS | Belentani` : 'JUDAS | Belentani',
    description: chapter?.lore || 'JUDAS - Narrative universe by Belentani',
  };
}

import ChapterContent from './ChapterContent';

export default async function ChapterPage({ params }: { params: Promise<{ capitulo: string }> }) {
  const { capitulo } = await params;
  if (!judasChapters.some(chapter => chapter.id === capitulo)) notFound();
  return <ChapterContent chapterId={capitulo} />;
}
