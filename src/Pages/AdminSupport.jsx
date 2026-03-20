// FirstTrack\src\pages\Dashboard\AdminSupport.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { fetchAllTickets, updateTicketStatus } from '../services/ticketServices/adminTicketService';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Helper function for consistent status badge styling
const getStatusClasses = (status) => {
    switch (status) {
        case 'OPEN':
            return 'bg-yellow-50 text-yellow-700 ring-yellow-200';
        case 'IN_PROGRESS':
            return 'bg-blue-50 text-blue-700 ring-blue-200';
        case 'RESOLVED':
            return 'bg-green-50 text-green-700 ring-green-200';
        case 'CLOSED':
            return 'bg-gray-50 text-gray-600 ring-gray-200';
        default:
            return 'bg-gray-100 text-gray-500 ring-gray-200';
    }
};

export default function AdminSupport() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTickets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllTickets();
            setTickets(data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch tickets.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const handleViewTicket = (ticketId) => {
        navigate(`/dashboard/admin/support/${ticketId}`);
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        if (newStatus === 'DEFAULT') return;

        try {
            await updateTicketStatus(ticketId, newStatus);
            toast.success(`Ticket #${ticketId} status updated to ${newStatus.replace('_', ' ')}.`);
            setTickets(prev => prev.map(t => 
                t.ticket_id === ticketId ? { ...t, status: newStatus } : t
            ));
        } catch (error) {
            toast.error(error.message || "Failed to update ticket status.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 md:px-8 md:py-12 max-w-7xl mx-auto font-inter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Support Management</h1>
                    <p className="text-gray-500 text-base mt-2">Review and manage support requests from all merchants.</p>
                </div>
                <div className="bg-white px-7 py-4 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">System Total</span>
                    <span className="text-3xl font-extrabold text-gray-900">{tickets.length} <span className="text-base font-medium text-gray-500">Tickets</span></span>
                </div>
            </div>

            <div className="grid gap-6 md:gap-8">
                {tickets.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-lg">
                        No support tickets found.
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div 
                            key={ticket.ticket_id} 
                            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-400 transition-all duration-300 ease-in-out cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                            onClick={() => handleViewTicket(ticket.ticket_id)}
                        >
                            {/* Status Indicator */}
                            <div className={`h-16 w-16 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out 
                                ${ticket.status === 'OPEN' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' :
                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                                ticket.status === 'RESOLVED' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                            }`}>
                                <span className="font-extrabold text-base">#{ticket.ticket_id}</span>
                            </div>

                            {/* Main Content */}
                            <div className="flex-grow min-w-0">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                                    <h2 className="text-xl font-extrabold text-gray-900 truncate max-w-full md:max-w-[70%]">{ticket.category}</h2>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ring-1 ${getStatusClasses(ticket.status)}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-600 mt-1">
                                    <span className="font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full">{ticket.fullName}</span>
                                    <span className="text-gray-400">•</span>
                                    <p className="truncate italic text-gray-500 flex-grow">"{ticket.description}"</p>
                                </div>
                            </div>

                            {/* Controls & Date */}
                            <div className="flex flex-col md:items-end justify-between gap-4 shrink-0 mt-4 md:mt-0" onClick={e => e.stopPropagation()}>
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                                    {new Date(ticket.created_at.endsWith('Z') ? ticket.created_at : ticket.created_at + 'Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                                <select
                                    className="block w-full md:w-auto bg-gray-50 border border-gray-200 text-sm font-medium uppercase tracking-wide text-gray-700 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 ease-in-out cursor-pointer outline-none"
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.ticket_id, e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
