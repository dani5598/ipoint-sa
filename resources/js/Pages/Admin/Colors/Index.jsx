import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Index({ colors }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editColor, setEditColor] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        hex_code: '#000000'
    });

    const openAddModal = () => {
        reset();
        setEditColor(null);
        setIsModalOpen(true);
    };

    const openEditModal = (color) => {
        setEditColor(color);
        setData({
            name: color.name,
            hex_code: color.hex_code
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditColor(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editColor) {
            put(route('admin.colors.update', editColor.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('admin.colors.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this color?')) {
            destroy(route('admin.colors.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Colors" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Colors</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage catalog product option colors.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Color</span>
                    </button>
                </div>

                {/* Colors Table */}
                <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden max-w-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-900/50 text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-6 font-semibold">Color Bubble</th>
                                    <th className="py-3 px-6 font-semibold">Color Name</th>
                                    <th className="py-3 px-6 font-semibold">Hex Code</th>
                                    <th className="py-3 px-6 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-855">
                                {colors.map((color) => (
                                    <tr key={color.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                        <td className="py-4 px-6">
                                            <span 
                                                className="w-6 h-6 rounded-full border border-black/10 block shadow-sm"
                                                style={{ backgroundColor: color.hex_code }}
                                            />
                                        </td>
                                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{color.name}</td>
                                        <td className="py-4 px-6 font-mono text-[10px] text-gray-500 uppercase">{color.hex_code}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center space-x-2.5">
                                                <button 
                                                    onClick={() => openEditModal(color)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                                    title="Edit Color"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(color.id)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-[#E30000]"
                                                    title="Delete Color"
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
                                {editColor ? 'Edit Color' : 'Create Color'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-full text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Color Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="e.g. Space Black"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Hex Code</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="color" 
                                        value={data.hex_code}
                                        onChange={(e) => setData('hex_code', e.target.value)}
                                        className="w-10 h-10 border border-gray-200 dark:border-gray-800 rounded-xl p-1 bg-gray-50 dark:bg-gray-850"
                                    />
                                    <input 
                                        type="text" 
                                        value={data.hex_code}
                                        onChange={(e) => setData('hex_code', e.target.value)}
                                        className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white font-mono uppercase"
                                        placeholder="#000000"
                                        maxLength="7"
                                        required
                                    />
                                </div>
                                <InputError message={errors.hex_code} className="mt-1" />
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
