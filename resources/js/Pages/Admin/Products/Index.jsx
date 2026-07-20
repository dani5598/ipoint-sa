import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, ArrowRight, Layers } from 'lucide-react';

export default function Index({ products }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product? All of its variants will be permanently deleted.')) {
            destroy(route('admin.products.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Products" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Products</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage e-commerce products catalog, variations, and stocks.</p>
                    </div>
                    <Link 
                        href={route('admin.products.create')}
                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </Link>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
                    {products.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-xs">No products found in the catalog. Add some products to begin.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-855 bg-gray-50 dark:bg-gray-900/50 text-gray-400 uppercase tracking-wider">
                                        <th className="py-3.5 px-6 font-semibold">Image</th>
                                        <th className="py-3.5 px-6 font-semibold">Product Name</th>
                                        <th className="py-3.5 px-6 font-semibold">Category</th>
                                        <th className="py-3.5 px-6 font-semibold text-right">Base Price</th>
                                        <th className="py-3.5 px-6 font-semibold text-center">Variants</th>
                                        <th className="py-3.5 px-6 font-semibold text-center">Reviews</th>
                                        <th className="py-3.5 px-6 font-semibold text-center">Tags</th>
                                        <th className="py-3.5 px-6 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-850">
                                    {products.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                            <td className="py-4 px-6">
                                                <div className="w-12 h-12 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5">
                                                    <img src={prod.image_path} alt={prod.name} className="max-h-full max-w-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-gray-900 dark:text-white">{prod.name}</p>
                                                <p className="text-[10px] text-gray-450 mt-0.5 line-clamp-1 max-w-xs">{prod.slug}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                    {prod.category ? prod.category.name : 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-extrabold text-gray-900 dark:text-white">
                                                R {parseFloat(prod.base_price).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-transparent">
                                                    <Layers className="w-3.5 h-3.5 mr-0.5" />
                                                    <span>{prod.variants_count}</span>
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-305 font-semibold border border-amber-100 dark:border-transparent">
                                                    <span>⭐ {prod.reviews_count}</span>
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex flex-wrap gap-1 justify-center max-w-[150px] mx-auto">
                                                    {prod.is_featured && (
                                                        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px] font-bold uppercase">Featured</span>
                                                    )}
                                                    {prod.is_new && (
                                                        <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px] font-bold uppercase">New</span>
                                                    )}
                                                    {prod.is_on_promo && (
                                                        <span className="px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[9px] font-bold uppercase">Promo</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center space-x-2.5">
                                                    <Link 
                                                        href={route('admin.products.edit', prod.id)}
                                                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                                        title="Edit Product"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(prod.id)}
                                                        className="p-1 rounded-full text-gray-400 hover:text-[#E30000]"
                                                        title="Delete Product"
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
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
