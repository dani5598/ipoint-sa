import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Star, Check, EyeOff, Trash2, MessageSquare } from 'lucide-react';

export default function Index({ reviews, filter, counts }) {
    const setFilter = (f) => {
        router.get(route('admin.reviews.index'), { filter: f }, { preserveState: true, preserveScroll: true });
    };

    const approve = (id) => router.post(route('admin.reviews.approve', id), {}, { preserveScroll: true });
    const reject = (id) => router.post(route('admin.reviews.reject', id), {}, { preserveScroll: true });
    const destroy = (id) => {
        if (confirm('Permanently delete this review?')) {
            router.delete(route('admin.reviews.destroy', id), { preserveScroll: true });
        }
    };

    const tabs = [
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'approved', label: 'Approved', count: counts.approved },
        { key: 'all', label: 'All', count: counts.all },
    ];

    return (
        <AdminLayout>
            <Head title="Moderate Reviews" />

            <div className="space-y-6 font-sans">
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Reviews Moderation</h1>
                    <p className="text-xs text-gray-400 mt-1">Approve, unpublish or delete customer reviews before they appear on product pages.</p>
                </div>

                {/* Filter Tabs */}
                <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200/60 dark:border-gray-700">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setFilter(t.key)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                filter === t.key ? 'bg-[#0066CC] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                            }`}
                        >
                            {t.label} <span className="opacity-70">({t.count})</span>
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl">
                            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No reviews in this view.</p>
                        </div>
                    )}

                    {reviews.map((rev) => (
                        <div key={rev.id} className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row gap-4">
                            {/* Product */}
                            <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                                {rev.product?.image_path && (
                                    <img src={rev.product.image_path} alt={rev.product?.name} className="w-12 h-12 object-contain bg-gray-50 dark:bg-gray-850 rounded-xl p-1 border border-gray-100 dark:border-gray-800" />
                                )}
                                <div className="min-w-0">
                                    {rev.product ? (
                                        <Link href={`/products/${rev.product.slug}`} className="text-xs font-bold text-gray-900 dark:text-white hover:text-[#0066CC] line-clamp-2">{rev.product.name}</Link>
                                    ) : <span className="text-xs text-gray-400">Deleted product</span>}
                                </div>
                            </div>

                            {/* Review body */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{rev.reviewer_name}</span>
                                    <span className="flex text-amber-400">
                                        {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </span>
                                    {rev.is_approved ? (
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Published</span>
                                    ) : (
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">Pending</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{rev.comment}</p>
                                <p className="text-[10px] text-gray-400 mt-2">{new Date(rev.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                {!rev.is_approved ? (
                                    <button onClick={() => approve(rev.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-green-600 hover:bg-green-500 text-white">
                                        <Check className="w-3.5 h-3.5" /> Approve
                                    </button>
                                ) : (
                                    <button onClick={() => reject(rev.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <EyeOff className="w-3.5 h-3.5" /> Unpublish
                                    </button>
                                )}
                                <button onClick={() => destroy(rev.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#FDF2F2] dark:bg-red-950/30 text-[#D32F2F] hover:bg-[#FDE2E2]">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
