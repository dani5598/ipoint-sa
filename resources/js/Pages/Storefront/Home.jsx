import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ScrollReveal from '@/Components/ScrollReveal';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, RefreshCw, Smartphone, CreditCard } from 'lucide-react';
export default function Home({ heroBanners, bentoBanners, zigzagBanners, featuredProducts, promoProducts, newProducts, whatsNewBanners, offers = [], categoriesWithProducts }) {
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
    const [currentPromoSlide, setCurrentPromoSlide] = useState(0);

    // Auto-rotate hero slider
    useEffect(() => {
        if (heroBanners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentHeroSlide((prev) => (prev + 1) % heroBanners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroBanners]);

    // Auto-rotate comparison promo slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromoSlide((prev) => (prev + 1) % 3);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrentHeroSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
    };

    const nextSlide = () => {
        setCurrentHeroSlide((prev) => (prev + 1) % heroBanners.length);
    };

    // Latest Offers carousel scroll controls
    const offersRef = useRef(null);
    const scrollOffers = (dir) => {
        if (offersRef.current) {
            offersRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
        }
    };

    return (
        <StorefrontLayout>
            <Head title="Apple Premium Partner" />

            {/* 1. Hero Carousel */}
            {heroBanners.length > 0 && (
                <section className="relative h-[65vh] sm:h-[80vh] bg-black overflow-hidden group">
                    {heroBanners.map((slide, index) => (
                        <div 
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                index === currentHeroSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            {/* Background Image with Dark Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10" />
                            <img 
                                src={slide.image_path} 
                                alt={slide.title} 
                                className="w-full h-full object-cover opacity-75"
                            />
                            
                            {/* Slide Text Content */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end items-center text-center pb-16 px-4">
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
                                    {slide.title}
                                </h1>
                                <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-xl mt-3 font-normal drop-shadow-sm">
                                    {slide.subtitle}
                                </p>
                                <div className="mt-8 flex items-center space-x-4">
                                    <Link 
                                        href={slide.link_url || '#'}
                                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                                    >
                                        Learn More
                                    </Link>
                                    <Link 
                                        href={slide.link_url || '#'}
                                        className="text-[#2997ff] hover:underline text-xs sm:text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform"
                                    >
                                        Buy Now
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Arrow Indicators */}
                    {heroBanners.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
                                {heroBanners.map((_, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setCurrentHeroSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentHeroSlide ? 'bg-white w-6' : 'bg-white/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* 2. Quick Category Strip - Official Apple Store Style */}
            <section className="bg-white dark:bg-[#1D1D1F] py-16 border-b border-[#D2D2D7] dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mb-10 text-left">
                        View all Apple products.
                    </h2>
                    
                    <div className="flex items-end justify-between overflow-x-auto pb-4 space-x-12 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {[
                            { 
                                name: 'Mac', 
                                slug: 'mac', 
                                image: '/uploads/categories/mac.png',
                                price: 'From R11 999'
                            },
                            { 
                                name: 'iPhone', 
                                slug: 'iphone', 
                                image: '/uploads/categories/iphone.png',
                                price: 'From R13 999'
                            },
                            { 
                                name: 'iPad', 
                                slug: 'ipad', 
                                image: '/uploads/categories/ipad.png',
                                price: 'From R6999'
                            },
                            { 
                                name: 'WATCH', 
                                slug: 'watch', 
                                image: '/uploads/categories/watch.png',
                                price: 'From R5799'
                            },
                            { 
                                name: 'AirPods', 
                                slug: 'airpods', 
                                image: '/uploads/categories/airpods.png',
                                price: 'From R2799'
                            },
                            { 
                                name: 'TV & Home', 
                                slug: 'tv-home', 
                                image: '/uploads/categories/tv-home.png',
                                price: 'From R2399'
                            },
                            { 
                                name: 'Accessories', 
                                slug: 'accessories', 
                                image: '/uploads/categories/accessories.png',
                                price: 'From R399'
                            },
                            { 
                                name: 'AirTag', 
                                slug: 'accessories', 
                                image: '/uploads/categories/airtag.png',
                                price: 'From R599'
                            },
                        ].map((cat, idx) => (
                            <Link 
                                key={`${cat.slug}-${idx}`}
                                href={`/category/${cat.slug}`}
                                className="flex flex-col items-center flex-shrink-0 text-center group font-sans w-24 sm:w-28 transition-transform duration-300 hover:scale-[1.03]"
                            >
                                <div className="h-20 w-full flex items-end justify-center mb-4">
                                    <img 
                                        src={cat.image} 
                                        alt={cat.name} 
                                        className="max-h-full max-w-full object-contain" 
                                    />
                                </div>
                                <span className="text-xs font-bold text-[#1D1D1F] dark:text-white leading-tight">
                                    {cat.name}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 font-medium whitespace-nowrap">
                                    {cat.price}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Bento Featured Grid */}
            {bentoBanners.length > 0 && (
                <ScrollReveal>
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mb-8">
                            See what's in store.
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Bento Main Tile */}
                            <div className="md:col-span-2 relative h-96 bg-black rounded-3xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                                <img 
                                    src={bentoBanners[0].image_path} 
                                    alt={bentoBanners[0].title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center p-8 max-w-sm sm:max-w-md">
                                    <span className="text-[10px] font-bold uppercase text-[#0066CC] tracking-wider">Highlight</span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight">
                                        {bentoBanners[0].title}
                                    </h3>
                                    <p className="text-xs text-gray-300 mt-2 font-normal">
                                        {bentoBanners[0].subtitle}
                                    </p>
                                    <Link 
                                        href={bentoBanners[0].link_url || '#'}
                                        className="inline-flex items-center text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0077ED] px-4 py-2 rounded-full mt-6 w-fit transition-colors"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>

                            {/* Two side tiles stack */}
                            <div className="grid grid-rows-2 gap-6">
                                {bentoBanners.slice(1, 3).map((item) => (
                                    <div key={item.id} className="relative bg-white dark:bg-[#1D1D1F] rounded-3xl overflow-hidden border border-[#D2D2D7]/50 dark:border-gray-800 group">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img 
                                            src={item.image_path} 
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h4>
                                            <p className="text-[11px] text-gray-200 truncate mt-1">{item.subtitle}</p>
                                            <Link 
                                                href={item.link_url || '#'}
                                                className="text-[10px] font-extrabold text-[#2997ff] hover:underline flex items-center mt-2"
                                            >
                                                Buy Now <ArrowRight className="w-3 h-3 ml-0.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* 4. Promo Deals Showcase */}
            {promoProducts.length > 0 && (
                <ScrollReveal>
                    <section className="bg-white dark:bg-[#1D1D1F] py-16 border-t border-b border-[#D2D2D7] dark:border-gray-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="flex justify-between items-baseline mb-8">
                                <div>
                                    <span className="text-[10px] font-bold text-[#E30000] uppercase tracking-wider">Limited Time</span>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-1">
                                        Don't miss these great deals.
                                    </h2>
                                </div>
                                <Link href="#" className="text-xs font-bold text-[#0066CC] hover:underline flex items-center">
                                    View all deals <ChevronRight className="w-4 h-4 ml-0.5" />
                                </Link>
                            </div>

                            {/* Product Cards Slider/Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {promoProducts.map((prod) => {
                                    return (
                                        <Link 
                                            key={prod.id} 
                                            href={`/products/${prod.slug}`}
                                            className="bg-white dark:bg-[#1D1D1F] border border-gray-200 dark:border-gray-800 rounded-[4px] p-4 flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                                        >
                                            <div className="relative">
                                                {/* Product Image */}
                                                <div className="h-48 w-full flex items-center justify-center overflow-hidden my-2 bg-transparent">
                                                    <img 
                                                        src={prod.image_path} 
                                                        alt={prod.name} 
                                                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>

                                                {/* Apple-style subtle horizontal divider line before text detail */}
                                                <div className="border-t border-gray-100 dark:border-gray-800/60 my-4" />
                                            </div>

                                            <div className="text-left space-y-1 mt-auto">
                                                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                                                    {prod.name}
                                                </h3>
                                                {/* Specifications Subtitle */}
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                                    (Standard Variant, 256GB)
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* 4b. Latest Offers — admin-managed carousel (§4.4) */}
            {offers && offers.length > 0 && (
                <ScrollReveal>
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-[10px] font-bold text-[#0066CC] uppercase tracking-wider">Deals & Promotions</span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-1">
                                    Latest offers.
                                </h2>
                            </div>
                            <div className="hidden sm:flex items-center space-x-2">
                                <button onClick={() => scrollOffers(-1)} className="p-2 rounded-full bg-white dark:bg-[#1D1D1F] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => scrollOffers(1)} className="p-2 rounded-full bg-white dark:bg-[#1D1D1F] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div ref={offersRef} className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {offers.map((offer) => (
                                <Link
                                    key={offer.id}
                                    href={offer.link_url || '#'}
                                    className="flex-shrink-0 w-[300px] sm:w-[340px] group"
                                >
                                    <div className="relative h-52 sm:h-60 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-850 border border-gray-150 dark:border-gray-800">
                                        <img
                                            src={offer.image_path}
                                            alt={offer.title || 'Offer'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {offer.title && (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                                    <h3 className="text-base font-extrabold text-white leading-tight">{offer.title}</h3>
                                                    <span className="inline-flex items-center text-[11px] font-bold text-[#2997ff] mt-1">
                                                        Shop offer <ArrowRight className="w-3 h-3 ml-0.5" />
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* 5. Service Features Row */}
            <ScrollReveal>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-6 glass-card rounded-3xl flex flex-col items-center animate-fade-in-up delay-100 opacity-0">
                            <Smartphone className="w-8 h-8 text-[#0066CC] mb-4" />
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">iStore Trade-In</h4>
                            <p className="text-[10px] text-gray-400 mt-2 max-w-xs">Trade in your old Apple device and get up to R10,000 credit.</p>
                        </div>
                        <div className="p-6 glass-card rounded-3xl flex flex-col items-center animate-fade-in-up delay-200 opacity-0">
                            <ShieldCheck className="w-8 h-8 text-[#E30000] mb-4" />
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">iCare Protection</h4>
                            <p className="text-[10px] text-gray-400 mt-2 max-w-xs">Warranty upgrades, screen repair coverage, and technical support.</p>
                        </div>
                        <div className="p-6 glass-card rounded-3xl flex flex-col items-center animate-fade-in-up delay-300 opacity-0">
                            <RefreshCw className="w-8 h-8 text-indigo-500 mb-4" />
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Easy Upgrades</h4>
                            <p className="text-[10px] text-gray-400 mt-2 max-w-xs">Get a new iPhone every year with our flexible upgrades contracts.</p>
                        </div>
                        <div className="p-6 glass-card rounded-3xl flex flex-col items-center animate-fade-in-up delay-400 opacity-0">
                            <CreditCard className="w-8 h-8 text-emerald-500 mb-4" />
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Flexible Payments</h4>
                            <p className="text-[10px] text-gray-400 mt-2 max-w-xs">Pay in interest-free monthly installments using Mobicred.</p>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* 6. Zigzag Banners Section */}
            {zigzagBanners.length > 0 && (
                <ScrollReveal>
                    <section className="bg-white dark:bg-[#1D1D1F] border-t border-[#D2D2D7] dark:border-gray-800">
                        {zigzagBanners.map((banner, index) => {
                            const isEven = index % 2 === 0;
                            const [isOpen, setIsOpen] = useState(false);
                            return (
                                <div 
                                    key={banner.id}
                                    className={`border-b border-[#D2D2D7] dark:border-gray-800 py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center`}
                                >
                                    <div className={`flex flex-col justify-center ${isEven ? 'order-1' : 'order-1 md:order-2'}`}>
                                        <span className="text-[10px] font-bold uppercase text-[#0066CC] tracking-wider">Services</span>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-2 leading-tight">
                                            {banner.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-normal leading-relaxed">
                                            {banner.subtitle}
                                        </p>
                                        <button 
                                            onClick={() => setIsOpen(true)}
                                            className="text-xs font-bold text-[#0066CC] hover:underline flex items-center mt-6 w-fit focus:outline-none"
                                        >
                                            Learn More <ChevronRight className="w-4 h-4 ml-0.5" />
                                        </button>
                                    </div>
                                    <div className={`rounded-3xl overflow-hidden h-72 md:h-96 ${isEven ? 'order-2' : 'order-2 md:order-1'}`}>
                                        <img 
                                            src={banner.image_path} 
                                            alt={banner.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Custom Dynamic Modal dialog to replace dead 404 page */}
                                    {isOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
                                            <div className="w-full max-w-md bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl p-6 relative z-10 shadow-2xl font-sans text-xs my-auto mx-auto self-center">
                                                <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                                                    <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-white uppercase tracking-wider">{banner.title}</h3>
                                                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold p-1">✕</button>
                                                </div>
                                                <div className="py-4 space-y-3 leading-relaxed text-gray-600 dark:text-gray-300">
                                                    <p className="font-semibold text-gray-800 dark:text-white">{banner.subtitle}</p>
                                                    {banner.title.includes('Trade-in') || banner.title.includes('Trade-In') ? (
                                                        <p>
                                                            Get cash back or credit towards your next device. You can trade in up to 5 devices at a time online or at any local iStore outlet. Our technicians will inspect your device state and offer a high-value discount coupon code to redeem during checkout.
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            Our iCare Protection Plans cover screen damages, battery replacements, and certified hardware repairs. Get direct access to Apple-authorized support channels, original replacement parts, and extended warranty options up to 2 years.
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
                                                    <button 
                                                        onClick={() => setIsOpen(false)} 
                                                        className="px-5 py-2 bg-[#0066CC] hover:bg-[#0077ED] text-white font-semibold rounded-full"
                                                    >
                                                        Understood
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                </ScrollReveal>
            )}

            {/* 7. Whats New Story Shelf Row */}
            {whatsNewBanners && whatsNewBanners.length > 0 && (
                <ScrollReveal>
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                        <div className="mb-8">
                            <span className="text-[10px] font-bold text-[#0066CC] uppercase tracking-wider">New Releases</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-1">
                                See what's new.
                            </h2>
                        </div>

                        {/* Horizontal scroll shelf */}
                        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {whatsNewBanners.map((banner) => (
                                <Link
                                    key={banner.id}
                                    href={banner.link_url || '#'}
                                    className="flex-shrink-0 w-[280px] sm:w-[340px] h-[400px] sm:h-[480px] rounded-3xl overflow-hidden glass-card"
                                >
                                    {/* Full-bleed Image */}
                                    <img
                                        src={banner.image_path}
                                        alt={banner.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Subtle top-to-bottom gradient overlay to ensure text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent z-10" />

                                    {/* Content Overlay at the top */}
                                    <div className="absolute top-0 left-0 right-0 p-8 z-20 text-white">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2997ff]">New release</span>
                                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2 text-white leading-tight">
                                            {banner.title}
                                        </h3>
                                        <p className="text-xs text-gray-200 mt-2 font-normal max-w-[240px] leading-relaxed">
                                            {banner.subtitle}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>
            )}

            {/* Dynamic Category Sliders Story Shelf */}
            {categoriesWithProducts && categoriesWithProducts.map((cat) => (
                <ScrollReveal key={cat.id}>
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 border-t border-[#D2D2D7]/20 dark:border-gray-800/50">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-bold text-[#0066CC] uppercase tracking-wider">Explore Range</span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-1">
                                    {cat.name}
                                </h2>
                            </div>
                            <Link 
                                href={`/category/${cat.slug}`} 
                                className="text-xs font-bold text-[#0066CC] hover:underline flex items-center mb-1"
                            >
                                View all {cat.name} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                        </div>

                        {/* Horizontal scroll shelf */}
                        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {cat.products.map((prod) => (
                                <Link
                                    key={prod.id}
                                    href={`/products/${prod.slug}`}
                                    className="flex-shrink-0 w-[280px] sm:w-[340px] h-[400px] sm:h-[480px] rounded-3xl overflow-hidden glass-card"
                                >
                                    {/* Full-bleed Product Image */}
                                    <img
                                        src={prod.image_path}
                                        alt={prod.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Subtle top-to-bottom dark gradient overlay for text legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10" />

                                    {/* Content Overlay at the top */}
                                    <div className="absolute top-0 left-0 right-0 p-8 z-20 text-white">
                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#2997ff]">
                                            {prod.is_new ? 'New' : prod.is_featured ? 'Featured' : 'Popular'}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2 text-white leading-tight">
                                            {prod.name}
                                        </h3>
                                        <p className="text-xs text-gray-200 mt-2 font-normal max-w-[240px] leading-relaxed">
                                            From R {parseFloat(prod.base_price).toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>
            ))}

            {/* 9. Selection Made Easy Comparison Slider */}
            <ScrollReveal>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                    <div className="relative rounded-3xl overflow-hidden bg-[#F5F5F7] dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800/80 group">
                        
                        {/* Slides track (sliding animation) */}
                        <div 
                            className="flex transition-transform duration-700 ease-out"
                            style={{ transform: `translateX(-${currentPromoSlide * 100}%)` }}
                        >
                            {[
                                {
                                    title: "Selection Made EASY.",
                                    subtitle: "With Mercantile comprehensive comparison tool",
                                    buttonText: "Compare Products",
                                    link: "/compare",
                                    overlayText: "iPhone 17",
                                    overlaySub: "PRO",
                                    image: "/uploads/iphone_17_pro_orange.png"
                                },
                                {
                                    title: "The future is bright.",
                                    subtitle: "Explore the new iPhone 16 Pro series with dynamic camera control",
                                    buttonText: "Explore iPhone",
                                    link: "/category/iphone",
                                    overlayText: "iPhone 16",
                                    overlaySub: "PRO",
                                    image: "/uploads/iphone_16_pro_titanium.png"
                                },
                                {
                                    title: "Work. Play. Create.",
                                    subtitle: "Supercharged by Apple M4 silicon chip architectures",
                                    buttonText: "Explore Mac",
                                    link: "/category/mac",
                                    overlayText: "MacBook",
                                    overlaySub: "PRO",
                                    image: "/uploads/macbook_pro_m4_silver.png"
                                }
                            ].map((slide, index) => (
                                <div 
                                    key={index}
                                    className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-12 items-center"
                                >
                                    {/* Left text column */}
                                    <div className="col-span-12 md:col-span-5 flex flex-col justify-center text-left space-y-4 px-8 py-12 sm:px-16 sm:py-20 z-20">
                                        <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                                            {slide.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {slide.subtitle}
                                        </p>
                                        <Link 
                                            href={slide.link}
                                            className="inline-flex items-center text-xs font-bold text-gray-900 dark:text-white bg-transparent hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black border border-gray-900 dark:border-white px-6 py-3 rounded-full mt-4 w-fit transition-all duration-300 active:scale-95"
                                        >
                                            {slide.buttonText}
                                        </Link>
                                    </div>

                                    {/* Right visual column with massive text backdrop */}
                                    <div className="col-span-12 md:col-span-7 relative flex items-end justify-center select-none overflow-hidden h-64 sm:h-80 md:h-[420px] w-full">
                                        
                                        {/* Large background typography backdrop */}
                                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none pointer-events-none z-10 font-sans">
                                            <span className="block text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1 flex items-center justify-center gap-1 leading-none">
                                                <span className="text-xl"></span> {slide.overlayText}
                                            </span>
                                            <span className="block text-7xl md:text-8xl font-black tracking-tighter uppercase text-gray-900/5 dark:text-white/5 leading-none">
                                                {slide.overlaySub}
                                            </span>
                                        </div>

                                        {/* Phone image overlapping the text */}
                                        <img 
                                            src={slide.image} 
                                            alt={slide.title}
                                            className="w-full h-full object-cover z-20 select-none pointer-events-none"
                                        />

                                        {/* Gradient fades to blend the image edges */}
                                        <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#F5F5F7] via-[#F5F5F7]/90 to-transparent dark:from-[#1D1D1F] dark:via-[#1D1D1F]/90 z-20 pointer-events-none" />
                                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F5F5F7] to-transparent dark:from-[#1D1D1F] z-20 pointer-events-none" />
                                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F5F5F7] to-transparent dark:from-[#1D1D1F] z-20 pointer-events-none" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation controls */}
                        <button 
                            onClick={() => setCurrentPromoSlide((prev) => (prev - 1 + 3) % 3)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/80 text-gray-800 dark:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none shadow-md border border-white/20"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setCurrentPromoSlide((prev) => (prev + 1) % 3)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/40 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/80 text-gray-800 dark:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none shadow-md border border-white/20"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dots indicator index */}
                        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
                            {[0, 1, 2].map((dotIdx) => (
                                <button 
                                    key={dotIdx}
                                    onClick={() => setCurrentPromoSlide(dotIdx)}
                                    className={`h-1.5 rounded-full transition-all ${
                                        dotIdx === currentPromoSlide ? 'bg-[#0066CC] w-6' : 'bg-gray-400/50 hover:bg-gray-500 w-1.5'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </StorefrontLayout>
    );
}
