import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { ShieldCheck, Laptop, Smartphone, HelpCircle, Truck, Zap, Headphones, RefreshCw } from 'lucide-react';

export default function Services() {
    return (
        <StorefrontLayout>
            <Head title="Premium Services — iPoint" />

            {/* Header Jumbotron */}
            <div className="bg-[#F5F5F7] dark:bg-[#1D1D1F] py-20 border-b border-[#E5E5E7] dark:border-gray-800">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <span className="text-[10px] font-bold text-[#0066CC] uppercase tracking-wider">iPoint Services</span>
                    <h1 className="text-4xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-3">
                        Services designed for you.
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
                        From authorized hardware repairs to trade-ins and premium protection plans, we provide everything you need to keep your devices running perfectly.
                    </p>
                </div>
            </div>

            {/* Core Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 space-y-16 font-sans">
                
                {/* 1. Quad Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Card 1: Authorized Repairs */}
                    <div className="glass-card rounded-3xl p-8 space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <Laptop className="w-6 h-6 text-[#0066CC]" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Authorized Repairs</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Our team of Apple-certified technicians uses genuine parts to perform diagnostic checks, battery replacements, and screen repairs.
                        </p>
                    </div>

                    {/* Card 2: iPoint Trade-In */}
                    <div className="glass-card rounded-3xl p-8 space-y-4">
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">iPoint Trade-In</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Trade in your old smartphone, tablet, or laptop and get direct store credits or cash back to reduce the cost of your upgrade.
                        </p>
                    </div>

                    {/* Card 3: Protection Plans */}
                    <div className="glass-card rounded-3xl p-8 space-y-4">
                        <div className="bg-red-50 dark:bg-red-950/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-[#E30000]" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">iCare Protection Plan</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Protect your purchase with comprehensive physical damage coverage, liquid ingress protection, and dedicated priority support.
                        </p>
                    </div>

                    {/* Card 4: Free Express Delivery */}
                    <div className="glass-card rounded-3xl p-8 space-y-4">
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Free Express Delivery</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Enjoy free courier delivery on all orders nationwide, or select Click & Collect to pick up from Sandton or V&A locations.
                        </p>
                    </div>

                    {/* Card 5: Set up & Setup Assist */}
                    <div className="glass-card rounded-3xl p-8 space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-950/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Set Up & Data Migration</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Bought a new Mac or iPhone? Our staff will assist you in transferring contacts, photos, and configurations securely.
                        </p>
                    </div>

                    {/* Card 6: 24/7 Priority Support */}
                    <div className="glass-card rounded-3xl p-8 space-y-4">
                        <div className="bg-purple-50 dark:bg-purple-950/30 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <Headphones className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Expert Consultation</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Need help picking a custom build or setting up corporate business integrations? Call or email our technical advisors.
                        </p>
                    </div>

                </div>

                {/* Info Graphic Banner Section */}
                <div className="bg-gradient-to-br from-[#F5F5F7] to-[#E8E8ED] dark:from-[#1D1D1F] dark:to-[#161617] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <span className="text-[10px] font-bold text-[#0066CC] uppercase">Upgrade Today</span>
                        <h2 className="text-2xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">
                            Ready to trade in your old device?
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Bring your device to any store for a fast, free evaluation. Or get an initial valuation using our contact form online.
                        </p>
                        <Link 
                            href="/contact"
                            className="inline-block bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-6 py-3 rounded-full mt-2 transition-transform hover:scale-[1.01]"
                        >
                            Enquire Online
                        </Link>
                    </div>
                    <Smartphone className="w-36 h-36 text-gray-300 dark:text-gray-800 flex-shrink-0" />
                </div>
            </div>
        </StorefrontLayout>
    );
}
