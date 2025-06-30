import { useState } from 'react';

export default function TextWithReadMore({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayText = isExpanded ? text : text.split(' ').slice(0, 20).join(' ');

  return (
    <p className="mt-2 sm:pr-5 font-medium text-[#3F3F46]">
      {displayText}
      {text.split(' ').slice(0, 20).length >= 20 && !isExpanded && (
        <span className="text-blue-500 cursor-pointer ml-1" onClick={() => setIsExpanded(true)}>
          Read More
        </span>
      )}
      {isExpanded && (
        <span className="text-blue-500 cursor-pointer ml-1" onClick={() => setIsExpanded(false)}>
          Read Less
        </span>
      )}
    </p>
  );
}
