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
        <div className="fixed bottom-6 right-6 z-[1000] font-inter"> 
            {/* Chat Modal Window */}
            {isOpen && (
                <div 
                    className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden 
                                w-[320px] h-[500px] md:w-[400px] md:h-[600px] 
                                mb-5 border border-gray-100 flex flex-col animate-in slide-in-from-bottom-5 duration-300"
                >
                    {/* Header: Deep Charcoal */}
                    <div className="bg-[#1f2937] text-white px-6 py-5 flex justify-between items-center shrink-0">
                        <div>
                            <p className="font-bold text-base tracking-tight">First Track Support</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Always on track</p>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chatbot Content */}
                    <div className="grow overflow-hidden bg-[#f8fafc]">
                        <TicketChatbot onClose={handleClose} />
                    </div>
                </div>
            )}

            {/* Floating Button: Brand Green */}
            <button
                onClick={toggleOpen}
                className={`w-16 h-16 rounded-2xl shadow-xl text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95
                            ${isOpen ? 'bg-red-500 rotate-90' : 'bg-[#22c55e]'}`}
                aria-label={isOpen ? "Close Support Chat" : "Open Support Chat"}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" className="text-white" />}
            </button>
        </div>
    );
}
