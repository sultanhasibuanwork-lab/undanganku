import React from 'react';
import PropTypes from 'prop-types';

const CoverPage = ({ onOpenInvitation, isMusicPlaying, onToggleMusic }) => {
    // Get nama tamu dari URL parameter
    const [guestName, setGuestName] = React.useState('Bapak/Ibu/Saudara/i');

    // Detect mobile screen
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    React.useEffect(() => {
        // Parse URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const toParam = urlParams.get('to');

        if (toParam) {
            setGuestName(decodeURIComponent(toParam));
        }

        // Handle resize for responsive
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set body overflow hidden saat component mount
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>
            {/* Card dengan Background Image */}
            <div style={{
                maxWidth: '500px',
                width: '100%',
                height: '100vh',
                backgroundImage: 'url(/background-cover.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                {/* Container Bingkai - Responsive */}
                <div style={{
                    position: 'relative',
                    width: isMobile ? '92%' : '85%',
                    maxWidth: isMobile ? '340px' : '360px',
                    height: isMobile ? '88vh' : '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'zoomIn 1s ease-out',
                }}>

                    {/* Background Putih */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#ffffff',
                        opacity: 0.95,
                        borderRadius: isMobile ? '25px' : '30px',
                    }}></div>

                    {/* Border Gold Outer */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        border: isMobile ? '6px solid #d97706' : '8px solid #d97706',
                        borderRadius: isMobile ? '25px' : '30px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}></div>

                    {/* Border Gold Inner */}
                    <div style={{
                        position: 'absolute',
                        top: isMobile ? '12px' : '16px',
                        left: isMobile ? '12px' : '16px',
                        right: isMobile ? '12px' : '16px',
                        bottom: isMobile ? '12px' : '16px',
                        border: '2px solid rgba(217, 119, 6, 0.5)',
                        borderRadius: '20px',
                    }}></div>

                    {/* Ornamen Sudut Kiri Atas */}
                    <div style={{
                        position: 'absolute',
                        top: isMobile ? '12px' : '16px',
                        left: isMobile ? '12px' : '16px',
                        width: isMobile ? '28px' : '32px',
                        height: isMobile ? '28px' : '32px',
                        borderTop: '4px solid #d97706',
                        borderLeft: '4px solid #d97706',
                        borderTopLeftRadius: '16px',
                    }}></div>

                    {/* Ornamen Sudut Kanan Atas */}
                    <div style={{
                        position: 'absolute',
                        top: isMobile ? '12px' : '16px',
                        right: isMobile ? '12px' : '16px',
                        width: isMobile ? '28px' : '32px',
                        height: isMobile ? '28px' : '32px',
                        borderTop: '4px solid #d97706',
                        borderRight: '4px solid #d97706',
                        borderTopRightRadius: '16px',
                    }}></div>

                    {/* Ornamen Sudut Kiri Bawah */}
                    <div style={{
                        position: 'absolute',
                        bottom: isMobile ? '12px' : '16px',
                        left: isMobile ? '12px' : '16px',
                        width: isMobile ? '28px' : '32px',
                        height: isMobile ? '28px' : '32px',
                        borderBottom: '4px solid #d97706',
                        borderLeft: '4px solid #d97706',
                        borderBottomLeftRadius: '16px',
                    }}></div>

                    {/* Ornamen Sudut Kanan Bawah */}
                    <div style={{
                        position: 'absolute',
                        bottom: isMobile ? '12px' : '16px',
                        right: isMobile ? '12px' : '16px',
                        width: isMobile ? '28px' : '32px',
                        height: isMobile ? '28px' : '32px',
                        borderBottom: '4px solid #d97706',
                        borderRight: '4px solid #d97706',
                        borderBottomRightRadius: '16px',
                    }}></div>

                    {/* Area Konten - Responsive */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '80%',
                        height: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingTop: isMobile ? '20px' : '30px',
                    }}>
                        {/* The Wedding Of */}
                        <p style={{
                            animation: 'fadeInDown 0.8s ease-out 0.3s backwards',
                            fontSize: isMobile ? '18px' : '20px',
                            color: '#7d1e1e',
                            margin: isMobile ? '0 0 20px 0' : '0 0 30px 0',
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: '600',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            letterSpacing: '1px',
                        }}>
                            The Wedding Of
                        </p>

                        {/* Foto Pengantin - Responsive */}
                        <div style={{
                            position: 'relative',
                            width: isMobile ? '160px' : '200px',
                            height: isMobile ? '160px' : '200px',
                            marginBottom: isMobile ? '15px' : '20px',
                            animation: 'zoomIn 0.8s ease-out 0.5s backwards',
                        }}>
                            {/* Background Putih */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                zIndex: 1,
                            }}></div>

                            {/* Border Gold */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: isMobile ? '4px solid #d97706' : '5px solid #d97706',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                                zIndex: 3,
                            }}></div>

                            {/* Foto Pasangan */}
                            <img
                                src="/pasangan-pengantin.png"
                                alt="Jhon & Rumina"
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'contain',
                                    padding: isMobile ? '12px' : '15px',
                                    zIndex: 2,
                                }}
                            />
                        </div>

                        {/* Nama Pengantin - Responsive */}
                        <h1 style={{
                            animation: 'fadeInUp 0.8s ease-out 0.7s backwards',
                            fontSize: isMobile ? '36px' : '42px',
                            color: '#7d1e1e',
                            margin: isMobile ? '0 0 20px 0' : '0 0 25px 0',
                            fontFamily: "'Great Vibes', cursive",
                            fontWeight: 'normal',
                            textAlign: 'center',
                            letterSpacing: '2px',
                        }}>
                            Jhon & Rumina
                        </h1>

                        {/* Kepada Yth */}
                        <p style={{
                            animation: 'fadeInUp 0.8s ease-out 0.9s backwards',
                            fontSize: isMobile ? '15px' : '16px',
                            color: '#7d1e1e',
                            margin: '0 0 5px 0',
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: '600',
                            textAlign: 'center',
                        }}>
                            Kepada Yth:
                        </p>

                        {/* Nama Tamu - Responsive */}
                        <h2 style={{
                            animation: 'fadeInUp 0.8s ease-out 1.1s backwards',
                            fontSize: isMobile ? '22px' : '26px',
                            color: '#7d1e1e',
                            margin: isMobile ? '0 0 15px 0' : '0 0 20px 0',
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}>
                            {guestName}
                        </h2>

                        {/* Button Buka Undangan - Responsive */}
                        <button
                            onClick={onOpenInvitation}
                            style={{
                                animation: 'fadeInUp 0.8s ease-out 1.3s backwards',
                                padding: isMobile ? '9px 28px' : '10px 32px',
                                backgroundColor: '#d97706',
                                color: '#ffffff',
                                fontSize: isMobile ? '14px' : '15px',
                                fontWeight: '600',
                                fontFamily: "'Cormorant Garamond', serif",
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 6px 16px rgba(217, 119, 6, 0.4)',
                            }}
                        >
                            Buka Undangan
                        </button>
                    </div>

                </div>

                {/* Floating Music Button - Top Right */}
                <button
                    onClick={onToggleMusic}
                    style={{
                        position: 'absolute',
                        top: isMobile ? '15px' : '20px',
                        right: isMobile ? '15px' : '20px',
                        width: isMobile ? '45px' : '50px',
                        height: isMobile ? '45px' : '50px',
                        borderRadius: '50%',
                        backgroundColor: '#d97706',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.5)',
                        zIndex: 50,
                    }}
                >
                    {isMusicPlaying ? (
                        // Pause Icon
                        <svg
                            width={isMobile ? "20" : "24"}
                            height={isMobile ? "20" : "24"}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                        >
                            <rect x="6" y="4" width="4" height="16" fill="#ffffff" />
                            <rect x="14" y="4" width="4" height="16" fill="#ffffff" />
                        </svg>
                    ) : (
                        // Play Icon
                        <svg
                            width={isMobile ? "20" : "24"}
                            height={isMobile ? "20" : "24"}
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <polygon points="8,5 19,12 8,19" fill="#ffffff" />
                        </svg>
                    )}
                </button>

            </div>
        </div>
    );
};

CoverPage.propTypes = {
    onOpenInvitation: PropTypes.func.isRequired,
    isMusicPlaying: PropTypes.bool.isRequired,
    onToggleMusic: PropTypes.func.isRequired,
};

export default CoverPage;
