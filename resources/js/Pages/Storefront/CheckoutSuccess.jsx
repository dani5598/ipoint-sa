import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { CheckCircle, Truck, Package, ArrowRight, Calendar } from 'lucide-react';

export default function CheckoutSuccess({ order }) {
    const formattedDate = new Date(order.created_at).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <StorefrontLayout>
            <Head title="Order Confirmed — Thank You" />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-1.5 text-[11px] text-gray-400 mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-[#0066CC] transition-colors font-medium">Home</Link>
                    <span className="text-gray-300">›</span>
                    <span className="text-[#1D1D1F] dark:text-white font-semibold">Order Confirmed</span>
                </nav>

                {/* Header message */}
                <div className="text-center pb-12 border-b border-gray-200 dark:border-gray-800">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto stroke-[1.25] mb-4" />
                    <h1 className="text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">
                        Thank you for your order.
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        Your transaction was successful. We have sent a confirmation email containing invoice specifics to <span className="font-semibold text-gray-900 dark:text-white">{order.customer_email}</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
                    {/* Invoice Meta details */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-850 pb-3">
                                Delivery Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="text-gray-400">Recipient Name</p>
                                    <p className="font-semibold text-gray-800 dark:text-white mt-1">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Contact Number</p>
                                    <p className="font-semibold text-gray-800 dark:text-white mt-1">{order.customer_phone || 'Not Provided'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-gray-400">Shipping Address</p>
                                    <p className="font-semibold text-gray-850 dark:text-white mt-1 leading-relaxed">
                                        {order.shipping_address}, {order.city}, {order.postal_code}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items summary */}
                        <div className="bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-850 pb-3 flex items-center space-x-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                <span>Items in Shipment</span>
                            </h3>

                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 border border-gray-100 dark:border-gray-850 rounded-lg flex items-center justify-center p-1 bg-white flex-shrink-0">
                                                <img src={item.variant.product.image_path} alt={item.variant.product.name} className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{item.variant.product.name}</p>
                                                <div className="flex space-x-2 text-[10px] text-gray-400 mt-0.5">
                                                    {item.variant.color && <span>Color: {item.variant.color.name}</span>}
                                                    {item.variant.size && <span>• Size: {item.variant.size.name}</span>}
                                                    <span>• Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            R {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order summary box */}
                    <div className="space-y-6">
                        <div className="bg-[#1D1D1F] text-white rounded-3xl p-6 space-y-6 shadow-lg">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/10 pb-3">
                                Order Overview
                            </h3>

                            <div className="space-y-4 text-xs">
                                <div className="flex items-start justify-between">
                                    <span className="text-gray-400">Order Number</span>
                                    <span className="font-mono font-semibold text-right">#IST-{(100000 + order.id)}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="text-gray-400">Date Placed</span>
                                    <span className="font-semibold text-right">{formattedDate}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="text-gray-400">Status</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 font-semibold border border-emerald-500/20 text-[10px]">
                                        Secure Paid
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                                <span className="text-xs font-bold text-gray-300">Total Charged</span>
                                <span className="text-lg font-extrabold text-white">R {parseFloat(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl p-6 text-[10px] text-gray-500 space-y-3.5">
                            <div className="flex items-start space-x-2.5">
                                <Truck className="w-4 h-4 text-[#0066CC] flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-300">Standard Delivery</p>
                                    <p className="mt-0.5">Expect dispatch within 24 hours. Delivery takes 2-4 working days depending on location.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/"
                            className="w-full text-center bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold py-3.5 rounded-full block transition-transform hover:scale-[1.01]"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
