import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchTicketAnalytics } from '../services/ticketServices/adminTicketService';
import { FaTicketAlt, FaChartPie, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa'; // Added icons for better UX

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Helper for status bar colors - adjusted to use a slightly more vibrant palette if possible, or keep consistent.
const STATUS_COLORS = {
    'OPEN': 'bg-yellow-400', // Slightly brighter yellow
    'IN_PROGRESS': 'bg-blue-500',
    'RESOLVED': 'bg-green-500',
    'CLOSED': 'bg-gray-400', // Softer gray
    'Other': 'bg-red-400'
};

// Reusable card styles for consistency
const CARD_STYLES = "bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl";
const SECTION_TITLE_STYLES = "text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b pb-2 border-gray-100";

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTicketAnalytics();
            setAnalytics(data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch analytics data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 p-6 rounded-lg shadow-inner">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading analytics...</p>
                    <div className="w-48 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (!analytics) return (
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 p-6 rounded-lg shadow-inner">
            <p className="text-gray-500 text-lg">No analytics data available.</p>
        </div>
    );

    const totalTickets = analytics.totalTickets || 1; // Prevent division by zero

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto font-inter bg-gray-50 min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-[#1f2937] tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 text-md mt-2">Comprehensive insights into your support operations.</p>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className={`${CARD_STYLES} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tickets</p>
                        <FaTicketAlt className="text-blue-400 text-xl" />
                    </div>
                    <p className="text-5xl font-extrabold text-[#1f2937]">{analytics.totalTickets}</p>
                </div>
                <div className={`${CARD_STYLES} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active (Open)</p>
                        <FaHourglassHalf className="text-yellow-500 text-xl" />
                    </div>
                    <p className="text-5xl font-extrabold text-yellow-600">{analytics.ticketsByStatus.find(s => s.status === 'OPEN')?.count || 0}</p>
                </div>
                <div className={`${CARD_STYLES} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolved</p>
                        <FaCheckCircle className="text-green-500 text-xl" />
                    </div>
                    <p className="text-5xl font-extrabold text-green-600">{analytics.ticketsByStatus.find(s => s.status === 'RESOLVED')?.count || 0}</p>
                </div>
                <div className={`${CARD_STYLES} flex flex-col justify-between`}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolution Rate</p>
                        <FaChartPie className="text-purple-500 text-xl" />
                    </div>
                    <p className="text-5xl font-extrabold text-gray-800">{analytics.resolutionRate}<span className="text-2xl ml-1">%</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Distribution */}
                <div className={CARD_STYLES}>
                    <h2 className={SECTION_TITLE_STYLES}>Status Distribution</h2>
                    <div className="flex w-full h-14 rounded-xl overflow-hidden mb-6 shadow-inner"> {/* Increased height, softer rounding, added inner shadow */}
                        {analytics.ticketsByStatus.map((item, index) => (
                            <div
                                key={item.status}
                                className={`${STATUS_COLORS[item.status]} transition-all duration-700 ease-out flex items-center justify-center text-white text-sm font-bold whitespace-nowrap`}
                                style={{ width: `${(item.count / totalTickets) * 100}%` }}
                                title={`${item.status.replace('_', ' ')}: ${item.count} tickets`}
                            >
                                {item.count > 0 && (
                                    <span className="px-2">{item.count}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Adjusted to be responsive */}
                        {STATUS_OPTIONS.map(status => (
                            <div key={status} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100/70 hover:bg-gray-100 transition-colors duration-200"> {/* Softer rounding, hover effect */}
                                <span className={`w-3.5 h-3.5 rounded-full ${STATUS_COLORS[status]} flex-shrink-0`}></span> {/* Slightly larger dot */}
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{status.replace('_', ' ')}</span> {/* Adjusted text style */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Volume */}
                <div className={CARD_STYLES}>
                    <h2 className={SECTION_TITLE_STYLES}>Top Issue Categories</h2>
                    <div className="space-y-6"> {/* Increased space */}
                        {analytics.ticketsByCategory.map((item, index) => (
                            <div key={item.category} className="group"> {/* Added group for potential hover effects */}
                                <div className="flex justify-between items-center mb-2"> {/* Increased margin */}
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">{item.category}</span> {/* Adjusted text style, hover effect */}
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors duration-200">{item.count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden"> {/* Slightly thicker bar, softer background */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0 ? 'bg-indigo-500' : 'bg-blue-400'}`} // Changed dominant color to indigo/blue for variety
                                        style={{ width: `${(item.count / totalTickets) * 100}%` }}
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