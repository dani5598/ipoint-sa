import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Index({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        description: '',
        image_path: '',
        image_file: null,
        nav_order: 0
    });

    const openAddModal = () => {
        reset();
        setEditCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditCategory(cat);
        setData({
            name: cat.name,
            description: cat.description || '',
            image_path: cat.image_path || '',
            image_file: null,
            nav_order: cat.nav_order || 0
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditCategory(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Laravel requires POST method with _method=PUT overlayed in request body to parse file uploads via PUT
        if (editCategory) {
            post(route('admin.categories.update', editCategory.id), {
                data: {
                    ...data,
                    _method: 'PUT'
                },
                onSuccess: () => closeModal()
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(route('admin.categories.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Categories" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Categories</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage e-commerce product categories.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Categories Table */}
                <div className="bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-900/50 text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-6 font-semibold">Image</th>
                                    <th className="py-3 px-6 font-semibold">Category</th>
                                    <th className="py-3 px-6 font-semibold">Slug</th>
                                    <th className="py-3 px-6 font-semibold text-center">Nav Order</th>
                                    <th className="py-3 px-6 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-855">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                        <td className="py-4 px-6">
                                            <div className="w-10 h-10 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                                                <img src={cat.image_path} alt={cat.name} className="max-h-full max-w-full object-contain" />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-gray-900 dark:text-white">{cat.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-sm">{cat.description || 'No description provided'}</p>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-[10px] text-gray-500">{cat.slug}</td>
                                        <td className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-gray-200">{cat.nav_order}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center space-x-2.5">
                                                <button 
                                                    onClick={() => openEditModal(cat)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-gray-650 dark:hover:text-white"
                                                    title="Edit Category"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-[#E30000]"
                                                    title="Delete Category"
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
                    
                    <div className="w-full max-w-md bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden font-sans">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {editCategory ? 'Edit Category' : 'Create Category'}
                            </h3>
                            <button onClick={closeModal} className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Category Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="e.g. AirPods"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Description</label>
                                <textarea 
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="2"
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-855 text-[#1d1d1f] dark:text-white"
                                    placeholder="Brief summary describing the category."
                                ></textarea>
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Category Image (Upload file or paste URL)</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={data.image_path}
                                        onChange={(e) => setData('image_path', e.target.value)}
                                        className="flex-1 text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                        placeholder="Paste image URL here..."
                                    />
                                    <label className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold px-4 rounded-xl flex items-center justify-center cursor-pointer border border-gray-300 dark:border-gray-700 transition-colors">
                                        <span>Choose File</span>
                                        <input 
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                try {
                                                    const res = await fetch(route('admin.products.upload'), {
                                                        method: 'POST',
                                                        headers: {
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                                                        },
                                                        body: formData
                                                    });
                                                    const resData = await res.json();
                                                    if (resData.url) {
                                                        setData('image_path', resData.url);
                                                    } else {
                                                        alert(resData.error || 'Upload failed');
                                                    }
                                                } catch (err) {
                                                    alert('Image upload failed');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <InputError message={errors.image_path} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Nav Order</label>
                                <input 
                                    type="number" 
                                    value={data.nav_order}
                                    onChange={(e) => setData('nav_order', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    min="0"
                                    required
                                />
                                <InputError message={errors.nav_order} className="mt-1" />
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
