
import React from 'react';
import { Button } from '@/components/ui/button';

interface SpellingCorrectionSuggestionProps {
  correctedQuery: string;
  originalQuery: string;
  onCorrectedQueryClick: (query: string) => void;
  onUseOriginalSearch: () => void;
}

const SpellingCorrectionSuggestion: React.FC<SpellingCorrectionSuggestionProps> = ({
  correctedQuery,
  originalQuery,
  onCorrectedQueryClick,
  onUseOriginalSearch
}) => {
  if (!correctedQuery) return null;

  return (
    <div className="mb-4 text-sm">
      <p>
        Did you mean: <Button 
          variant="link" 
          className="p-0 h-auto font-normal text-blue-600" 
          onClick={() => onCorrectedQueryClick(correctedQuery)}
        >
          {correctedQuery}
        </Button>? Or {' '}
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal text-blue-600" 
          onClick={onUseOriginalSearch}
        >
          search for "{originalQuery}"
        </Button>
      </p>
    </div>
  );
};

export default SpellingCorrectionSuggestion;
