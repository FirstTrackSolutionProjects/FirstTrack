// FirstTrack\src\pages\AdminAnalytics.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify'; 
import { fetchTicketAnalytics } from '../services/ticketServices/adminTicketService';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Card component for displaying metrics
const MetricCard = ({ title, value, unit = '' }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-[#075e54]">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-3xl font-bold text-gray-900">
            {value} {unit}
        </p>
    </div>
);

// Helper for status bar colors
const STATUS_COLORS = {
    'OPEN': 'bg-yellow-500',
    'IN_PROGRESS': 'bg-blue-500',
    'RESOLVED': 'bg-green-500',
    'CLOSED': 'bg-gray-500',
    'Other': 'bg-red-500' // For miscellaneous categories
};

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTicketAnalytics();
            setAnalytics(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto font-inter bg-gray-50 min-h-screen">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-[#1f2937] tracking-tight uppercase">Support Intelligence</h1>
                <p className="text-gray-400 text-sm mt-1">Real-time performance metrics and ticket distributions.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Requests</p>
                    <p className="text-4xl font-black text-[#1f2937]">{analytics.totalTickets}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Active (Open)</p>
                    <p className="text-4xl font-black text-blue-500">{analytics.ticketsByStatus.find(s => s.status === 'OPEN')?.count || 0}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Resolved</p>
                    <p className="text-4xl font-black text-[#22c55e]">{analytics.ticketsByStatus.find(s => s.status === 'RESOLVED')?.count || 0}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Success Rate</p>
                    <p className="text-4xl font-black text-gray-800">{analytics.resolutionRate}<span className="text-xl">%</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Status Distribution</h2>
                    <div className="flex w-full h-12 rounded-2xl overflow-hidden mb-6">
                        {analytics.ticketsByStatus.map((item) => (
                            <div
                                key={item.status}
                                className={`${STATUS_COLORS[item.status]} transition-all duration-700 flex items-center justify-center text-white text-[10px] font-black`}
                                style={{ width: `${(item.count / analytics.totalTickets) * 100}%` }}
                                title={item.status}
                            >
                                {item.count > 0 && item.count}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {STATUS_OPTIONS.map(status => (
                            <div key={status} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
                                <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`}></span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{status.replace('_', ' ')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Volume */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Top Issue Categories</h2>
                    <div className="space-y-5">
                        {analytics.ticketsByCategory.map((item, index) => (
                            <div key={item.category}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-black text-[#1f2937] uppercase tracking-widest">{item.category}</span>
                                    <span className="text-[10px] font-black text-gray-400">{item.count}</span>
                                </div>
                                <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-red-500' : 'bg-gray-300'}`}
                                        style={{ width: `${(item.count / analytics.totalTickets) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}