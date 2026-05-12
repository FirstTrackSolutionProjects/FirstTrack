import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have useAuth hook setup
import { MessageCircle, X } from 'lucide-react'; 
import TicketChatbot from './TicketChatbot'; // Import the new chatbot component

export default function FloatingAssistant() {
    const { isAuthenticated } = useAuth(); 
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpenChat = () => {
            setIsOpen(true);
        };

        window.addEventListener('OPEN_SUPPORT_CHAT', handleOpenChat);

        return () => {
            window.removeEventListener('OPEN_SUPPORT_CHAT', handleOpenChat);
        };
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);
    const handleClose = () => setIsOpen(false);

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[1000]"> 
            {/* Chat Modal Window */}
            {isOpen && (
                <div 
                    className="bg-white shadow-2xl rounded-3xl overflow-hidden 
                                w-[calc(100vw-2rem)] h-[480px] md:w-96 md:h-[600px] 
                                mb-4 border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-bottom-right"
                >
                    {/* Header */}
                    <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center shrink-0">
                        <div>
                            <p className="font-bold text-sm tracking-tight">Support Assistant</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Online</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chatbot Content */}
                    <div className="grow">
                        <TicketChatbot onClose={handleClose} />
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 rounded-2xl shadow-xl text-white transition-all duration-300 flex items-center justify-center 
                            ${isOpen ? 'bg-slate-800 rotate-90 scale-90' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'}`}
                aria-label={isOpen ? "Close Support Chat" : "Open Support Chat"}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
}
