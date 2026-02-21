// FirstTrack\src\pages\Support.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserTickets } from '../services/ticketServices/userTicketService';
import { toast } from 'react-toastify'; 

// Helper function for styling ticket status
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

export default function UserSupportPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- NEW HANDLER ---
    const handleRaiseNewTicket = () => {
        // Dispatch event to open the floating chat window
        window.dispatchEvent(new CustomEvent('OPEN_SUPPORT_CHAT'));
    };
    // --- END NEW HANDLER ---

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await fetchUserTickets();
                setTickets(data);
            } catch (error) {
                toast.error(error.message);
                // Redirect if unauthorized or other critical error
                if (error.message.includes("log in")) { 
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        loadTickets();
    }, [navigate]);

    const handleViewTicket = (ticketId) => {
        // Since we removed the top-level route, this navigation is now relative to /dashboard, which is correct.
        navigate(`/dashboard/support/${ticketId}`);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading support tickets...</div>;
    }
    
    // Fallback if no tickets exist
    if (tickets.length === 0) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Your Support Tickets</h2>
                <p className="text-gray-600">You have no active or historical tickets.</p>
                <button 
                    onClick={handleRaiseNewTicket} // <-- FIXED
                    className="mt-4 bg-[#075e54] text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                    Raise a New Ticket
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Center</h1>
                    <p className="text-gray-500 mt-1">Manage and track your assistance requests.</p>
                </div>
                <button 
                    onClick={handleRaiseNewTicket}
                    className="bg-[#075e54] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    + Raise New Ticket
                </button>
            </div>

            {/* Metric Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-800">{tickets.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Open Tickets</p>
                    <p className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'OPEN').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'RESOLVED').length}</p>
                </div>
            </div>

            <div className="grid gap-4">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.ticket_id} 
                        className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#075e54]/30 transition-all cursor-pointer flex justify-between items-center"
                        onClick={() => handleViewTicket(ticket.ticket_id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#075e54] group-hover:bg-[#075e54] group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase">#{ticket.ticket_id}</span>
                                    <h2 className="text-lg font-semibold text-gray-800">{ticket.category}</h2>
                                </div>
                                <p className="text-gray-500 text-sm max-w-md truncate">{ticket.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-1.5 text-[11px] font-bold rounded-full uppercase tracking-wider ${getStatusClasses(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                            <p className="text-[11px] text-gray-400 font-medium">
                                Created {new Date(ticket.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
