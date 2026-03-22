// FirstTrack\src\pages\Dashboard\AdminSupport.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { fetchAllTickets, updateTicketStatus } from '../services/ticketServices/adminTicketService';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

// Helper function (same as Phase 1 components)
const getStatusClasses = (status) => {
    switch (status) {
        case 'OPEN':
            return 'bg-yellow-100 text-yellow-800';
        case 'IN_PROGRESS':
            return 'bg-blue-100 text-blue-800';
        case 'RESOLVED':
            return 'bg-green-100 text-green-800';
        case 'CLOSED':
            return 'bg-gray-200 text-gray-700';
        default:
            return 'bg-gray-500 text-white';
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
            toast.error(error.message);
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
            toast.success(`Ticket #${ticketId} status updated to ${newStatus}.`);
            setTickets(prev => prev.map(t => 
                t.ticket_id === ticketId ? { ...t, status: newStatus } : t
            ));
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto font-inter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#1f2937] tracking-tight uppercase">Support Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Review and manage support requests from all merchants.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">System Total</span>
                    <span className="text-2xl font-black text-[#1f2937]">{tickets.length} <span className="text-sm font-medium text-gray-400">Tickets</span></span>
                </div>
            </div>

            <div className="grid gap-4">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.ticket_id} 
                        className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#22c55e]/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                        onClick={() => handleViewTicket(ticket.ticket_id)}
                    >
                        {/* Status Icon */}
                        <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${
                            ticket.status === 'OPEN' ? 'bg-yellow-50 text-yellow-600' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-500' :
                            ticket.status === 'RESOLVED' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-400'
                        }`}>
                            <span className="font-black text-sm">#{ticket.ticket_id}</span>
                        </div>

                        {/* Main Content */}
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-lg font-bold text-[#1f2937] truncate">{ticket.category}</h2>
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${getStatusClasses(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-bold text-[#1f2937] bg-gray-100 px-2 py-0.5 rounded-md">{ticket.fullName}</span>
                                <span>•</span>
                                <p className="truncate italic">"{ticket.description}"</p>
                            </div>
                        </div>

                        {/* Controls & Date */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0" onClick={e => e.stopPropagation()}>
                            <p className="text-[11px] text-gray-300 font-bold uppercase tracking-widest">
                                {new Date(ticket.created_at.endsWith('Z') ? ticket.created_at : ticket.created_at + 'Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <select
                                className="bg-gray-50 border-none text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#22c55e] transition-all cursor-pointer outline-none"
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(ticket.ticket_id, e.target.value)}
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
