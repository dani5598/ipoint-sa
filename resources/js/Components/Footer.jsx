import React from 'react';
import { Link } from '@inertiajs/react';

// Brand/social glyphs (not available in this lucide-react build) as inline SVGs.
const FacebookIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" /></svg>
);
const InstagramIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);
const XIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" /></svg>
);
const YoutubeIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" /></svg>
);

export default function Footer() {
    const year = new Date().getFullYear();

    const columns = [
        {
            title: 'About',
            links: [
                { label: 'About Us', href: '/services' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Store Locator', href: '/apple-product-repair' },
                { label: 'Careers', href: '/services' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'FAQs', href: '/services' },
                { label: 'Warranty Info', href: '/services' },
                { label: 'Shipping & Returns', href: '/privacy' },
                { label: 'Book a Repair', href: '/apple-product-repair' },
                { label: 'Track Order', href: '/dashboard' },
            ],
        },
        {
            title: 'Policies',
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/privacy' },
                { label: 'Refund Policy', href: '/privacy' },
            ],
        },
        {
            title: 'Categories',
            links: [
                { label: 'iPhone', href: '/category/iphone' },
                { label: 'iPad', href: '/category/ipad' },
                { label: 'Mac', href: '/category/mac' },
                { label: 'Watch', href: '/category/watch' },
                { label: 'AirPods', href: '/category/airpods' },
                { label: 'Accessories', href: '/category/accessories' },
            ],
        },
    ];

    const socials = [
        { Icon: FacebookIcon, href: '#', label: 'Facebook' },
        { Icon: InstagramIcon, href: '#', label: 'Instagram' },
        { Icon: XIcon, href: '#', label: 'X' },
        { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
    ];

    return (
        <footer className="bg-[#F5F5F7] dark:bg-[#1D1D1F] text-[#1D1D1F] dark:text-[#F5F5F7] border-t border-[#D2D2D7] dark:border-gray-800 pt-14 pb-8 px-6 sm:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Top: logo + socials */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-[#D2D2D7] dark:border-gray-800/80">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
                        iPoint<span className="text-[#0071E3]">Apple</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                        {socials.map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-full border border-[#D2D2D7] dark:border-gray-700 flex items-center justify-center text-[#515154] dark:text-gray-400 hover:text-white hover:bg-[#0071E3] hover:border-[#0071E3] transition-colors"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-xs text-[#515154] dark:text-gray-400">
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-4 uppercase tracking-wider">{col.title}</h3>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="hover:text-[#0071E3] hover:underline transition-colors">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-[#D2D2D7] dark:border-gray-800/80 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#86868B] dark:text-gray-500 gap-4">
                    <p>Copyright © {year} ipointapple. All Rights Reserved.</p>
                    <div className="flex items-center space-x-4 opacity-75">
                        <span className="text-[10px] uppercase font-semibold text-[#1d1d1f] dark:text-white">We Accept</span>
                        <div className="flex space-x-2">
                            {['VISA', 'MC', 'EFT', 'COD'].map((m) => (
                                <span key={m} className="bg-[#FFFFFF] dark:bg-gray-850 px-2 py-1 rounded border border-[#D2D2D7] dark:border-gray-800 font-bold text-slate-800 dark:text-gray-300 text-[10px]">{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
