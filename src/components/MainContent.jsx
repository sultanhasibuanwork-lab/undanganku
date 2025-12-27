import React from 'react';
import { ref, push, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import PropTypes from 'prop-types';
import BottomNavbar from './BottomNavbar';


const MainContent = ({ isMusicPlaying, onToggleMusic }) => {
    // Detect mobile screen
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    // Active menu state for bottom navbar
    const [activeMenu, setActiveMenu] = React.useState('home');

    // Live Countdown Logic
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Gallery Logic
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const galleryImages = [
        '/images-1.jpeg',
        '/images-2.jpeg',
        '/images-3.jpeg',
        '/images-4.jpeg'
    ];

    const openLightbox = (index) => {
        setSelectedImage(galleryImages[index]);
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex + 1) % galleryImages.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(galleryImages[newIndex]);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        setCurrentImageIndex(newIndex);
        setSelectedImage(galleryImages[newIndex]);
    };

    // RSVP & Wishes Logic (Using Firebase)
    const [wishes, setWishes] = React.useState([]);

    // Listen to Firebase Data
    React.useEffect(() => {
        const wishesRef = ref(database, 'wishes');
        const unsubscribe = onValue(wishesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedWishes = [];
            if (data) {
                for (let key in data) {
                    loadedWishes.push({
                        id: key, // Use Firebase Key as ID
                        ...data[key]
                    });
                }
                // Sort newest first
                loadedWishes.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            setWishes(loadedWishes);
        });
        return () => unsubscribe();
    }, []);

    // Pagination State
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const [rsvpForm, setRsvpForm] = React.useState({ name: '', status: 'Hadir', message: '' });

    // Helper untuk mengubah tanggal menjadi "Waktu yang lalu"
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Fallback jika format lama string biasa

        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Baru saja';

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} menit yang lalu`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam yang lalu`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} hari yang lalu`;

        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleRsvpChange = (e) => {
        setRsvpForm({ ...rsvpForm, [e.target.name]: e.target.value });
    };

    const handleRsvpSubmit = (e) => {
        e.preventDefault();
        if (!rsvpForm.name || !rsvpForm.message) return;

        // Push to Firebase
        push(ref(database, 'wishes'), {
            ...rsvpForm,
            date: new Date().toISOString()
        });

        setRsvpForm({ name: '', status: 'Hadir', message: '' }); // Reset form
    };

    const handleDeleteWish = (indexToDelete) => {
        const actualIndex = (currentPage - 1) * itemsPerPage + indexToDelete;
        const wishToDelete = wishes[actualIndex];

        if (wishToDelete && wishToDelete.id) {
            remove(ref(database, `wishes/${wishToDelete.id}`));
        }
    };


    React.useEffect(() => {
        const targetDate = new Date('2026-01-03T08:00:00').getTime(); // Target: 3 Januari 2026

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set body overflow hidden (no scroll)
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
                backgroundImage: 'url(/background-1.jpeg)',
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
                    // Dynamic Background: Shared Glass Style
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(12px)',

                    // Dynamic Shape: Rounded Box (Home) vs Arch (Couple) vs Leaf (Event) vs Asymmetric (Gallery)
                    borderRadius: activeMenu === 'couple' ? '150px 150px 24px 24px' :
                        activeMenu === 'event' ? '80px 8px 80px 8px' :
                            activeMenu === 'gallery' ? '8px 80px 8px 80px' :
                                activeMenu === 'rsvp' ? '50px 8px 50px 8px' : '24px',

                    // Dynamic Shadow
                    boxShadow: '0 8px 32px 0 rgba(125, 30, 30, 0.15)',

                    // Logic Size: Home (Compact) vs Couple (Taller)
                    position: 'relative',
                    width: isMobile ? '92%' : '85%',
                    height: isMobile ? '68vh' : '75vh', // Unified Height for aesthetic balance

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: activeMenu === 'home' ? '20px' : '0', // Full padding for Home, Custom for Couple

                    // Dynamic Border: Shared Thin Glass Border
                    border: '1px solid rgba(255, 255, 255, 0.8)',

                    marginBottom: isMobile ? '80px' : '90px',
                    animation: 'zoomIn 1s ease-out',
                    transition: 'all 0.5s ease',
                    overflow: 'hidden', // Clip content to border radius
                }}>


                    {/* Ornamen Bunga Fixed (Shared for Home, Couple, Event, Gallery & RSVP) */}
                    {(activeMenu === 'home' || activeMenu === 'couple' || activeMenu === 'event' || activeMenu === 'gallery' || activeMenu === 'rsvp') && (
                        <>
                            {/* Nuansa Bunga: Sudut Kiri Atas */}
                            <div style={{
                                position: 'absolute',
                                top: '-15px',
                                left: '-15px',
                                width: '120px',
                                height: '120px',
                                color: '#7d1e1e',
                                opacity: 0.15,
                                pointerEvents: 'none',
                                animation: 'fadeIn 1.5s ease-out',
                                zIndex: 5
                            }}>
                                <svg viewBox="0 0 100 100" fill="currentcolor" style={{ overflow: 'visible' }}>
                                    {/* Tangkai */}
                                    <path d="M-5,-5 Q10,50 70,80" fill="none" stroke="currentColor" strokeWidth="1" />
                                    {/* Daun 1 */}
                                    <path d="M20,25 Q40,15 35,5 Q30,5 20,25 Z" fill="currentColor" opacity="0.6" />
                                    {/* Daun 2 */}
                                    <path d="M50,60 Q70,55 75,45 Q75,40 50,60 Z" fill="currentColor" opacity="0.6" />
                                    {/* Bunga Sederhana */}
                                    <path d="M70,80 Q60,65 75,60 Q90,65 95,80 Q90,95 75,100 Q60,95 70,80 Z" fill="currentColor" opacity="0.8" />
                                    <circle cx="75" cy="80" r="3" fill="#ffffff" />
                                </svg>
                            </div>

                            {/* Nuansa Bunga: Sudut Kanan Bawah */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-15px',
                                right: '-15px',
                                width: '120px',
                                height: '120px',
                                color: '#7d1e1e',
                                opacity: 0.15,
                                transform: 'rotate(180deg)',
                                pointerEvents: 'none',
                                animation: 'fadeIn 1.5s ease-out',
                                zIndex: 5
                            }}>
                                <svg viewBox="0 0 100 100" fill="currentcolor" style={{ overflow: 'visible' }}>
                                    {/* Tangkai */}
                                    <path d="M-5,-5 Q10,50 70,80" fill="none" stroke="currentColor" strokeWidth="1" />
                                    {/* Daun 1 */}
                                    <path d="M20,25 Q40,15 35,5 Q30,5 20,25 Z" fill="currentColor" opacity="0.6" />
                                    {/* Daun 2 */}
                                    <path d="M50,60 Q70,55 75,45 Q75,40 50,60 Z" fill="currentColor" opacity="0.6" />
                                    {/* Bunga Sederhana */}
                                    <path d="M70,80 Q60,65 75,60 Q90,65 95,80 Q90,95 75,100 Q60,95 70,80 Z" fill="currentColor" opacity="0.8" />
                                    <circle cx="75" cy="80" r="3" fill="#ffffff" />
                                </svg>
                            </div>
                        </>
                    )}



                    {/* Area Konten */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        width: activeMenu === 'home' ? '85%' : '100%', // Full width for Couple scroll
                        height: activeMenu === 'home' ? '85%' : '100%', // Full height for Couple scroll
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: activeMenu === 'home' ? 'center' : 'flex-start',
                        overflowY: activeMenu === 'home' ? 'hidden' : 'auto',
                        paddingTop: activeMenu === 'home' ? '0' : '50px', // More top padding for Arch
                        paddingLeft: activeMenu === 'home' ? '0' : '20px',
                        paddingRight: activeMenu === 'home' ? '0' : '20px',
                        paddingBottom: activeMenu === 'home' ? '0' : '120px', // Extra bottom padding for Navbar clearance
                        scrollbarWidth: 'none',
                    }}>
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                        {activeMenu === 'home' && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {/* THE WEDDING OF */}
                                <p style={{
                                    animation: 'fadeInDown 0.8s ease-out 0.3s backwards',
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: '#7d1e1e',
                                    textAlign: 'center',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontWeight: '600',
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    marginBottom: isMobile ? '15px' : '20px',
                                }}>
                                    The Wedding Of
                                </p>

                                {/* Nama Mempelai Pria */}
                                <h1 style={{
                                    animation: 'slideInFromLeft 0.8s ease-out 0.5s backwards',
                                    fontSize: isMobile ? '48px' : '56px',
                                    color: '#7d1e1e',
                                    textAlign: 'center',
                                    fontFamily: "'Great Vibes', cursive",
                                    fontWeight: 'normal',
                                    margin: '0',
                                    lineHeight: '1.2',
                                }}>
                                    Jhon
                                </h1>

                                {/* Symbol & */}
                                <p style={{
                                    fontSize: isMobile ? '36px' : '42px',
                                    color: '#7d1e1e',
                                    textAlign: 'center',
                                    fontFamily: "'Great Vibes', cursive",
                                    margin: isMobile ? '8px 0' : '10px 0',
                                    animation: 'zoomIn 0.8s ease-out 0.7s backwards',
                                }}>
                                    &
                                </p>

                                {/* Nama Mempelai Wanita */}
                                <h1 style={{
                                    animation: 'slideInFromRight 0.8s ease-out 0.9s backwards',
                                    fontSize: isMobile ? '48px' : '56px',
                                    color: '#7d1e1e',
                                    textAlign: 'center',
                                    fontFamily: "'Great Vibes', cursive",
                                    fontWeight: 'normal',
                                    margin: '0',
                                    lineHeight: '1.2',
                                }}>
                                    Rumina
                                </h1>

                                {/* Tanggal */}
                                <p style={{
                                    animation: 'fadeInUp 0.8s ease-out 1.1s backwards',
                                    fontSize: isMobile ? '18px' : '22px',
                                    color: '#7d1e1e',
                                    textAlign: 'center',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontWeight: '600',
                                    letterSpacing: '4px',
                                    marginTop: isMobile ? '20px' : '25px',
                                    marginBottom: isMobile ? '15px' : '20px',
                                }}>
                                    20 . 12 . 25
                                </p>

                                {/* Door/Gate Illustration */}
                                <div style={{
                                    marginTop: isMobile ? '10px' : '15px',
                                    // Combine entrance (fadeInUp) and loop (doorFloat)
                                    // Entrance: 1s duration, 1.3s delay. Loop starts after entrance finishes/delays slightly?
                                    // Actually, let's keep it simple. Entrance animation on wrapper, float on inner svg?
                                    // Or wrapper handles both with keyframes comma separated.
                                    animation: 'fadeInUp 0.8s ease-out 1.3s backwards, doorFloat 3s ease-in-out 2.1s infinite',
                                }}>
                                    <style>
                                        {`
                                    @keyframes doorFloat {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(-5px); }
                                    }
                                    @keyframes keyholeAnimation {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(2px); }
                                    }
                                    .door-svg {
                                        animation: doorFloat 3s ease-in-out infinite;
                                    }
                                    .keyhole-path {
                                        animation: keyholeAnimation 2s ease-in-out infinite;
                                        transform-origin: center;
                                    }
                                `}
                                    </style>
                                    <svg
                                        className="door-svg"
                                        width={isMobile ? "40" : "50"}
                                        height={isMobile ? "68" : "85"}
                                        viewBox="0 0 50 85"
                                        fill="none"
                                    >
                                        {/* Door Frame/Body */}
                                        <rect
                                            x="2"
                                            y="2"
                                            width="46"
                                            height="81"
                                            rx="20"
                                            ry="20"
                                            stroke="#7d1e1e"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        {/* Inner Panel */}
                                        <rect
                                            x="10"
                                            y="10"
                                            width="30"
                                            height="50"
                                            rx="15"
                                            ry="15"
                                            stroke="#7d1e1e"
                                            strokeWidth="2"
                                            fill="none"
                                        />
                                        {/* Door Handle/Knob */}
                                        <circle
                                            cx="25"
                                            cy="40"
                                            r="3"
                                            fill="#7d1e1e"
                                        />
                                        {/* Keyhole - Animated */}
                                        <path
                                            className="keyhole-path"
                                            d="M 25 45 L 25 52"
                                            stroke="#7d1e1e"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {activeMenu === 'couple' && (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                                {/* Couple Names Title */}
                                <h1 style={{
                                    fontFamily: "'Great Vibes', cursive",
                                    fontSize: isMobile ? '42px' : '56px',
                                    color: '#d97706',
                                    marginTop: '60px',
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    lineHeight: '1.2',
                                    animation: 'blurFadeIn 0.8s ease-out 0.3s backwards', // New Blur Fade
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    Jhon <span style={{ fontSize: '0.6em', verticalAlign: 'middle', color: '#7d1e1e' }}>&</span> Rumina
                                </h1>

                                {/* Intro Quote (QS. Ar-Rum : 21) */}
                                <div style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '15px',
                                    color: '#444',
                                    textAlign: 'center',
                                    marginBottom: '50px',
                                    lineHeight: '1.8',
                                    width: '88%',
                                    position: 'relative',
                                    padding: '0 10px',
                                    animation: 'scaleIn 0.8s ease-out 0.5s backwards' // New Scale Effect
                                }}>
                                    <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>
                                        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
                                    </p>
                                    <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#7d1e1e', marginTop: '10px' }}>
                                        - QS. Ar-Rum : 21 -
                                    </p>
                                </div>

                                {/* Groom (Jhon) */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginBottom: '40px',
                                    width: '100%',
                                    animation: 'bounceInUp 1s ease-out 0.7s backwards' // New Bounce Effect
                                }}>
                                    <div style={{
                                        width: isMobile ? '120px' : '140px',
                                        height: isMobile ? '120px' : '140px',
                                        borderRadius: '50%',
                                        border: '4px solid #d97706',
                                        padding: '4px',
                                        marginBottom: '20px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            backgroundColor: '#eee',
                                            backgroundImage: 'url(/pria.png)', // Placeholder
                                            backgroundSize: 'cover',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#aaa',
                                            fontSize: '12px'
                                        }}>
                                            {/* Img Placeholder */}
                                        </div>
                                    </div>
                                    <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#7d1e1e', margin: '0 0 10px 0', textAlign: 'center' }}>Jhon Doe</h2>
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#555', textAlign: 'center', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                                        Putra Kedua dari <br /> Bpk. Alexander & Ibu Maria
                                    </p>
                                    <a href="#" style={{ padding: '8px 20px', backgroundColor: '#7d1e1e', color: 'white', borderRadius: '25px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 6px rgba(125, 30, 30, 0.2)' }}>
                                        <span>Instagram</span>
                                    </a>
                                </div>

                                {/* Divider & */}
                                <div style={{
                                    fontSize: '40px',
                                    color: '#d97706',
                                    fontFamily: "'Great Vibes', cursive",
                                    marginBottom: '40px',
                                    marginTop: '10px',
                                    animation: 'ornamentPop 0.8s ease-out 0.9s backwards' // Pop for the &
                                }}>&</div>

                                {/* Bride (Rumina) */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginBottom: '60px',
                                    width: '100%',
                                    animation: 'bounceInUp 1s ease-out 1.1s backwards' // New Bounce Effect
                                }}>
                                    <div style={{
                                        width: isMobile ? '120px' : '140px',
                                        height: isMobile ? '120px' : '140px',
                                        borderRadius: '50%',
                                        border: '4px solid #d97706',
                                        padding: '4px',
                                        marginBottom: '20px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            backgroundColor: '#eee',
                                            backgroundImage: 'url(/wanita.png)',
                                            backgroundSize: 'cover',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#aaa',
                                            fontSize: '12px'
                                        }}>
                                            {/* Img Placeholder */}
                                        </div>
                                    </div>
                                    <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#7d1e1e', margin: '0 0 10px 0', textAlign: 'center' }}>Rumina Doe</h2>
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#555', textAlign: 'center', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                                        Putri Pertama dari <br /> Bpk. Christopher & Ibu Sarah
                                    </p>
                                    <a href="#" style={{ padding: '8px 20px', backgroundColor: '#7d1e1e', color: 'white', borderRadius: '25px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 6px rgba(125, 30, 30, 0.2)' }}>
                                        <span>Instagram</span>
                                    </a>
                                </div>

                                {/* Closing Ornament / Flourish to fill space */}
                                <div style={{
                                    marginBottom: '30px',
                                    opacity: 0.5,
                                    animation: 'fadeInUp 1s ease-out 1s backwards',
                                    color: '#7d1e1e'
                                }}>
                                    <svg width="100" height="30" viewBox="0 0 100 30" fill="currentColor">
                                        <path d="M50 25 C30 25 20 10 0 15 V17 C20 12 30 27 50 27 C70 27 80 12 100 17 V15 C80 10 70 25 50 25 Z" />
                                        <circle cx="50" cy="10" r="3" />
                                        <circle cx="35" cy="15" r="2" />
                                        <circle cx="65" cy="15" r="2" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* ================= EVENT CONTENT ================= */}
                        {activeMenu === 'event' && (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '20px' }}>

                                {/* Header: Save The Date */}
                                <h1 style={{
                                    fontFamily: "'Great Vibes', cursive",
                                    fontSize: isMobile ? '48px' : '56px',
                                    color: '#d97706',
                                    marginTop: '60px', // Adjusted to avoid ornament overlap
                                    marginBottom: '10px',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    animation: 'blurFadeIn 0.8s ease-out 0.2s backwards'
                                }}>Save The Date</h1>

                                {/* Countdown Timer */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    marginBottom: '30px',
                                    animation: 'scaleIn 0.8s ease-out 0.4s backwards'
                                }}>
                                    {[
                                        { label: 'Hari', value: timeLeft.days },
                                        { label: 'Jam', value: timeLeft.hours },
                                        { label: 'Menit', value: timeLeft.minutes },
                                        { label: 'Detik', value: timeLeft.seconds }
                                    ].map((item, index) => (
                                        <div key={index} style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            width: isMobile ? '65px' : '80px',
                                            height: isMobile ? '70px' : '85px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        }}>
                                            <span style={{
                                                fontSize: isMobile ? '24px' : '32px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontWeight: 'bold',
                                                color: '#7d1e1e', // Maroon theme
                                                lineHeight: '1'
                                            }}>
                                                {String(item.value).padStart(2, '0')}
                                            </span>
                                            <span style={{
                                                fontSize: isMobile ? '12px' : '14px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                color: '#7d1e1e', // Maroon theme
                                                marginTop: '4px'
                                            }}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Invitation Text */}
                                <div style={{
                                    width: '90%',
                                    textAlign: 'center',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '15px',
                                    color: '#444',
                                    marginBottom: '40px',
                                    lineHeight: '1.6',
                                    animation: 'fadeInUp 0.8s ease-out 0.6s backwards'
                                }}>
                                    Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara pernikahan kami:
                                </div>

                                {/* Kartu Akad Nikah */}
                                <div style={{
                                    width: '100%',
                                    marginBottom: '30px',
                                    padding: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    animation: 'slideInFromLeft 0.8s ease-out 0.7s backwards'
                                }}>
                                    <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#7d1e1e', margin: '0 0 10px 0' }}>Akad Nikah</h2>
                                    <div style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontWeight: 'bold',
                                        color: '#d97706',
                                        marginBottom: '10px',
                                        fontSize: '18px'
                                    }}>
                                        Sabtu, 3 Januari 2026
                                    </div>
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#444', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Pukul 08:00 WIB - Selesai
                                    </p>
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '15px', lineHeight: '1.4' }}>
                                        Masjid Agung Al-Barkah <br /> Jl. Veteran No. 45, Kota Bekasi
                                    </p>
                                    <a href="https://www.google.com/maps/search/?api=1&query=Masjid+Agung+Al-Barkah+Bekasi" target="_blank" rel="noreferrer"
                                        style={{
                                            padding: '8px 20px',
                                            backgroundColor: '#d97706',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            boxShadow: '0 4px 6px rgba(217, 119, 6, 0.3)',
                                            transition: 'transform 0.2s',
                                            cursor: 'pointer'
                                        }}>
                                        <span>Google Maps</span>
                                    </a>
                                </div>

                                {/* Divider Simple */}
                                <div style={{ width: '40px', height: '2px', backgroundColor: '#d97706', marginBottom: '30px', animation: 'scaleIn 0.5s ease 1s backwards' }}></div>

                                {/* Kartu Resepsi */}
                                <div style={{
                                    width: '100%',
                                    padding: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.8)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    animation: 'slideInFromRight 0.8s ease-out 1.2s backwards'
                                }}>
                                    <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#7d1e1e', margin: '0 0 10px 0' }}>Resepsi</h2>
                                    <div style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontWeight: 'bold',
                                        color: '#d97706',
                                        marginBottom: '10px',
                                        fontSize: '18px'
                                    }}>
                                        Sabtu, 3 Januari 2026
                                    </div>
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#444', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Pukul 11:00 WIB - Selesai
                                    </p>
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '15px', lineHeight: '1.4' }}>
                                        Grand Metropolitan Ballroom <br /> Jl. KH. Noer Ali, Bekasi Selatan
                                    </p>
                                    <a href="https://www.google.com/maps/search/?api=1&query=Grand+Metropolitan+Bekasi" target="_blank" rel="noreferrer"
                                        style={{
                                            padding: '8px 20px',
                                            backgroundColor: '#d97706',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            boxShadow: '0 4px 6px rgba(217, 119, 6, 0.3)',
                                            transition: 'transform 0.2s',
                                            cursor: 'pointer'
                                        }}>
                                        <span>Google Maps</span>
                                    </a>
                                </div>

                            </div>
                        )}

                        {/* ================= GALLERY CONTENT ================= */}
                        {activeMenu === 'gallery' && (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h1 style={{
                                    fontFamily: "'Great Vibes', cursive",
                                    fontSize: isMobile ? '48px' : '56px',
                                    color: '#7d1e1e',
                                    marginTop: '40px',
                                    marginBottom: '30px',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    animation: 'blurFadeIn 0.8s ease-out 0.2s backwards'
                                }}>Our Gallery</h1>

                                <p style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '16px',
                                    color: '#555',
                                    textAlign: 'center',
                                    maxWidth: '85%',
                                    margin: '-15px 0 25px 0',
                                    lineHeight: '1.6',
                                    fontStyle: 'italic',
                                    animation: 'fadeInUp 0.8s ease-out 0.3s backwards'
                                }}>
                                    "Momen manis yang kami abadikan sebagai kenangan abadi dalam perjalanan cinta kami."
                                </p>

                                {/* Horizontal Scroll Container */}
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    overflowX: 'auto',
                                    width: '100%',
                                    padding: '10px 40px', // Padding kiri kanan agar awal/akhir item terlihat center
                                    scrollSnapType: 'x mandatory',
                                    scrollbarWidth: 'none', // Firefox
                                    msOverflowStyle: 'none', // IE
                                    WebkitOverflowScrolling: 'touch',
                                    animation: 'fadeInUp 1s ease-out 0.5s backwards'
                                }}>
                                    <style>{`
                                        div::-webkit-scrollbar { display: none; }
                                    `}</style>

                                    {galleryImages.map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={() => openLightbox(index)}
                                            style={{
                                                flexShrink: 0,
                                                width: '200px',
                                                height: '280px',
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                scrollSnapAlign: 'center',
                                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                                cursor: 'pointer',
                                                transition: 'transform 0.3s ease',
                                                border: '4px solid white'
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Gallery ${index + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}

                                    {/* Spacer agar item terakhir bisa di-scroll ke tengah */}
                                    <div style={{ minWidth: '20px' }}></div>
                                </div>

                                <p style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '14px',
                                    color: '#666',
                                    marginTop: '20px',
                                    fontStyle: 'italic',
                                    opacity: 0.8,
                                    animation: 'fadeIn 1s ease 1s backwards'
                                }}>
                                    Swipe & Click to View
                                </p>
                            </div>
                        )}

                        {/* ================= RSVP CONTENT ================= */}
                        {activeMenu === 'rsvp' && (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                overflowY: 'auto', // Enable scroll for full page
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                paddingBottom: '100px', // Extra space for BottomNavbar
                                scrollbarWidth: 'none', // Hide Scrollbar Firefox
                                msOverflowStyle: 'none'  // Hide Scrollbar IE
                            }}>
                                <style>{`
                                    div::-webkit-scrollbar { display: none; }
                                `}</style>

                                <h1 style={{
                                    fontFamily: "'Great Vibes', cursive",
                                    fontSize: isMobile ? '42px' : '48px',
                                    color: '#7d1e1e',
                                    marginTop: '80px', // Increased margin to avoid ornament overlap
                                    marginBottom: '20px',
                                    textAlign: 'center',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    animation: 'blurFadeIn 0.8s ease-out 0.2s backwards',
                                    flexShrink: 0 // Prevent shrinking
                                }}>Wishes & RSVP</h1>

                                <p style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '16px',
                                    color: '#555',
                                    textAlign: 'center',
                                    maxWidth: '85%',
                                    margin: '-10px 0 25px 0',
                                    lineHeight: '1.6',
                                    fontStyle: 'italic',
                                    animation: 'fadeInUp 0.8s ease-out 0.3s backwards',
                                    flexShrink: 0
                                }}>
                                    "Mohon konfirmasi kehadiran dan kirimkan doa restu untuk melengkapi kebahagiaan kami."
                                </p>

                                {/* Form Container */}
                                <div style={{
                                    width: '90%',
                                    backgroundColor: 'rgba(255,255,255,0.85)',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    marginBottom: '30px',
                                    animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
                                    zIndex: 20,
                                    flexShrink: 0 // Prevent shrinking
                                }}>
                                    <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            placeholder="Nama Anda"
                                            value={rsvpForm.name}
                                            onChange={handleRsvpChange}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #dcdcdc',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '16px',
                                                outline: 'none',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                        <select
                                            name="status"
                                            autoComplete="off"
                                            value={rsvpForm.status}
                                            onChange={handleRsvpChange}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #dcdcdc',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '16px',
                                                outline: 'none',
                                                backgroundColor: '#fff'
                                            }}
                                        >
                                            <option value="Hadir">Hadir</option>
                                            <option value="Tidak Hadir">Tidak Hadir</option>
                                            <option value="Masih Ragu">Masih Ragu</option>
                                        </select>
                                        <textarea
                                            name="message"
                                            autoComplete="off"
                                            placeholder="Tulis ucapan & doa..."
                                            value={rsvpForm.message}
                                            onChange={handleRsvpChange}
                                            rows="3"
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px solid #dcdcdc',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '16px',
                                                outline: 'none',
                                                resize: 'none',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '12px',
                                                backgroundColor: '#7d1e1e',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                letterSpacing: '1px',
                                                cursor: 'pointer',
                                                transition: 'transform 0.1s',
                                                marginTop: '5px'
                                            }}
                                        >
                                            Kirim Ucapan
                                        </button>
                                    </form>
                                </div>

                                {/* Divider Title */}
                                <div style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    marginBottom: '15px',
                                    animation: 'fadeIn 1s ease 0.5s backwards'
                                }}>
                                    <span style={{
                                        fontFamily: "'Cormorant Garamond', serif",
                                        fontSize: '18px',
                                        fontStyle: 'italic',
                                        color: '#7d1e1e',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        padding: '5px 15px',
                                        borderRadius: '20px'
                                    }}>
                                        {wishes.length} Ucapan Masuk
                                    </span>
                                </div>

                                {/* Wishes List (Natural Flow) */}
                                <div style={{
                                    width: '100%',
                                    // Removed fixed flex & overflow hidden to allow full scrolling
                                    padding: '0 20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    animation: 'fadeIn 1s ease 0.6s backwards'
                                }}>
                                    {wishes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((wish, index) => (
                                        <div key={index} style={{
                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                            padding: '15px',
                                            borderRadius: '12px',
                                            // borderLeft removed for cleaner look
                                            fontSize: '14px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                            animation: index === 0 ? 'slideInFromLeft 0.5s ease' : 'none',
                                            textAlign: 'left'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                                                <strong style={{ color: '#7d1e1e', fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }}>{wish.name}</strong>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '12px', color: '#888', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{getTimeAgo(wish.date)}</span>
                                                    <button
                                                        onClick={() => handleDeleteWish(index)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#ff4d4f',
                                                            cursor: 'pointer',
                                                            fontSize: '18px',
                                                            lineHeight: '1',
                                                            padding: 0
                                                        }}
                                                        title="Hapus Komentar"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Status Text Sederhana */}
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#555',
                                                marginBottom: '8px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontStyle: 'italic'
                                            }}>
                                                Konfirmasi: {wish.status}
                                            </div>

                                            <p style={{ margin: 0, color: '#333', fontFamily: "'Cormorant Garamond', serif", lineHeight: '1.5', fontSize: '16px' }}>"{wish.message}"</p>
                                        </div>
                                    ))}

                                    {/* Pagination Controls - Responsive */}
                                    {wishes.length > itemsPerPage && (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: isMobile ? '15px' : '20px', // Reduced gap for mobile
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                            fontFamily: "'Cormorant Garamond', serif",
                                            width: '100%',
                                            flexWrap: 'wrap' // Allow wrapping if very small screen
                                        }}>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                style={{
                                                    background: 'none', border: 'none',
                                                    color: currentPage === 1 ? '#ccc' : '#7d1e1e',
                                                    cursor: currentPage === 1 ? 'default' : 'pointer',
                                                    fontSize: '16px', fontWeight: 'bold',
                                                    padding: '8px',
                                                    minWidth: '40px'
                                                }}
                                            >
                                                {isMobile ? '«' : '« Sebelumnya'}
                                            </button>

                                            <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#555', whiteSpace: 'nowrap' }}>
                                                {isMobile ? `${currentPage} / ${Math.ceil(wishes.length / itemsPerPage)}` : `Hal. ${currentPage} dari ${Math.ceil(wishes.length / itemsPerPage)}`}
                                            </span>

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(wishes.length / itemsPerPage), p + 1))}
                                                disabled={currentPage === Math.ceil(wishes.length / itemsPerPage)}
                                                style={{
                                                    background: 'none', border: 'none',
                                                    color: currentPage === Math.ceil(wishes.length / itemsPerPage) ? '#ccc' : '#7d1e1e',
                                                    cursor: currentPage === Math.ceil(wishes.length / itemsPerPage) ? 'default' : 'pointer',
                                                    fontSize: '16px', fontWeight: 'bold',
                                                    padding: '8px',
                                                    minWidth: '40px'
                                                }}
                                            >
                                                {isMobile ? '»' : 'Selanjutnya »'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                </div>

                {/* Floating Music Button - Top Right (Inside Container) */}
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

            {/* Modal Lightbox */}
            {selectedImage && (
                <div
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '40px',
                            cursor: 'pointer',
                            zIndex: 2001
                        }}
                    >
                        &times;
                    </button>

                    {/* Prev Button */}
                    <button
                        onClick={prevImage}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '50%',
                            fontSize: '24px',
                            cursor: 'pointer',
                            zIndex: 2001,
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        &#10094;
                    </button>

                    {/* Image */}
                    <img
                        src={selectedImage}
                        alt="Selected"
                        onClick={(e) => e.stopPropagation()} // Prevent close on image click
                        style={{
                            maxWidth: '90%',
                            maxHeight: '80vh',
                            borderRadius: '8px',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                            animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    />

                    {/* Next Button */}
                    <button
                        onClick={nextImage}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: 'white',
                            padding: '15px',
                            borderRadius: '50%',
                            fontSize: '24px',
                            cursor: 'pointer',
                            zIndex: 2001,
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        &#10095;
                    </button>

                    {/* Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        color: 'white',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '16px',
                        letterSpacing: '2px'
                    }}>
                        {currentImageIndex + 1} / {galleryImages.length}
                    </div>
                </div>
            )}

            {/* Bottom Navbar */}
            <BottomNavbar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        </div>
    );
};

MainContent.propTypes = {
    isMusicPlaying: PropTypes.bool.isRequired,
    onToggleMusic: PropTypes.func.isRequired,
};

export default MainContent;
