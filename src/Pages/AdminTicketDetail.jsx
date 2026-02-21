// FirstTrack\src\pages\AdminTicketDetail.jsx (NEW FILE for Phase 3 Admin View)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTicketDetails } from '../services/ticketServices/userTicketService'; // Reusing user fetch for base details
import { adminFetchTicketMessages, adminSubmitReply } from '../services/ticketServices/adminTicketService';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const getStatusClasses = (status) => {
    // ... (same helper function as above)
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

export default function AdminTicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const messagesEndRef = useRef(null);

    const loadData = useCallback(async () => {
        try {
            const ticketData = await fetchTicketDetails(id);
            const messageData = await adminFetchTicketMessages(id);
            setTicket(ticketData);
            setCurrentStatus(ticketData.status);
            setMessages(messageData);
        } catch (error) {
            toast.error(error.message);
            navigate('/dashboard/admin/support'); 
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
            await adminSubmitReply(id, replyText, currentStatus);
            toast.success("Response sent & status updated.");
            setReplyText('');
            await loadData(); 
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f2937]"></div>
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-inter">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                {/* LEFT: Conversation */}
                <div className="flex-grow lg:w-2/3">
                    <button 
                        onClick={() => navigate('/dashboard/admin/support')} 
                        className="text-xs font-black text-gray-400 hover:text-[#1f2937] mb-6 flex items-center gap-2 uppercase tracking-widest transition-all"
                    >
                        ← Support Dashboard
                    </button>

                    <div className="bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col h-[750px]">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h1 className="text-xl font-black text-[#1f2937] tracking-tight uppercase">Admin Console</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Update Status</span>
                                <select
                                    className="bg-gray-100 border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    value={currentStatus}
                                    onChange={(e) => setCurrentStatus(e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-[#fbfcfd]">
                            {messages.map((msg) => (
                                <div key={msg.message_id} className={`flex ${msg.sent_by_admin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-5 rounded-[24px] shadow-sm text-[13px] leading-relaxed ${
                                        msg.sent_by_admin 
                                            ? 'bg-[#1f2937] text-white rounded-tr-none font-medium' 
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                        <div className="flex items-center justify-between mb-2 gap-6">
                                            <span className={`font-black text-[10px] uppercase tracking-widest ${msg.sent_by_admin ? 'text-gray-400' : 'text-blue-500'}`}>
                                                {msg.sent_by_admin ? 'Admin Response' : (msg.fullName || 'Merchant')}
                                            </span>
                                            <span className={`text-[10px] ${msg.sent_by_admin ? 'text-white/40' : 'text-gray-300'}`}>
                                                {new Date(msg.created_at.endsWith('Z') ? msg.created_at : msg.created_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="whitespace-pre-wrap">{msg.message_text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleReplySubmit} className="p-8 bg-white border-t border-gray-50">
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
                                    placeholder="Type official response..."
                                    className="w-full p-5 pr-20 bg-gray-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#1f2937] transition-all resize-none text-sm placeholder:text-gray-400 font-medium"
                                    rows="3"
                                    disabled={submitting}
                                />
                                <button 
                                    type="submit"
                                    disabled={submitting || !replyText.trim()}
                                    className="absolute right-4 bottom-4 bg-[#1f2937] text-white px-6 py-4 rounded-2xl shadow-xl hover:bg-black hover:scale-105 transition-all disabled:opacity-50 font-black text-[11px] uppercase tracking-widest"
                                >
                                    {submitting ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Meta */}
                <div className="lg:w-1/3 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Management Panel</h3>

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] text-gray-300 mb-1.5 font-black uppercase tracking-widest">Merchant Profile</p>
                                <p className="text-sm font-black text-[#1f2937]">{ticket.fullName}</p>
                                <p className="text-[11px] font-bold text-blue-500 mt-0.5">{ticket.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-300 mb-1.5 font-black uppercase tracking-widest">Category / Sub</p>
                                <p className="text-xs font-bold text-[#1f2937]">{ticket.category} {ticket.sub_category && `> ${ticket.sub_category}`}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-300 mb-2 font-black uppercase tracking-widest">Global Status</p>
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-tighter ${getStatusClasses(currentStatus)}`}>
                                    {currentStatus.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-[10px] text-gray-300 mb-3 font-black uppercase tracking-widest">Original Issue Brief</p>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap font-medium">"{ticket.description}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}