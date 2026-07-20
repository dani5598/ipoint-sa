import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Index({ attributeGroups }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this attribute group?')) {
            router.delete(route('admin.attributes.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Attributes" />

            <div className="space-y-6 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Attributes</h1>
                        <p className="text-xs text-gray-400 mt-1">Manage product attribute groups and their values.</p>
                    </div>
                    <Link
                        href={route('admin.attributes.create')}
                        className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Attribute</span>
                    </Link>
                </div>

                {/* Attributes Table */}
                <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-850 bg-gray-50 dark:bg-gray-900/50 text-gray-400 uppercase tracking-wider">
                                    <th className="py-3 px-6 font-semibold">Name</th>
                                    <th className="py-3 px-6 font-semibold">Values</th>
                                    <th className="py-3 px-6 font-semibold">Sort Order</th>
                                    <th className="py-3 px-6 font-semibold">Active</th>
                                    <th className="py-3 px-6 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-855">
                                {attributeGroups.map((group) => (
                                    <tr key={group.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                        <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">{group.name}</td>
                                        <td className="py-4 px-6 text-gray-500">
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-semibold">
                                                {group.values_count}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">{group.sort_order}</td>
                                        <td className="py-4 px-6">
                                            {group.is_active ? (
                                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/35 text-green-700 dark:text-green-300 text-[10px] font-semibold">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/35 text-red-700 dark:text-red-300 text-[10px] font-semibold">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center space-x-2.5">
                                                <Link
                                                    href={route('admin.attributes.edit', group.id)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                                    title="Edit Attribute"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(group.id)}
                                                    className="p-1 rounded-full text-gray-400 hover:text-[#E30000]"
                                                    title="Delete Attribute"
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
        </AdminLayout>
    );
}
