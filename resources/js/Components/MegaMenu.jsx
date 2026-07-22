import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const sublinksData = {
    mac: {
        title: 'Mac',
        columns: [
            {
                title: 'Laptops',
                links: [
                    { name: 'MacBook Air 13-inch', url: '/products/macbook-air-13-inch-m3' },
                    { name: 'MacBook Pro 14-inch', url: '/products/macbook-pro-14-inch-m3' },
                    { name: 'MacBook Pro 16-inch', url: '/products/macbook-pro-16-inch-m3-pro' },
                ]
            },
            {
                title: 'Desktops & More',
                links: [
                    { name: 'iMac 24-inch', url: '#' },
                    { name: 'Mac mini', url: '#' },
                    { name: 'Mac Studio', url: '#' },
                    { name: 'Compare Mac', url: '#' }
                ]
            },
            {
                title: 'Accessories',
                links: [
                    { name: 'Magic Mouse', url: '/products/apple-magic-mouse' },
                    { name: 'Magic Keyboard', url: '/products/apple-magic-keyboard-with-touch-id' },
                    { name: 'Adapters & Cables', url: '/products/usb-c-to-lightning-cable-1m' }
                ]
            }
        ],
        promo: {
            title: 'MacBook Pro',
            desc: 'Mind-blowing. Head-turning.',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
            url: '/products/macbook-pro-14-inch-m3'
        }
    },
    ipad: {
        title: 'iPad',
        columns: [
            {
                title: 'Models',
                links: [
                    { name: 'iPad Pro M4', url: '/products/ipad-pro-11-inch-m4' },
                    { name: 'iPad Air M2', url: '/products/ipad-air-11-inch-m2' },
                    { name: 'iPad (10th Gen)', url: '#' },
                    { name: 'Compare iPad', url: '#' }
                ]
            },
            {
                title: 'Accessories',
                links: [
                    { name: 'Apple Pencil Pro', url: '#' },
                    { name: 'Magic Keyboard for iPad', url: '#' },
                    { name: 'Smart Folio Covers', url: '#' }
                ]
            }
        ],
        promo: {
            title: 'iPad Pro',
            desc: 'Thinpossible. Liquid Retina XDR.',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80',
            url: '/products/ipad-pro-11-inch-m4'
        }
    },
    iphone: {
        title: 'iPhone',
        columns: [
            {
                title: 'Models',
                links: [
                    { name: 'iPhone 15 Pro Max', url: '/products/iphone-15-pro-max' },
                    { name: 'iPhone 15 Pro', url: '/products/iphone-15-pro' },
                    { name: 'iPhone 15', url: '/products/iphone-15' },
                    { name: 'Compare iPhone', url: '#' }
                ]
            },
            {
                title: 'Accessories',
                links: [
                    { name: 'MagSafe Chargers', url: '#' },
                    { name: 'Silicone Cases', url: '#' },
                    { name: 'FineWoven Wallets', url: '#' }
                ]
            }
        ],
        promo: {
            title: 'iPhone 15 Pro',
            desc: 'Titanium design. Action button.',
            image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=300&q=80',
            url: '/products/iphone-15-pro'
        }
    },
    watch: {
        title: 'Watch',
        columns: [
            {
                title: 'Models',
                links: [
                    { name: 'Apple Watch Ultra 2', url: '/products/apple-watch-ultra-2' },
                    { name: 'Apple Watch Series 9', url: '/products/apple-watch-series-9' },
                    { name: 'Apple Watch SE', url: '#' },
                    { name: 'Compare Watch', url: '#' }
                ]
            },
            {
                title: 'Straps & Accessories',
                links: [
                    { name: 'Alpine Loop', url: '#' },
                    { name: 'Ocean Band', url: '#' },
                    { name: 'Watch Chargers', url: '#' }
                ]
            }
        ],
        promo: {
            title: 'Apple Watch Ultra 2',
            desc: 'New finish. Adventure awaits.',
            image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80',
            url: '/products/apple-watch-ultra-2'
        }
    },
    airpods: {
        title: 'AirPods',
        columns: [
            {
                title: 'Models',
                links: [
                    { name: 'AirPods Pro (2nd Gen)', url: '/products/airpods-pro-2nd-gen' },
                    { name: 'AirPods Max', url: '/products/airpods-max' },
                    { name: 'AirPods (3rd Gen)', url: '#' },
                    { name: 'Compare AirPods', url: '#' }
                ]
            }
        ],
        promo: {
            title: 'AirPods Pro 2',
            desc: 'Adaptive Audio. Active Noise Cancelling.',
            image: 'https://images.unsplash.com/photo-1588449668338-d15176316704?auto=format&fit=crop&w=300&q=80',
            url: '/products/airpods-pro-2nd-gen'
        }
    }
};

export default function MegaMenu({ categorySlug, onLeave }) {
    const data = sublinksData[categorySlug];

    if (!data) return null;

    return (
        <div 
            className="absolute left-0 right-0 top-[72px] glass-panel shadow-xl transition-all duration-300 ease-out z-50 font-sans border-t border-[#E5E5E7] dark:border-gray-800/80"
            onMouseLeave={onLeave}
        >
            <div className="max-w-7xl mx-auto py-10 px-8 grid grid-cols-4 gap-8">
                {/* Links columns */}
                <div className="col-span-3 grid grid-cols-3 gap-6">
                    {data.columns.map((col, index) => (
                        <div key={index}>
                            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-3">
                                {col.links.map((link, lIndex) => (
                                    <li key={lIndex}>
                                        <Link 
                                            href={link.url}
                                            className="text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-[#0066CC] dark:hover:text-[#0077ED] flex items-center transition-colors"
                                        >
                                            {link.name}
                                            {link.url !== '#' && <ChevronRight className="w-3 h-3 ml-0.5 opacity-0 hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Promo Card */}
                {data.promo && (
                    <div className="border-l border-gray-100 dark:border-gray-800 pl-8 flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase text-[#E30000] tracking-wider">Spotlight</span>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">{data.promo.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data.promo.desc}</p>
                        </div>
                        <div className="my-4 h-28 flex items-center justify-start overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2">
                            <img 
                                src={data.promo.image} 
                                alt={data.promo.title} 
                                className="h-full w-full object-cover rounded-md"
                            />
                        </div>
                        <Link 
                            href={data.promo.url}
                            className="text-xs font-bold text-[#0066CC] dark:text-[#0077ED] hover:underline flex items-center"
                        >
                            Shop Now
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
