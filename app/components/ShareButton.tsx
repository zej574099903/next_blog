'use client';

import { FC } from 'react';

interface ShareButtonProps {
  title: string;
  description: string;
}

export const ShareButton: FC<ShareButtonProps> = ({ title, description }) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <button 
      className="btn-primary flex items-center"
      onClick={handleShare}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      分享
    </button>
  );
};
