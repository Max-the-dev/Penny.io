import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { apiService } from '../services/api';

interface LikeButtonProps {
  articleId: number;
  userAddress: string | undefined;
  initialLikes: number;
  className?: string;
  onLikeChange?: (articleId: number, newLikeCount: number) => void;
}

function LikeButton({ articleId, userAddress, initialLikes, className = '', onLikeChange }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update likes when initialLikes prop changes
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  // Check if user has already liked this article
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!userAddress) return;
      
      try {
        const response = await apiService.checkUserLikedArticle(articleId, userAddress);
        if (response.success && response.data) {
          setIsLiked(response.data.liked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [articleId, userAddress]);

  const handleLikeToggle = async () => {
    if (!userAddress || isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike the article
        const response = await apiService.unlikeArticle(articleId, userAddress);
        if (response.success) {
          setIsLiked(false);
          const newCount = likes - 1;
          setLikes(newCount);
          onLikeChange?.(articleId, newCount);
        }
      } else {
        // Like the article
        const response = await apiService.likeArticle(articleId, userAddress);
        if (response.success && response.data) {
          if (response.data.liked) {
            setIsLiked(true);
            const newCount = likes + 1;
            setLikes(newCount);
            onLikeChange?.(articleId, newCount);
          }
          // If response.data.liked is false, it means already liked (no change needed)
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userAddress) {
    return (
      <div className={`like-button like-button-disabled ${className}`}>
        <Heart size={16} />
        <span>{likes}</span>
      </div>
    );
  }

  return (
    <button
      className={`like-button ${isLiked ? 'like-button-liked' : ''} ${isLoading ? 'like-button-loading' : ''} ${className}`}
      onClick={handleLikeToggle}
      disabled={isLoading}
      title={isLiked ? 'Unlike this article' : 'Like this article'}
    >
      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
      <span>{likes}</span>
    </button>
  );
}

export default LikeButton;