import { MessageCircle, Globe, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { Camera, CheckCircle, MapPin } from "lucide-react";
import StarRating from "./StarRating";

const ReviewItem = ({
    generateImage,
    item,
    onClick,
    language,
    categories,
    citiesData,
    bangkokStreetsData,
    generatedImages,
    setGeneratedImages
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const displayName = language === 'th' && item.itemName_th ? item.itemName_th : item.itemName;

    // Get the specific image status for *this* item from the overall state
    const currentItemImageStatus = generatedImages[item.id];

    useEffect(() => {
        if (
            !currentItemImageStatus ||
            (
                !currentItemImageStatus.url &&
                !currentItemImageStatus.loading &&
                (currentItemImageStatus.error ||
                    (currentItemImageStatus.retries !== undefined && currentItemImageStatus.retries < 3)
                )
            )
        ) {
            const currentRetries = currentItemImageStatus?.retries || 0;
            if (currentItemImageStatus?.loading) return;

            setGeneratedImages(prev => ({
                ...prev,
                [item.id]: { loading: true, url: null, error: false, retries: currentRetries + 1 }
            }));

            const prompt = `A shop front image of "${item.itemName}" which is a ${item.subCategory || item.category} in ${item.location.city !== 'Online' ? item.location.city : 'digital space'}. Ensure any text visible in the image is in English. Style: realistic, high detail.`;
            generateImage(prompt).then(url => {
                setGeneratedImages(prev => ({ ...prev, [item.id]: { ...prev[item.id], loading: false, url: url, error: false } }));
            }).catch(error => {
                console.error("Failed to generate image for item:", item.itemName, error);
                setGeneratedImages(prev => ({ ...prev, [item.id]: { ...prev[item.id], loading: false, url: null, error: true } }));
            });
        }
    }, [
        item.id,
        item.itemName,
        item.category,
        item.subCategory,
        item.location.city,
        currentItemImageStatus,
        generateImage,
        setGeneratedImages
    ]);

    const getCategoryLabel = (mainCat, cat, subCat) => {
        const mainLabel = categories.find(c => c.value === mainCat)?.[`label_${language}`] || mainCat;
        const platformOrCat = mainCat === 'Online'
            ? categories.find(c => c.value === mainCat)?.platforms?.find(p => p.value === cat)?.[`label_${language}`] || cat
            : categories.find(c => c.value === mainCat)?.subcategories?.find(s => s.value === cat)?.[`label_${language}`] || cat;
        const subCatLabel = mainCat === 'Online'
            ? categories.find(c => c.value === mainCat)?.platforms?.find(p => p.value === cat)?.subcategories?.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat
            : categories.find(c => c.value === mainCat)?.subcategories?.find(s => s.value === cat)?.subcategories.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat;

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

    const imageUrlToDisplay = currentItemImageStatus?.url || item.fallbackImageUrl;

    return (
        <div
            className={`item-list-card relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700/50 p-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-gray-600/50 max-w-[18rem] w-full mx-auto ${isHovered ? 'ring-2 ring-purple-500/20' : ''}`}
            onClick={() => onClick(item)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl" />
            {currentItemImageStatus?.loading ? (
                <div className="mb-1 overflow-hidden rounded-xl aspect-[3/1] bg-gray-700 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-400 ml-3">Generating image...</span>
                </div>
            ) : imageUrlToDisplay ? (
                <div className="mb-1 overflow-hidden rounded-xl aspect-[3/1]">
                    <img
                        src={imageUrlToDisplay}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/333/555?text=Image+Error"; }}
                    />
                </div>
            ) : (
                <div className="mb-1 overflow-hidden rounded-xl aspect-[3/1] bg-gray-700 flex items-center justify-center text-gray-400">
                    <Camera size={48} className="text-gray-500" />
                </div>
            )}

            <div className="relative flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-100 mb-1 tracking-tight">{displayName}</h3>
                    <div className="flex items-center gap-1 mb-1">
                        <div className="flex items-center gap-0.5">
                            <StarRating rating={item.rating} size="sm" />
                            <span className="text-xs font-semibold text-gray-100">
                                {item.rating ? item.rating.toFixed(1) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MessageCircle size={12} />
                            <span>{item.reviewCount || 0} reviews</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                            {getCategoryLabel(item.mainCategory, item.category, item.subCategory)}
                        </span>
                        {item.location && item.location.city && item.location.city !== "Online" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                                <MapPin size={12} />
                                {getLocationLabel(item.location)}
                            </span>
                        )}
                        {item.location && item.location.city === "Online" && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-500/20 backdrop-blur-sm">
                                <Globe size={12} />
                                {language === 'en' ? 'Digital' : 'ดิจิทัล'}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`transition-all duration-300 ${isHovered ? 'rotate-90' : ''}`}>
                    <ChevronDown className="text-gray-500" size={20} />
                </div>
            </div>

            {item.reviews && item.reviews.length > 0 && (
                <div className="mt-1 p-1 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-[9px] font-bold text-white">
                                {item.reviews[0].author.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-gray-100">{item.reviews[0].author}</span>
                                {item.reviews[0].verified && (
                                    <div className="flex items-center gap-0.5">
                                        <CheckCircle className="text-blue-400" size={12} />
                                        <span className="text-[10px] text-blue-400">Verified</span>
                                    </div>
                                )}
                            </div>
                            <StarRating rating={item.reviews[0].rating} size="sm" />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-300 line-clamp-1 italic">
                        "{language === 'en' ? item.reviews[0].comment : item.reviews[0].comment_th || item.reviews[0].comment}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewItem;