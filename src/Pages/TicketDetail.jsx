// FirstTrack\src\pages\TicketDetail.jsx (MODIFIED for Phase 3)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { fetchTicketDetails, fetchTicketMessages, submitUserReply } from '../services/ticketServices/userTicketService';
import { toast } from 'react-toastify';

// Helper function (same as in Support.jsx)
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

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const messagesEndRef = useRef(null);

    const loadData = useCallback(async () => {
        try {
            const ticketData = await fetchTicketDetails(id);
            const messageData = await fetchTicketMessages(id);
            setTicket(ticketData);
            setMessages(messageData);
        } catch (error) {
            toast.error(error.message);
            navigate('/support'); 
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        // Scroll to bottom when messages update, using block: "nearest" to prevent page-level scrolling
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages]);


    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || submitting) return;
        
        setSubmitting(true);
        try {
            await submitUserReply(id, replyText);
            toast.success("Reply sent. Status updated to OPEN.");
            setReplyText('');
            // Reload all data to get the new message and updated status
            await loadData(); 
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading ticket #{id} details...</div>;
    }

    if (!ticket) {
        return <div className="p-8 text-center text-red-500">Ticket not found.</div>;
    }


    return (
        <div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen font-inter">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* LEFT: Conversation Column */}
                <div className="flex-grow lg:w-2/3">
                    <button 
                        onClick={() => navigate('/dashboard/support')} 
                        className="text-sm font-bold text-gray-400 hover:text-[#1f2937] mb-6 flex items-center gap-2 uppercase tracking-widest transition-colors"
                    >
                        ← Back to Support Dashboard
                    </button>

                    <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-[700px]">
                        <div className="p-8 border-b border-gray-50 bg-white">
                            <h1 className="text-xl font-black text-[#1f2937] tracking-tight">Conversation History</h1>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-[#fbfcfd]">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <p className="text-sm font-medium">No messages yet.</p>
                                    <p className="text-xs text-center">Your conversation with support will appear here.</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.message_id} className={`flex ${msg.sent_by_admin ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[85%] p-5 rounded-[24px] shadow-sm text-[13px] leading-relaxed ${
                                            msg.sent_by_admin 
                                                ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
                                                : 'bg-[#22c55e] text-white rounded-tr-none font-medium'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2 gap-6">
                                                <span className={`font-black text-[10px] uppercase tracking-widest ${msg.sent_by_admin ? 'text-gray-400' : 'text-white/80'}`}>
                                                    {msg.sent_by_admin ? (msg.fullName || 'Support Agent') : 'You'}
                                                </span>
                                                <span className={`text-[10px] ${msg.sent_by_admin ? 'text-gray-300' : 'text-white/60'}`}>
                                                    {new Date(msg.created_at.endsWith('Z') ? msg.created_at : msg.created_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="whitespace-pre-wrap">{msg.message_text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleReplySubmit} className="p-8 bg-white border-t border-gray-100">
                            <div className="relative">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReplySubmit(e);
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="w-full p-5 pr-20 bg-gray-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#22c55e] transition-all resize-none text-sm placeholder:text-gray-400"
                                    rows="3"
                                    disabled={submitting}
                                />
                                <button 
                                    type="submit"
                                    disabled={submitting || !replyText.trim()}
                                    className="absolute right-4 bottom-4 bg-[#1f2937] text-white p-4 rounded-2xl shadow-lg shadow-gray-200 hover:bg-[#22c55e] hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Ticket Meta Column */}
                <div className="lg:w-1/3 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Ticket Information</h3>

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] text-gray-300 mb-1.5 font-black uppercase tracking-widest">Ticket ID</p>
                                <p className="text-lg font-black text-[#1f2937]">#{ticket.ticket_id}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-300 mb-2 font-black uppercase tracking-widest">Status</p>
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-tighter ${getStatusClasses(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-300 mb-1.5 font-black uppercase tracking-widest">Category</p>
                                <p className="text-sm font-bold text-[#1f2937]">{ticket.category}</p>
                            </div>
                            {ticket.order_id && (
                                <div>
                                    <p className="text-[10px] text-gray-300 mb-1.5 font-black uppercase tracking-widest">Order ID</p>
                                    <p className="text-sm font-bold text-[#1f2937]">#{ticket.order_id}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] text-gray-300 mb-1.5 font-black uppercase tracking-widest">Created On</p>
                                <p className="text-sm font-bold text-[#1f2937]">{new Date(ticket.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-[10px] text-gray-300 mb-3 font-black uppercase tracking-widest">Initial Issue</p>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">{ticket.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}