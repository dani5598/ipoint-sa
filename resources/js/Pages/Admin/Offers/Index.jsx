import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, ExternalLink } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Index({ offers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editOffer, setEditOffer] = useState(null);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        title: '',
        image_path: '',
        link_url: '',
        sort_order: 0,
        is_active: true,
        start_date: '',
        end_date: '',
    });

    const openAddModal = () => {
        reset();
        setEditOffer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (offer) => {
        setEditOffer(offer);
        setData({
            title: offer.title || '',
            image_path: offer.image_path || '',
            link_url: offer.link_url || '',
            sort_order: offer.sort_order ?? 0,
            is_active: !!offer.is_active,
            start_date: offer.start_date ? offer.start_date.substring(0, 10) : '',
            end_date: offer.end_date ? offer.end_date.substring(0, 10) : '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditOffer(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editOffer) {
            put(route('admin.offers.update', editOffer.id), { onSuccess: () => closeModal() });
        } else {
            post(route('admin.offers.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Delete this offer banner?')) {
            router.delete(route('admin.offers.destroy', id));
        }
    };

    const handleToggle = (id) => {
        router.post(route('admin.offers.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Manage Offers" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Latest Offers</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage the homepage offers carousel. Reorder, schedule, and toggle without a deploy.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Offer</span>
                    </button>
                </div>

                {/* Offers Table */}
                <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-900/50 text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-6 font-semibold">Preview</th>
                                    <th className="py-3 px-6 font-semibold">Title</th>
                                    <th className="py-3 px-6 font-semibold">Link</th>
                                    <th className="py-3 px-6 font-semibold text-center">Order</th>
                                    <th className="py-3 px-6 font-semibold text-center">Schedule</th>
                                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                                    <th className="py-3 px-6 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-855">
                                {offers.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="py-10 text-center text-gray-400">No offers yet. Add your first offer banner.</td>
                                    </tr>
                                )}
                                {offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                        <td className="py-3 px-6">
                                            <div className="w-24 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                                                {offer.image_path && (
                                                    <img src={offer.image_path} alt={offer.title || 'Offer'} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 font-bold text-gray-900 dark:text-white">{offer.title || <span className="text-gray-400 font-normal italic">Untitled</span>}</td>
                                        <td className="py-3 px-6 text-gray-500">
                                            {offer.link_url ? (
                                                <span className="inline-flex items-center gap-1 text-[#0066CC]"><ExternalLink className="w-3 h-3" />{offer.link_url}</span>
                                            ) : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="py-3 px-6 text-center font-mono text-gray-500">{offer.sort_order}</td>
                                        <td className="py-3 px-6 text-center text-[10px] text-gray-500">
                                            {offer.start_date || offer.end_date ? (
                                                <span>{(offer.start_date || '').substring(0, 10) || '…'} → {(offer.end_date || '').substring(0, 10) || '…'}</span>
                                            ) : <span className="text-gray-400">Always</span>}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                onClick={() => handleToggle(offer.id)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    offer.is_active
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                }`}
                                                title="Toggle visibility"
                                            >
                                                {offer.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {offer.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center justify-center space-x-2.5">
                                                <button onClick={() => openEditModal(offer)} className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(offer.id)} className="p-1 rounded-full text-gray-400 hover:text-[#E30000]" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeModal} />
                    <div className="w-full max-w-lg bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden font-sans max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {editOffer ? 'Edit Offer' : 'Create Offer'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-full text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Title (optional)</label>
                                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="e.g. Trade-In Bonus" />
                                <InputError message={errors.title} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Banner Image URL</label>
                                <input type="text" value={data.image_path} onChange={(e) => setData('image_path', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="https://…" required />
                                <InputError message={errors.image_path} className="mt-1" />
                                {data.image_path && (
                                    <div className="mt-2 w-full h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-850 border border-gray-100 dark:border-gray-800">
                                        <img src={data.image_path} alt="preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Link URL (optional)</label>
                                <input type="text" value={data.link_url} onChange={(e) => setData('link_url', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="/category/iphone" />
                                <InputError message={errors.link_url} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Display Order</label>
                                    <input type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)}
                                        className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white" />
                                    <InputError message={errors.sort_order} className="mt-1" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 accent-[#0066CC]" />
                                        Active (visible on site)
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Start Date (optional)</label>
                                    <input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white" />
                                    <InputError message={errors.start_date} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">End Date (optional)</label>
                                    <input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white" />
                                    <InputError message={errors.end_date} className="mt-1" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={closeModal}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing}
                                    className="px-5 py-2 bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full">
                                    {processing ? 'Saving...' : 'Save Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
