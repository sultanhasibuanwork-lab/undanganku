import React from 'react';
import PropTypes from 'prop-types';

const BottomNavbar = ({ activeMenu, onMenuChange }) => {
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'couple', label: 'Couple', icon: 'users' },
        { id: 'event', label: 'Event', icon: 'calendar' },
        { id: 'gallery', label: 'Gallery', icon: 'photo' },
        { id: 'rsvp', label: 'RSVP', icon: 'envelope' },
    ];

    // SVG Icons (Heroicons style)
    const renderIcon = (iconName) => {
        const size = isMobile ? 22 : 24;
        const color = 'currentColor';

        switch (iconName) {
            case 'home':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                );
            case 'users':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'calendar':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'photo':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'envelope':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: isMobile ? '20px' : '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
        }}>
            {/* Rounded Pill Container */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                backgroundColor: '#ffffff',
                borderRadius: '50px',
                padding: isMobile ? '12px 18px' : '14px 22px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(217, 119, 6, 0.2)',
                gap: isMobile ? '10px' : '14px',
                minWidth: isMobile ? '340px' : '420px',
            }}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onMenuChange(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: isMobile ? '10px 14px' : '12px 16px',
                            backgroundColor: activeMenu === item.id ? '#d97706' : 'transparent',
                            borderRadius: '25px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minWidth: isMobile ? '55px' : '65px',
                            color: activeMenu === item.id ? '#ffffff' : '#666',
                        }}
                    >
                        <div style={{ marginBottom: '4px' }}>
                            {renderIcon(item.icon)}
                        </div>
                        <span style={{
                            fontSize: isMobile ? '10px' : '11px',
                            fontWeight: activeMenu === item.id ? '600' : '500',
                            fontFamily: "'Cormorant Garamond', serif",
                        }}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

BottomNavbar.propTypes = {
    activeMenu: PropTypes.string.isRequired,
    onMenuChange: PropTypes.func.isRequired,
};

export default BottomNavbar;
