import React, { useState, useEffect } from 'react';
import { Search, Star, Camera, CheckCircle, User, TrendingUp, Calendar, Filter, Plus, X, ChevronDown, LogOut, Sparkles, MapPin, Globe, Heart, MessageCircle, Award, Clock, ArrowLeft, Monitor } from 'lucide-react';
import { initialSampleReviews } from './data/sampleReviews';
import Header from './components/Header';
import ItemList from './components/ItemList';
import ItemDetailPage from './components/ItemDetailPage';
import FilterBar from './components/FilterBar';
import './styles/FilterBar.css';

import GoogleIcon from "./components/GoogleIcon";
import ReviewFormModal from "./components/ReviewFormModal";
import PaymentPage from "./components/PaymentPage";
import { initScrollbarStyles } from "./utils/scrollbarStyles";
import generateImage from "./utils/imageGeneration";
import { signIn, signOut } from "./utils/auth";
import { auth, onAuthStateChanged } from "./utils/mockFirebase";
import { categories } from "./data/categories";
import { citiesData } from "./data/citiesData";
import { bangkokStreetsData } from "./data/bangkokStreetsData";

initScrollbarStyles();


// Main App Component with enhanced design
const App = () => {
    const [page, setPage] = useState('home'); // 'home', 'detail', 'payment'
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    const [selectedMainCategory, setSelectedMainCategory] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');
    const [selectedFilters, setSelectedFilters] = useState({
        category: 'All Categories',
        shopType: '',
        onlineType: '',
        city: '',
        district: '',
        zone: '',
        subDistrict: '',
        street: '',
        alley: ''
    });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null); // Changed from userId to user object
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [noMatchingReviewsMessage, setNoMatchingReviewsMessage] = useState('');
    const [isLoadingNoMatchingReviewsMessage, setIsLoadingNoMatchingReviewsMessage] = useState(false);
    const [generatedImages, setGeneratedImages] = useState({}); // State for dynamically generated images
    const [creditsBalance, setCreditsBalance] = useState(0);
    // Visibility states for search and filter UI controlled by Header buttons
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [mobilePreview, setMobilePreview] = useState(false);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);
    const toggleSearchBar = () => setShowSearchBar(v => !v);
    const toggleFilters = () => setShowFilters(v => !v);
    const toggleMobilePreview = () => setMobilePreview(v => !v);

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 40) setShowHeader(true);
            else if (window.scrollY > lastScrollY) setShowHeader(false);
            else setShowHeader(true);
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const [newReview, setNewReview] = useState({
        itemName: '',
        mainCategory: '',   
        category: '',   
        subCategory: '',    
        location: { city: '', district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: '' },
        rating: 5,
        comment: '',
        author: ''
    });
    // Multi-criteria filtering block
    const filteredReviews = reviews.filter((item) => {
        const qTrim = searchQuery.trim();
        const qLower = qTrim.toLowerCase();

        const matchesSearch =
            item.itemName.toLowerCase().includes(qLower) ||
            (language === 'th' && item.itemName_th && item.itemName_th.includes(qTrim)) ||
            item.category.toLowerCase().includes(qLower) ||
            (language === 'th' && item.category_th && item.category_th.includes(qTrim)) ||
            item.subCategory.toLowerCase().includes(qLower) ||
            (language === 'th' && item.subCategory_th && item.subCategory_th.includes(qTrim)) ||
            (item.location && item.location.city && (
                item.location.city.toLowerCase().includes(qLower) ||
                (language === 'th' && item.location.city_th && item.location.city_th.includes(qTrim))
            )) ||
            (item.location && item.location.district && (
                item.location.district.toLowerCase().includes(qLower) ||
                (language === 'th' && item.location.district_th && item.location.district_th.includes(qTrim))
            ));
        const matchesMainCategory = selectedMainCategory === 'all' || item.mainCategory === selectedMainCategory;
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSubCategory = selectedSubCategory === 'all' || item.subCategory === selectedSubCategory;
        const matchesCategoryBar = !selectedFilters.category || selectedFilters.category.startsWith('All') ||
            item.mainCategory === selectedFilters.category || item.category === selectedFilters.category;
        const matchesCity = !selectedFilters.city || selectedFilters.city.startsWith('All') || (item.location && item.location.city === selectedFilters.city);
        const matchesDistrict = !selectedFilters.district || selectedFilters.district.startsWith('All') || (item.location && item.location.district === selectedFilters.district);
        const matchesZone = !selectedFilters.zone || selectedFilters.zone.startsWith('All') || (item.location && item.location.zone === selectedFilters.zone);
        const matchesSubDistrict = !selectedFilters.subDistrict || selectedFilters.subDistrict.startsWith('All') || (item.location && item.location.subDistrict === selectedFilters.subDistrict);
        const matchesStreet = !selectedFilters.street || selectedFilters.street.startsWith('All') || (item.location && item.location.street === selectedFilters.street);
        const matchesAlley = !selectedFilters.alley || selectedFilters.alley.startsWith('All') || (item.location && item.location.alley === selectedFilters.alley);
        const matchesShopType = !selectedFilters.shopType || selectedFilters.shopType.startsWith('All') || item.subCategory === selectedFilters.shopType;

        let matchesOnlineType = true;
        if (selectedFilters.onlineType && item.mainCategory === 'Online') {
            const onlineMap = {
                'Social Media App': ['Facebook', 'Instagram', 'TikTok', 'Telegram', 'Line', 'YouTube', 'Shopee'],
                'Website': ['Website'],
                'Individual Remote Services': ['Online Service (General)'],
            };
            const allowed = onlineMap[selectedFilters.onlineType] || [];
            matchesOnlineType = allowed.includes(item.category);
        }

        return matchesSearch && matchesMainCategory && matchesCategory && matchesSubCategory &&
            matchesCategoryBar && matchesCity && matchesDistrict && matchesZone && matchesSubDistrict && matchesStreet && matchesAlley && matchesShopType && matchesOnlineType;
    });
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAuthReady) {
            setReviews(initialSampleReviews);
        }
    }, [isAuthReady]);

    // Update newReview author when user logs in
    useEffect(() => {
        if (user) {
            setNewReview(prev => ({ ...prev, author: user.displayName || '' }));
        }
    }, [user]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setPage('detail');
    };

    const handleBack = () => {
        setSelectedItem(null);
        setPage('home');
    };

    const handleBuyCredits = () => {
        setPage('payment');
    };

    const handlePaymentComplete = (amount) => {
        setCreditsBalance(b => b + amount);
        setPage('home');
    };
      
    const handleLogin = async () => {
        try {
            const { user: loggedInUser } = await signIn();
            setUser(loggedInUser);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setPage('home'); // Go to home page on logout
    };
    
    const handleSubmitReview = (newReviewData) => {
        if (!user) {
            console.log(language === 'en' ? 'You must be logged in to submit a review.' : 'คุณต้องเข้าสู่ระบบเพื่อส่งรีวิว');
            alert(language === 'en' ? 'Please sign in to write a review.' : 'กรุณาเข้าสู่ระบบเพื่อเขียนรีวิว');
            return;
        }
        if (!newReviewData.itemName.trim() || !newReviewData.mainCategory || !newReviewData.category || !newReviewData.comment.trim() || !newReviewData.author.trim()) {
            console.log(language === 'en' ? 'Please fill in all required fields (Item Name, Main Category, Category, Your Review, Your Name).' : 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมด (ชื่อรายการ, หมวดหมู่หลัก, หมวดหมู่, รีวิวของคุณ, ชื่อของคุณ)');
            return;
        }

        const reviewToAdd = {
            id: Date.now(),
            author: newReviewData.author.trim(),
            rating: newReviewData.rating,
            date: new Date().toISOString().split('T')[0],
            comment: newReviewData.comment.trim(),
            comment_th: newReviewData.comment_th ? newReviewData.comment_th.trim() : '',
            verified: true, // Mark as verified since user is logged in
            helpful: 0,
            authorId: user.uid, // Add author's ID
            authorPhotoURL: user.photoURL // Add author's photo
        };

        const existingItemIndex = reviews.findIndex(item => 
            item.itemName.toLowerCase() === newReviewData.itemName.toLowerCase().trim() &&
            item.mainCategory === newReviewData.mainCategory &&
            item.category === newReviewData.category &&
            item.subCategory === newReviewData.subCategory
        );

        let updatedReviews = [...reviews];
        let updatedItem;

        if (existingItemIndex > -1) {
            const itemToUpdate = { ...updatedReviews[existingItemIndex] };
            const newReviewCount = itemToUpdate.reviewCount + 1;
            const oldTotalRating = itemToUpdate.rating * itemToUpdate.reviewCount;
            itemToUpdate.rating = (oldTotalRating + newReviewData.rating) / newReviewCount;
            itemToUpdate.reviewCount = newReviewCount;
            itemToUpdate.reviews = [reviewToAdd, ...itemToUpdate.reviews];
            updatedReviews[existingItemIndex] = itemToUpdate;
            updatedItem = itemToUpdate;
            console.log(language === 'en' ? 'Review added to existing item!' : 'เพิ่มรีวิวในรายการที่มีอยู่แล้ว!');
        } else {
            const newItem = {
                id: `new-item-${Date.now()}`,
                itemName: newReviewData.itemName.trim(),
                mainCategory: newReviewData.mainCategory,
                category: newReviewData.category,
                subCategory: newReviewData.subCategory,
                location: newReviewData.location,
                rating: newReviewData.rating,
                reviewCount: 1,
                reviews: [reviewToAdd]
            };
            updatedReviews = [newItem, ...updatedReviews];
            updatedItem = newItem;
            console.log(language === 'en' ? 'New item and review submitted!' : 'ส่งรายการใหม่และรีวิวแล้ว!');
        }
        
        setReviews(updatedReviews);
        setShowReviewForm(false);
        setNewReview({
            itemName: '', mainCategory: '', category: '', subCategory: '', 
            location: { city: '', district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: '' },
            rating: 5, comment: '', author: user.displayName || ''
        });
        
        if (page === 'detail') {
            setSelectedItem(updatedItem);
        }
    };

    useEffect(() => {
        if (filteredReviews.length === 0 && isAuthReady && page === 'home') {
            setIsLoadingNoMatchingReviewsMessage(true);
            setTimeout(() => {
                const message = language === 'en' 
                    ? `No reviews match your filters. Be the first to add one!`
                    : `ไม่พบรีวิวที่ตรงกับเกณฑ์ของคุณ เป็นคนแรกที่เพิ่มรีวิว!`;
                setNoMatchingReviewsMessage(message);
                setIsLoadingNoMatchingReviewsMessage(false);
            }, 300);
        }
    }, [filteredReviews.length, isAuthReady, language, page]);

    if (page === 'payment') {
        return <PaymentPage onBack={handleBack} onComplete={handlePaymentComplete} />;
    }

    if (page === 'detail') {
        return (
            <ItemDetailPage
                item={selectedItem}
                onBack={handleBack}
                language={language}
                categories={categories}
                citiesData={citiesData}
                bangkokStreetsData={bangkokStreetsData}
                generatedImages={generatedImages}
                setGeneratedImages={setGeneratedImages}
            />
        );
    }
    
  return (
  <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-sans antialiased pt-14 px-2 sm:px-6 transition-all duration-200 ${mobilePreview ? 'mobile-preview' : ''}`}>
    {/* Enhanced Header */}
    <Header
      showHeader={showHeader}
      toggleSearchBar={toggleSearchBar}
      toggleFilters={toggleFilters}
      user={user}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      setShowReviewForm={setShowReviewForm}
      onBuyCredits={handleBuyCredits}
      creditsBalance={creditsBalance}
      language={language}
      setLanguage={setLanguage}
      mobilePreview={mobilePreview}
      toggleMobilePreview={toggleMobilePreview}
      GoogleIcon={GoogleIcon}
    />

    {mobilePreview && (
      <button
        onClick={toggleMobilePreview}
        className="absolute top-2 right-2 z-30 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        title="Desktop view"
        aria-label="Exit mobile preview and return to desktop view"
      >
        <Monitor size={20} />
      </button>
    )}

      {showSearchBar && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search...' : 'ค้นหา...'}
              className="w-full pl-8 pr-3 py-2 rounded-md bg-gray-800 placeholder-gray-500 text-sm focus:outline-none"
            />
          </div>
        </div>
      )}

      {showFilters && (
        <FilterBar onFilterChange={handleFilterChange} language={language} />
      )}

    {/* Main Content */}
    <ItemList
      filteredReviews={filteredReviews}
      isAuthReady={isAuthReady}
      handleItemClick={handleItemClick}
      language={language}
      categories={categories}
      citiesData={citiesData}
      bangkokStreetsData={bangkokStreetsData}
      generatedImages={generatedImages}
      setGeneratedImages={setGeneratedImages}
      isLoadingNoMatchingReviewsMessage={isLoadingNoMatchingReviewsMessage}
      noMatchingReviewsMessage={noMatchingReviewsMessage}
      generateImage={generateImage}
    />

    {/* Modal */}
    {showReviewForm && (
      <ReviewFormModal
        show={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        newReview={newReview}
        setNewReview={setNewReview}
        onSubmit={handleSubmitReview}
        categories={categories}
        citiesData={citiesData}
        bangkokStreetsData={bangkokStreetsData}
        language={language}
      />
    )}
  </div>
);

};

export default App;
