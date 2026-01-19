import React from 'react';
import { GroundingMetadata } from '../types';
import { ExternalLink } from 'lucide-react';

interface SourcesProps {
  metadata: GroundingMetadata | null;
}

const Sources: React.FC<SourcesProps> = ({ metadata }) => {
  if (!metadata || !metadata.groundingChunks || metadata.groundingChunks.length === 0) {
    return null;
  }

  // Deduplicate sources based on URI
  const uniqueSourcesMap = new Map<string, { uri: string; title: string }>();
  
  metadata.groundingChunks.forEach((chunk) => {
    if (chunk.web?.uri) {
      uniqueSourcesMap.set(chunk.web.uri, chunk.web);
    }
  });

  const uniqueSources = Array.from(uniqueSourcesMap.values());

  if (uniqueSources.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Sources & Verification
      </h4>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((source, idx) => (
          <a
            key={idx}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors truncate max-w-[200px]"
            title={source.title}
          >
            <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sources;