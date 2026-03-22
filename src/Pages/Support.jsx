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
        <div className="p-6 md:p-12 max-w-6xl mx-auto font-inter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#1f2937] tracking-tight">Support Tickets</h1>
                    <p className="text-gray-500 mt-2">Track and manage your inquiries with our logistics team.</p>
                </div>
                <button 
                    onClick={handleRaiseNewTicket}
                    className="bg-[#22c55e] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-green-200 hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95"
                >
                    + New Ticket
                </button>
            </div>

            {/* Metric Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total Tickets</p>
                    <p className="text-3xl font-black text-[#1f2937]">{tickets.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Open Tickets</p>
                    <p className="text-3xl font-black text-blue-500">{tickets.filter(t => t.status === 'OPEN').length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Resolved</p>
                    <p className="text-3xl font-black text-[#22c55e]">{tickets.filter(t => t.status === 'RESOLVED').length}</p>
                </div>
            </div>

            <div className="grid gap-5">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.ticket_id} 
                        className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#22c55e]/30 transition-all cursor-pointer flex justify-between items-center"
                        onClick={() => handleViewTicket(ticket.ticket_id)}
                    >
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#{ticket.ticket_id}</span>
                                <h2 className="text-xl font-bold text-[#1f2937]">{ticket.category}</h2>
                                <p className="text-gray-400 text-sm mt-0.5 truncate max-w-md">{ticket.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <span className={`px-4 py-1.5 text-[11px] font-black rounded-full uppercase tracking-tighter ${getStatusClasses(ticket.status)}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                            <p className="text-[11px] text-gray-400 font-medium">
                                {new Date(ticket.created_at.endsWith('Z') ? ticket.created_at : ticket.created_at + 'Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
