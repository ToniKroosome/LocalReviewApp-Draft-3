import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import CompactReviewCard from './CompactReviewCard';
import ReviewItem from './ReviewItem';

const ItemList = ({
  filteredReviews,
  isAuthReady,
  handleItemClick,
  language,
  categories,
  citiesData,
  bangkokStreetsData,
  generatedImages,
  setGeneratedImages,
  isLoadingNoMatchingReviewsMessage,
  noMatchingReviewsMessage,
  generateImage,
}) => {
  const [showImages, setShowImages] = useState(false);

  return (
    <main className="main-content px-1 py-4 sm:max-w-7xl sm:mx-auto sm:px-4 sm:py-8">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setShowImages((v) => !v)}
          className="px-3 py-1 text-xs bg-gray-800 text-gray-100 rounded hover:bg-gray-700"
        >
          {showImages ? 'Compact View' : 'Image View'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {!isAuthReady ? (
          <div className="text-center py-20 col-span-full">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full mb-4">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-400">{language === 'en' ? 'Loading Reviews...' : 'กำลังโหลดรีวิว...'}</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((item) =>
            showImages ? (
              <div key={item.id} className="item-list-card">
                <ReviewItem
                  generateImage={generateImage}
                  item={item}
                  onClick={handleItemClick}
                  language={language}
                  categories={categories}
                  citiesData={citiesData}
                  bangkokStreetsData={bangkokStreetsData}
                  generatedImages={generatedImages}
                  setGeneratedImages={setGeneratedImages}
                />
              </div>
            ) : (
              <div key={item.id} className="item-list-card">
                <CompactReviewCard
                  item={item}
                  onDetails={handleItemClick}
                  language={language}
                />
              </div>
            )
          )
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 col-span-full">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">
              {isLoadingNoMatchingReviewsMessage
                ? language === 'en'
                  ? 'Searching...'
                  : 'กำลังค้นหา...'
                : noMatchingReviewsMessage}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ItemList;