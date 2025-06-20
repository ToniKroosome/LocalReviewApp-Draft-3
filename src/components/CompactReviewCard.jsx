import React from 'react';
import { MessageCircle, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import StarRating from './StarRating';
import '../styles/CompactReviewCard.css';

const CompactReviewCard = ({ item, onDetails, language = 'en' }) => {
  const review = item.reviews && item.reviews.length > 0 ? item.reviews[0] : null;
  const avatarLetter = review ? review.author.charAt(0).toUpperCase() : '';

  return (
    <div className="compact-review-card item-list-card">
      <div className="crc-header">
        <h3 className="crc-title">{language === 'th' && item.itemName_th ? item.itemName_th : item.itemName}</h3>
      </div>
      <div className="crc-rating">
        <StarRating rating={item.rating} size="sm" />
        <span className="crc-rating-val">{item.rating ? item.rating.toFixed(1) : 'N/A'}</span>
        <MessageCircle size={12} className="crc-icon" />
        <span className="crc-review-count">{item.reviewCount || 0}</span>
      </div>
      <div className="crc-tags">
        {item.category && (
          <span className="crc-badge">
            <MapPin size={10} className="crc-badge-icon" />
            {item.category}
          </span>
        )}
        {item.location && item.location.city && (
          <span className="crc-badge">{item.location.city}</span>
        )}
      </div>
      {review && (
        <div className="crc-quote">
          <div className="crc-avatar">{avatarLetter}</div>
          <div className="crc-quote-text">
            <div className="crc-author-line">
              <span className="crc-author">{review.author}</span>
              {review.verified && <CheckCircle size={12} className="crc-verified" />}
            </div>
            <p className="crc-comment">"{language === 'en' ? review.comment : review.comment_th || review.comment}"</p>
          </div>
        </div>
      )}
      <button type="button" className="crc-details" onClick={() => onDetails && onDetails(item)}>
        View details <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default CompactReviewCard;