import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Search, ShoppingBag, User, X, Menu, Settings, LogOut, Store, Truck, MapPin, ShieldCheck, Clock, XCircle, Wrench, Scale } from 'lucide-react';
import MegaMenu from './MegaMenu';
import CartDrawer from './CartDrawer';

// Live Order Tracking Map Component (shared with account portal)
function TrackingMap({ hereApiKey, city }) {
    const mapRef = useRef(null);
    const [mapError, setMapError] = useState(false);

    const getCoordinates = (cityName) => {
        const name = (cityName || '').toLowerCase();
        if (name.includes('cape town') || name.includes('bellville') || name.includes('somerset')) {
            return { lat: -33.9249, lng: 18.4241 };
        }
        if (name.includes('durban') || name.includes('umhlanga') || name.includes('pinetown')) {
            return { lat: -29.8587, lng: 31.0218 };
        }
        if (name.includes('pretoria') || name.includes('centurion')) {
            return { lat: -25.7479, lng: 28.2293 };
        }
        if (name.includes('port elizabeth') || name.includes('gqeberha')) {
            return { lat: -33.9608, lng: 25.6022 };
        }
        return { lat: -26.2041, lng: 28.0473 };
    };

    useEffect(() => {
        if (!hereApiKey || !window.H) {
            setMapError(true);
            return;
        }

        try {
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }

            const dispatchCoords = { lat: -26.1098, lng: 28.0526 };
            const destCoords = getCoordinates(city);

            const platform = new window.H.service.Platform({
                apikey: hereApiKey
            });

            const defaultLayers = platform.createDefaultLayers();

            const map = new window.H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 6,
                    center: dispatchCoords,
                    pixelRatio: window.devicePixelRatio || 1
                }
            );

            new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
            window.H.ui.UI.createDefault(map, defaultLayers);

            const dispatchMarker = new window.H.map.Marker(dispatchCoords);
            const destinationMarker = new window.H.map.Marker(destCoords);
            map.addObjects([dispatchMarker, destinationMarker]);

            const lineString = new window.H.geo.LineString();
            lineString.pushPoint(dispatchCoords);
            lineString.pushPoint(destCoords);

            const routeLine = new window.H.map.Polyline(lineString, {
                style: { strokeColor: '#0066CC', lineWidth: 4 }
            });
            map.addObject(routeLine);

            map.getLookAtDataProvider().zoomTo(routeLine.getBoundingBox());

        } catch (e) {
            console.error('HERE Maps failed initialization:', e);
            setMapError(true);
        }
    }, [hereApiKey, city]);

    if (mapError || !hereApiKey || !window.H) {
        return (
            <div className="bg-gray-50 dark:bg-gray-850 rounded-2xl p-4 text-center space-y-3 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Dispatch: Johannesburg</span>
                    <span className="text-[#0066CC]">In Transit</span>
                    <span>Destination: {city || 'Your Address'}</span>
                </div>
                <div className="relative h-10 w-full bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-xl flex items-center px-4 overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <div className="flex-grow border-t border-dashed border-[#0066CC]/30 mx-2 relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-[45%] text-[#0066CC] animate-bounce">
                            <Truck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#0066CC]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Dispatch: Johannesburg</span>
                <span className="text-[#0066CC] animate-pulse">Live Shipment Tracking</span>
                <span>Destination: {city || 'Your Address'}</span>
            </div>
            <div ref={mapRef} className="h-44 w-full rounded-xl overflow-hidden border border-gray-150 dark:border-gray-800 bg-[#F5F5F7]" />
        </div>
    );
}

export default function Navigation() {
    const { categories, cart, auth, hereApiKey, compareCount = 0 } = usePage().props;
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Pickup & Live Tracking states
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState(() => localStorage.getItem('istore_pickup_branch') || '');
    
    // Header Track Order Modal States
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [trackOrderId, setTrackOrderId] = useState('');
    const [trackOrderResult, setTrackOrderResult] = useState(null);
    const [trackingError, setTrackingError] = useState(null);
    const [isFetchingTrack, setIsFetchingTrack] = useState(false);

    // Live Search states (Inline search bar dropdown)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const searchRef = useRef(null);
    const profileRef = useRef(null);
    const { post } = useForm();

    const cartCount = Object.values(cart || {}).reduce((acc, item) => acc + item.quantity, 0);

    const storeLocations = [
        { id: 1, name: 'Sandton City', city: 'Johannesburg' },
        { id: 2, name: 'V&A Waterfront', city: 'Cape Town' },
        { id: 3, name: 'Gateway', city: 'Durban' },
        { id: 4, name: 'Canal Walk', city: 'Cape Town' },
        { id: 5, name: 'Menlyn Park', city: 'Pretoria' }
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setIsDropdownOpen(false);
            return;
        }

        setIsSearching(true);
        setIsDropdownOpen(true);
        const delayDebounceFn = setTimeout(() => {
            fetch(`/search?q=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data);
                    setIsSearching(false);
                })
                .catch(() => setIsSearching(false));
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    const handleSelectStore = (storeName) => {
        setSelectedStore(storeName);
        localStorage.setItem('istore_pickup_branch', storeName);
        setIsStoreModalOpen(false);
    };

    const handleTrackOrder = (e) => {
        e.preventDefault();
        if (!trackOrderId.trim()) return;

        setIsFetchingTrack(true);
        setTrackingError(null);
        setTrackOrderResult(null);

        fetch(`/api/orders/track/${encodeURIComponent(trackOrderId.trim())}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || 'Order not found.');
                }
                setTrackOrderResult(data);
                setIsFetchingTrack(false);
            })
            .catch((err) => {
                setTrackingError(err.message || 'Order reference not found.');
                setIsFetchingTrack(false);
            });
    };

    const getStatusDetails = (status) => {
        switch (status) {
            case 'paid':
                return { color: 'bg-green-50 text-green-700 border-green-200', text: 'Paid & Processing', icon: ShieldCheck, step: 2 };
            case 'shipped':
                return { color: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Shipped (In Transit)', icon: Truck, step: 3 };
            case 'cancelled':
                return { color: 'bg-red-50 text-red-750 border-red-200', text: 'Cancelled', icon: XCircle, step: 0 };
            default:
                return { color: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Pending Payment', icon: Clock, step: 1 };
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 glass-panel font-sans shadow-sm">

                {/* 0. Slim Utility Bar (§2.1) */}
                <div className="bg-[#1D1D1F] text-gray-300 text-[10px] sm:text-[11px]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-8 flex items-center justify-end space-x-4 sm:space-x-6">
                        <button onClick={() => setIsStoreModalOpen(true)} className="hidden sm:flex items-center space-x-1 hover:text-white transition-colors">
                            <MapPin className="w-3 h-3" />
                            <span>Store Locator</span>
                        </button>
                        <Link href="/apple-product-repair" className="flex items-center space-x-1 hover:text-white transition-colors">
                            <Wrench className="w-3 h-3" />
                            <span>Book a Repair</span>
                        </Link>
                        <Link href="/compare" className="flex items-center space-x-1 hover:text-white transition-colors">
                            <Scale className="w-3 h-3" />
                            <span>Compare{compareCount > 0 ? ` (${compareCount})` : ''}</span>
                        </Link>
                    </div>
                </div>

                {/* 1. Blue Announcement Bar */}
                <div className="bg-[#0066CC] text-white text-[10px] sm:text-xs py-2.5 px-4 text-center font-bold tracking-wide transition-colors">
                    Free delivery & Click and Collect on all orders.
                </div>

                {/* 2. Main Navigation Row */}
                <div className="max-w-7xl mx-auto h-[60px] px-4 sm:px-6 md:px-8 flex items-center justify-between">
                    
                    {/* Left: Branding Logo + Partner Badge */}
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <Link href="/" className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight flex items-center">
                            iPoint
                        </Link>
                        <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-700 rounded-lg px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-gray-500 bg-gray-50 dark:bg-gray-850">
                            <span className="text-gray-900 dark:text-white font-semibold flex items-center leading-none">
                                <span className="mr-0.5 text-[10px] sm:text-[11px] leading-none select-none"></span>
                                <span>Premium Partner</span>
                            </span>
                        </div>
                    </div>

                    {/* Middle: Inline Search Bar */}
                    <div className="hidden lg:flex items-center space-x-6 flex-1 max-w-xl mx-8 relative z-50" ref={searchRef}>
                        <div className="w-full relative flex items-center bg-[#F5F5F7] dark:bg-gray-800 rounded-full px-4 py-2 border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-all">
                            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setIsDropdownOpen(true)}
                                placeholder="Search"
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#1D1D1F] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 p-0"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                                    className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-450 dark:text-gray-400"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown Overlay */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-2xl shadow-xl z-55 max-h-80 overflow-y-auto p-4 space-y-3">
                                {isSearching ? (
                                    <p className="text-[10px] text-gray-400 animate-pulse font-semibold">Searching catalog...</p>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((prod) => (
                                        <Link 
                                            key={prod.id}
                                            href={`/products/${prod.slug}`}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                                        >
                                            <img src={prod.image_path} alt={prod.name} className="w-8 h-8 object-contain bg-white p-0.5 border border-gray-100 rounded-lg flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{prod.name}</p>
                                                <p className="text-[9px] text-[#0066CC] font-semibold">R {parseFloat(prod.base_price).toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-gray-400 py-2">No matching products found.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Selectors, Profile & Shopping Cart */}
                    <div className="flex items-center space-x-5 flex-shrink-0 text-xs text-[#1D1D1F] dark:text-gray-200">
                        
                        {/* Pickup Branch Selector */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <Store className="w-4 h-4 text-gray-450 dark:text-gray-400 stroke-[1.5]" />
                            <div className="flex flex-col text-left text-[11px] leading-tight">
                                <span className="text-gray-400 font-normal">Pickup</span>
                                <button 
                                    onClick={() => setIsStoreModalOpen(true)}
                                    className="text-[#0066CC] hover:underline font-bold text-[11px] mt-0.5 text-left flex items-center"
                                >
                                    {selectedStore || 'Select a Store'}
                                    <span className="ml-1 text-[9px] font-normal leading-none font-sans select-none">{`>`}</span>
                                </button>
                            </div>
                        </div>

                        {/* Track Order Selector */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-gray-450 dark:text-gray-400 stroke-[1.5]" />
                            <div className="flex flex-col text-left text-[11px] leading-tight">
                                <span className="text-gray-400 font-normal">Track Order</span>
                                <button 
                                    onClick={() => {
                                        setTrackOrderId('');
                                        setTrackOrderResult(null);
                                        setTrackingError(null);
                                        setIsTrackingModalOpen(true);
                                    }}
                                    className="text-[#0066CC] hover:underline font-bold text-[11px] mt-0.5 text-left flex items-center"
                                >
                                    <span>Track now</span>
                                    <span className="ml-1 text-[9px] font-normal leading-none font-sans select-none">{`>`}</span>
                                </button>
                            </div>
                        </div>

                        {/* Profile Account Portal menu */}
                        <div className="relative" ref={profileRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-200 focus:outline-none transition-colors"
                            >
                                <User className="w-5 h-5 stroke-[1.5]" />
                            </button>

                            {/* Dropdown Menu options */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-2xl shadow-xl z-55 py-2">
                                    {auth.user ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-850">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Signed in as</p>
                                                <p className="text-xs font-bold text-gray-800 dark:text-white truncate mt-0.5">{auth.user.name}</p>
                                            </div>
                                            
                                            {auth.user.is_admin && (
                                                <Link 
                                                    href={route('admin.dashboard')}
                                                    className="px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-855 flex items-center space-x-2.5 text-gray-700 dark:text-gray-200 font-semibold"
                                                >
                                                    <Settings className="w-4 h-4 text-gray-400" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}

                                            <Link 
                                                href={route('profile.edit')}
                                                className="px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-855 flex items-center space-x-2.5 text-gray-700 dark:text-gray-200 font-semibold"
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span>My Account / Portal</span>
                                            </Link>

                                            <button 
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-855 flex items-center space-x-2.5 text-[#E30000] border-t border-gray-100 dark:border-gray-855 mt-1 font-bold"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Log Out</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                href={route('login')}
                                                className="px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-855 block text-gray-800 dark:text-gray-200 font-bold"
                                            >
                                                Sign In
                                            </Link>
                                            <Link 
                                                href={route('register')}
                                                className="px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-855 block text-gray-800 dark:text-gray-200 font-bold"
                                            >
                                                Create Account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Trigger */}
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-855 text-gray-700 dark:text-gray-200 relative focus:outline-none transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[#0066CC] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90 border border-white dark:border-[#1D1D1F]">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-200 focus:outline-none"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 3. Category Menus strip */}
                <div className="hidden lg:block border-t border-[#E5E5E7] dark:border-gray-800/80 bg-transparent">
                    <nav className="max-w-7xl mx-auto h-[44px] px-8 flex items-center justify-center space-x-8 text-[11px] font-bold tracking-wider text-gray-700 dark:text-gray-300">
                        {categories && categories.map((cat) => (
                            <div 
                                key={cat.id}
                                className="relative"
                                onMouseEnter={() => setHoveredCategory(cat.slug)}
                            >
                                <Link 
                                    href={`/category/${cat.slug}`}
                                    className="hover:text-[#0066CC] dark:hover:text-white transition-colors uppercase tracking-wider"
                                >
                                    {cat.name}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* MegaMenu Dropdowns */}
                {hoveredCategory && (
                    <MegaMenu 
                        categorySlug={hoveredCategory} 
                        onLeave={() => setHoveredCategory(null)} 
                    />
                )}
            </header>

            {/* Mobile Categories Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-[136px] z-35 bg-black/95 text-white lg:hidden py-8 px-6 font-sans flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center bg-gray-900 rounded-xl px-3.5 py-2">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search iPoint"
                                className="w-full bg-transparent border-none text-xs text-white placeholder-gray-500 focus:ring-0 focus:outline-none p-0"
                            />
                        </div>

                        {categories && categories.map((cat) => (
                            <Link 
                                key={cat.id} 
                                href={`/category/${cat.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold border-b border-white/10 pb-2.5 text-gray-300 hover:text-white"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-6 space-y-4 text-xs font-semibold">
                        <Link href="/apple-product-repair" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-300">
                            <Wrench className="w-4 h-4" />
                            <span>Book a Repair</span>
                        </Link>
                        <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-300">
                            <Scale className="w-4 h-4" />
                            <span>Compare{compareCount > 0 ? ` (${compareCount})` : ''}</span>
                        </Link>
                        <button onClick={() => { setIsMobileMenuOpen(false); setIsStoreModalOpen(true); }} className="flex items-center space-x-2 text-gray-300">
                            <Store className="w-4 h-4" />
                            <span>Pickup: {selectedStore || 'Select Store'}</span>
                        </button>
                        <button onClick={() => { setIsMobileMenuOpen(false); setIsTrackingModalOpen(true); }} className="flex items-center space-x-2 text-gray-300">
                            <Truck className="w-4 h-4" />
                            <span>Track Order</span>
                        </button>

                        {auth.user ? (
                            <button onClick={handleLogout} className="text-[#E30000] flex items-center space-x-2 border-t border-white/10 pt-4 w-full font-bold">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <div className="flex space-x-4 border-t border-white/10 pt-4">
                                <Link href={route('login')} onClick={() => setIsMobileMenuOpen(false)} className="text-[#0066CC]">Sign In</Link>
                                <Link href={route('register')} onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* A. Select Pickup Store Modal */}
            {isStoreModalOpen && (
                <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsStoreModalOpen(false)} />
                    <div className="w-full max-w-md bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl p-6 relative z-10 shadow-2xl font-sans">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                                <Store className="w-4 h-4 text-[#0066CC]" />
                                <span>Select a Pickup Store</span>
                            </h3>
                            <button onClick={() => setIsStoreModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="py-4 space-y-2">
                            {storeLocations.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => handleSelectStore(store.name)}
                                    className={`w-full text-left p-3.5 rounded-2xl border text-xs flex justify-between items-center transition-all ${
                                        selectedStore === store.name
                                            ? 'border-[#0066CC] bg-[#F0F7FF] dark:bg-blue-950/20 text-[#0066CC] font-bold'
                                            : 'border-gray-150 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-850 dark:text-gray-300'
                                    }`}
                                >
                                    <div>
                                        <p className="font-bold">{store.name}</p>
                                        <p className="text-[9px] text-gray-450 mt-0.5">{store.city}, South Africa</p>
                                    </div>
                                    <MapPin className="w-3.5 h-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* B. Order Tracking Modal */}
            {isTrackingModalOpen && (
                <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsTrackingModalOpen(false)} />
                    <div className="w-full max-w-lg bg-white dark:bg-[#1D1D1F] border border-gray-155 dark:border-gray-800 rounded-3xl p-6 relative z-10 shadow-2xl font-sans max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                                <Truck className="w-4 h-4 text-[#0066CC]" />
                                <span>Order Tracking System</span>
                            </h3>
                            <button onClick={() => setIsTrackingModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Input Form */}
                        <form onSubmit={handleTrackOrder} className="py-4 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1.5">Enter Order Reference Number</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text"
                                        value={trackOrderId}
                                        onChange={(e) => setTrackOrderId(e.target.value)}
                                        placeholder="e.g. 100001 or #IPT-100001"
                                        className="flex-1 border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-850 text-xs text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0066CC]"
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isFetchingTrack}
                                        className="px-6 py-2.5 bg-[#0066CC] hover:bg-[#0077ED] disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-colors"
                                    >
                                        {isFetchingTrack ? 'Searching...' : 'Track'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Error Alert */}
                        {trackingError && (
                            <div className="mb-4 bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-300 p-3.5 rounded-2xl text-[10px] font-bold border border-red-200 dark:border-transparent">
                                {trackingError}
                            </div>
                        )}

                        {/* Order Tracking Information Results */}
                        {trackOrderResult && (
                            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                                {/* Order info header details */}
                                <div className="flex justify-between items-start text-xs bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl">
                                    <div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Order Reference</p>
                                        <p className="font-bold text-gray-800 dark:text-white mt-0.5">#IPT-{(100000 + trackOrderResult.id)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Total Price</p>
                                        <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">R {parseFloat(trackOrderResult.total_amount).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span className={`px-2 py-0.5 border rounded-full text-[8px] font-bold uppercase ${
                                            getStatusDetails(trackOrderResult.status).color
                                        }`}>
                                            {getStatusDetails(trackOrderResult.status).text}
                                        </span>
                                    </div>
                                </div>

                                {/* Order items list */}
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {trackOrderResult.items.map((item) => (
                                        <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                                            <div className="flex items-center space-x-3">
                                                <img src={item.variant.product.image_path} alt={item.variant.product.name} className="w-8 h-8 object-contain bg-white p-0.5 border border-gray-100 rounded-lg flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{item.variant.product.name}</p>
                                                    <p className="text-[9px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-extrabold text-gray-900 dark:text-white">R {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tracking Map Canvas and coordinates visualizer */}
                                {trackOrderResult.status !== 'cancelled' && (
                                    <div className="pt-2">
                                        <TrackingMap 
                                            hereApiKey={hereApiKey} 
                                            city={trackOrderResult.city} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* C. Shopping Cart Sidebar Drawer */}
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </>
    );
}
