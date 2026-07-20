import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Index({ sizes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editSize, setEditSize] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        reference_value: ''
    });

    const openAddModal = () => {
        reset();
        setEditSize(null);
        setIsModalOpen(true);
    };

    const openEditModal = (size) => {
        setEditSize(size);
        setData({
            name: size.name,
            reference_value: size.reference_value || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditSize(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editSize) {
            put(route('admin.sizes.update', editSize.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('admin.sizes.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this size/capacity?')) {
            destroy(route('admin.sizes.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Sizes" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sizes & Capacities</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage catalog product option sizes and storage capacities.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Size</span>
                    </button>
                </div>

                {/* Sizes Table */}
                <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden max-w-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-900/50 text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-6 font-semibold">Size / Capacity</th>
                                    <th className="py-3 px-6 font-semibold">Type Reference</th>
                                    <th className="py-3 px-6 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-855">
                                {sizes.map((size) => (
                                    <tr key={size.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{size.name}</td>
                                        <td className="py-4 px-6 text-gray-500">{size.reference_value || 'None'}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center space-x-2.5">
                                                <button 
                                                    onClick={() => openEditModal(size)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                                    title="Edit Size"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(size.id)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-[#E30000]"
                                                    title="Delete Size"
                                                >
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

            {/* Modal Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeModal} />
                    
                    <div className="w-full max-w-md bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden font-sans">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {editSize ? 'Edit Size' : 'Create Size'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-full text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Size / Capacity Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="e.g. 256GB, 45mm, 14-inch"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Type Reference Description</label>
                                <input 
                                    type="text" 
                                    value={data.reference_value}
                                    onChange={(e) => setData('reference_value', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="e.g. Storage Capacity, Case Size, Screen size"
                                />
                                <InputError message={errors.reference_value} className="mt-1" />
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-5 py-2 bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full"
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
