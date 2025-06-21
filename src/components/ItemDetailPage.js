import React, { useEffect, useState } from "react";
import { ArrowLeft, Camera, TrendingUp, Clock, MapPin, Heart, MessageCircle, CheckCircle } from "lucide-react";
import PayPalEmailSettings from "./PayPalEmailSettings";
import StarRating from "./StarRating";
// New ItemDetailPage component
const ItemDetailPage = ({ generateImage, item, onBack, language, categories, citiesData, bangkokStreetsData, generatedImages, setGeneratedImages }) => {

const currentItemImageStatus = generatedImages[item.id];
const displayName = language === 'th' && item.itemName_th ? item.itemName_th : item.itemName;

 const [paypalEmail, setPaypalEmail] = useState(item.paypalEmail || '');
 const [paypalVerified, setPaypalVerified] = useState(item.paypalVerified || false);

// kick off image‐generation when this page mounts (or status changes)
useEffect(() => {
  // 1) never run until we have an `item`
  if (!item) return;

  // 2) only kick off generation if we don’t have a URL
  //    and we haven’t retried 3× yet
  if (
    !currentItemImageStatus ||
    (
      !currentItemImageStatus.url &&
      !currentItemImageStatus.loading &&
      (
        currentItemImageStatus.error ||
        (currentItemImageStatus.retries ?? 0) < 3
      )
    )
  ) {
    const retries = currentItemImageStatus?.retries ?? 0;

    // mark “loading” and bump retry count
    setGeneratedImages(prev => ({
      ...prev,
      [item.id]: {
        loading: true,
        url:     null,
        error:   false,
        retries: retries + 1,
      },
    }));

    // build your prompt…
    const prompt = `A detailed photo of the shop front of "${item.itemName}" which is a ${
      item.subCategory || item.category
    } in ${
      item.location.city !== 'Online'
        ? item.location.city + ', ' + item.location.district
        : 'the online world'
    }. Ensure any visible text is in English. Focus on the exterior.`;

    // fire off the API
    generateImage(prompt)
      .then(url => {
        setGeneratedImages(prev => ({
          ...prev,
          [item.id]: {
            ...prev[item.id],
            loading: false,
            url,
            error:   false,
          }
        }));
      })
      .catch(() => {
        setGeneratedImages(prev => ({
          ...prev,
          [item.id]: {
            ...prev[item.id],
            loading: false,
            url:     null,
            error:   true,
          }
        }));
      });
  }
}, [
  // deps must include `item` so we bail early when !item
  item,
  currentItemImageStatus,
  generateImage,
  // and of course the setter
  setGeneratedImages,
]);

        const getCategoryLabel = (mainCat, cat, subCat) => {
        const mainLabel = categories.find(c => c.value === mainCat)?.[`label_${language}`] || mainCat;
        const platformOrCat = mainCat === 'Online' 
            ? categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat)?.[`label_${language}`] || cat
            : categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat)?.[`label_${language}`] || cat;
        const subCatLabel = (mainCat === 'Online' ? (categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat)?.subcategories.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat) : (categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat)?.subcategories.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat));
        
        let parts = [mainLabel];
        if (platformOrCat && platformOrCat !== cat) parts.push(platformOrCat);
        if (subCatLabel && subCatLabel !== subCat) parts.push(subCatLabel);

        if (parts.length === 1 && cat && cat !== 'all') { 
            const currentCategoryData = (mainCat === 'Online' ? categories.find(c => c.value === mainCat)?.platforms : categories.find(c => c.value === mainCat)?.subcategories)?.find(c => c.value === cat);
            if (currentCategoryData) parts.push(currentCategoryData[`label_${language}`] || cat);
        }
        if (parts.length === 2 && subCat && subCat !== 'all') { 
            let currentSubCategoryData;
            if (mainCat === 'Online') {
                const platform = categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat);
                currentSubCategoryData = platform?.subcategories.find(s => s.value === subCat);
            } else {
                const category = categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat);
                currentSubCategoryData = category?.subcategories.find(sc => sc.value === subCat);
            }
            if (currentSubCategoryData) parts.push(currentSubCategoryData[`label_${language}`] || subCat);
        }
        return parts.filter(Boolean).join(' / ');
    };

    const getLocationLabel = (loc) => {
        if (!loc || !loc.city) return '';
        const cityLabel = citiesData.find(c => c.value === loc.city)?.[`label_${language}`] || loc.city;
        const districtLabel = loc.district ? (citiesData.find(c => c.value === loc.city)?.districts.find(d => d.value === loc.district)?.[`label_${language}`] || loc.district) : '';
        
        let parts = [cityLabel];
        if (districtLabel) parts.push(districtLabel);

        return parts.filter(Boolean).join(', ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <header className="bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/50 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-semibold">{language === 'en' ? 'Back to List' : 'กลับไปที่รายการ'}</span>
                    </button>
                    <h2 className="text-xl font-bold text-gray-100 truncate">{displayName}</h2>
                </div>
            </header>
            <main className="max-w-3xl mx-auto p-4 md:p-6">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50 p-4 md:p-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
                    
                    <div className="relative">
                        {currentItemImageStatus?.loading ? (
                            <div className="mb-6 overflow-hidden rounded-xl aspect-video shadow-lg bg-gray-700 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-lg text-gray-400 ml-4">Generating image...</span>
                            </div>
                        ) : currentItemImageStatus?.url ? (
                            <div className="mb-6 overflow-hidden rounded-xl aspect-video shadow-lg">
                                <img
                                    src={currentItemImageStatus.url}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/333/555?text=Image+Error"; }}
                                />
                            </div>
                        ) : (
                            <div className="mb-6 overflow-hidden rounded-xl aspect-video shadow-lg bg-gray-700 flex items-center justify-center text-gray-400">
                                <Camera size={64} className="text-gray-500"/>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">{displayName}</h2>
                        
                        <div className="mb-6 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                                {getCategoryLabel(item.mainCategory, item.category, item.subCategory)}
                            </span>
                            {item.location && item.location.city && item.location.city !== "Online" &&(
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                                    <MapPin size={14} />
                                    {getLocationLabel(item.location)}
                                </span>
                            )}
                        </div>

                        <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                        {item.rating ? item.rating.toFixed(1) : 'N/A'}
                                    </span>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {language === 'en' ? 'out of 5' : 'จาก 5'}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <StarRating rating={item.rating || 0} size="lg" />
                                    <p className="text-sm text-gray-400 mt-2">
                                        {language === 'en' ? `Based on ${item.reviewCount || 0} reviews` : `อิงจาก ${item.reviewCount || 0} รีวิว`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <TrendingUp size={18} />
                                    <span className="text-sm font-semibold">{language === 'en' ? "Activity" : "กิจกรรม"}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-100">{language === 'en' ? "High" : "สูง"}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    <Clock size={18} />
                                    <span className="text-sm font-semibold">{language === 'en' ? "Last Review" : "รีวิวล่าสุด"}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-100">{language === 'en' ? "Recent" : "เร็วๆ นี้"}</p>
                            </div>
                        </div>

                        <PayPalEmailSettings
                            initialEmail={paypalEmail}
                            initialVerified={paypalVerified}
                            onEmailChange={setPaypalEmail}
                            onVerified={setPaypalVerified}
                        />

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-100 mb-4">{language === 'en' ? "All Reviews" : "รีวิวทั้งหมด"}</h3>
                            {item.reviews && item.reviews.length > 0 ? (
                                item.reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((review) => (
                                    <div key={review.id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                <span className="text-sm font-bold text-white">
                                                    {review.author.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-semibold text-gray-100">{review.author}</span>
                                                    {review.verified && (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="text-blue-400" size={12} />
                                                            <span className="text-xs text-blue-400">Verified</span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-500">{review.date}</span>
                                                </div>
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed pl-12">
                                            {language === 'en' ? review.comment : review.comment_th || review.comment}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 pl-12">
                                            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-400 transition-colors">
                                                <Heart size={14} />
                                                <span>{language === 'en' ? "Helpful" : "มีประโยชน์"} ({review.helpful})</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>{language === 'en' ? "No reviews yet. Be the first!" : "ยังไม่มีรีวิว เป็นคนแรก!"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default ItemDetailPage;
