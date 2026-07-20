import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Form({ attribute, isEdit }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: attribute?.name || '',
        sort_order: attribute?.sort_order ?? 0,
        is_active: attribute ? !!attribute.is_active : true,
        values: attribute?.values?.length
            ? attribute.values.map(v => ({ id: v.id, value: v.value, sort_order: v.sort_order ?? 0 }))
            : [{ id: null, value: '', sort_order: 0 }]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.attributes.update', attribute.id));
        } else {
            post(route('admin.attributes.store'));
        }
    };

    const addValueRow = () => {
        setData('values', [
            ...data.values,
            { id: null, value: '', sort_order: 0 }
        ]);
    };

    const removeValueRow = (index) => {
        if (data.values.length === 1) {
            alert('At least one attribute value is required.');
            return;
        }
        setData('values', data.values.filter((_, i) => i !== index));
    };

    const handleValueChange = (index, field, value) => {
        const updated = data.values.map((v, i) => {
            if (i === index) {
                return { ...v, [field]: value };
            }
            return v;
        });
        setData('values', updated);
    };

    return (
        <AdminLayout>
            <Head title={isEdit ? `Edit Attribute — ${attribute.name}` : 'Create Attribute'} />

            <div className="space-y-6 font-sans">
                {/* Back Link */}
                <Link 
                    href="/admin/attributes"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Attributes</span>
                </Link>

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {isEdit ? `Modify ${attribute.name}` : 'Create Attribute Group'}
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">Configure attribute group details and values.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Attribute Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Group Details Card */}
                        <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-100 dark:border-gray-850">
                                Group Details
                            </h3>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Group Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                    placeholder="e.g. Material, Connectivity, Storage"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Sort Order</label>
                                    <input 
                                        type="number" 
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full text-xs border border-gray-200 dark:border-gray-800 rounded-xl px-3.5 py-2.5 bg-gray-50 dark:bg-gray-850 text-[#1d1d1f] dark:text-white"
                                        placeholder="0"
                                    />
                                    <InputError message={errors.sort_order} className="mt-1" />
                                </div>

                                <div className="flex items-center pt-5">
                                    <input 
                                        type="checkbox" 
                                        id="is_active" 
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 dark:border-gray-800 text-[#0066CC] focus:ring-[#0066CC]"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Active</label>
                                    <InputError message={errors.is_active} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Values Section */}
                        <div className="bg-white dark:bg-[#1D1D1F] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-850">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    Attribute Values
                                </h3>
                                <button 
                                    type="button"
                                    onClick={addValueRow}
                                    className="bg-[#0066CC] hover:bg-[#0077ED] text-white text-[10px] font-bold uppercase px-3.5 py-1.5 rounded-full flex items-center space-x-1 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Value</span>
                                </button>
                            </div>

                            <InputError message={errors.values} className="mt-1" />

                            {/* Dynamic values listing */}
                            <div className="space-y-3">
                                {data.values.map((v, index) => (
                                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-850 rounded-2xl">
                                        <div className="sm:col-span-7">
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Value</label>
                                            <input 
                                                type="text" 
                                                value={v.value}
                                                onChange={(e) => handleValueChange(index, 'value', e.target.value)}
                                                placeholder="e.g. Leather, Bluetooth 5.0, 256GB"
                                                className="w-full text-[11px] border border-gray-200 dark:border-gray-750 rounded-lg p-1.5 bg-white dark:bg-gray-800 text-[#1d1d1f] dark:text-white focus:ring-0"
                                                required
                                            />
                                            <InputError message={errors[`values.${index}.value`]} className="mt-0.5" />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Sort Order</label>
                                            <input 
                                                type="number" 
                                                value={v.sort_order}
                                                onChange={(e) => handleValueChange(index, 'sort_order', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                                className="w-full text-[11px] border border-gray-200 dark:border-gray-750 rounded-lg p-1.5 bg-white dark:bg-gray-800 text-[#1d1d1f] dark:text-white focus:ring-0"
                                            />
                                            <InputError message={errors[`values.${index}.sort_order`]} className="mt-0.5" />
                                        </div>

                                        <div className="sm:col-span-2 flex items-end justify-center pb-1">
                                            <button 
                                                type="button" 
                                                onClick={() => removeValueRow(index)}
                                                className="p-1 rounded-full text-gray-400 hover:text-[#E30000]"
                                                title="Remove value"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Save Actions */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1D1D1F] border border-gray-150 dark:border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#0066CC] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01] shadow-md"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isEdit ? 'Save Changes' : 'Create Attribute Group'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
