import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FloatingWidgets = ({ isMusicPlaying, onToggleMusic }) => {
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('Halo, saya ingin mengucapkan selamat untuk pernikahan Ninis & Ari! 💐');
        const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp yang sebenarnya
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
            {/* WhatsApp Widget */}
            <button
                onClick={handleWhatsAppClick}
                onMouseEnter={() => setIsWhatsAppOpen(true)}
                onMouseLeave={() => setIsWhatsAppOpen(false)}
                className="group relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
                aria-label="WhatsApp"
            >
                <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>

                {/* Tooltip */}
                {isWhatsAppOpen && (
                    <div className="absolute right-full mr-4 px-4 py-2 bg-[#25D366] text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
                        Hubungi Kami
                    </div>
                )}
            </button>

            {/* Music Control Widget */}
            <button
                onClick={onToggleMusic}
                className="relative w-14 h-14 md:w-16 md:h-16 bg-[#7d1e1e] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                aria-label="Music Control"
            >
                {isMusicPlaying ? (
                    <svg
                        className="w-7 h-7 md:w-8 md:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-7 h-7 md:w-8 md:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                    </svg>
                )}

                {/* Music Playing Indicator */}
                {isMusicPlaying && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
            </button>

            {/* Gift/Amplop Widget */}
            <button
                onClick={() => {
                    // Scroll to gift section or open modal
                    const giftSection = document.getElementById('gift-section');
                    if (giftSection) {
                        giftSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                className="relative w-14 h-14 md:w-16 md:h-16 bg-[#e8b4a8] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                aria-label="Wedding Gift"
            >
                <span className="text-2xl md:text-3xl">🎁</span>
            </button>

            {/* Scroll to Top Widget */}
            <button
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-[#7d1e1e] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                aria-label="Scroll to Top"
            >
                <svg
                    className="w-6 h-6 md:w-7 md:h-7 text-[#7d1e1e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>
        </div>
    );
};

FloatingWidgets.propTypes = {
    isMusicPlaying: PropTypes.bool.isRequired,
    onToggleMusic: PropTypes.func.isRequired,
};

export default FloatingWidgets;
