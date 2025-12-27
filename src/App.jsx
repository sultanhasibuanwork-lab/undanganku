import { useState, useRef, useEffect } from 'react';
import CoverPage from './components/CoverPage';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
    // Auto play music when opening invitation
    setIsMusicPlaying(true);
  };

  // Control audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  return (
    <div className="App min-h-screen relative overflow-x-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {!isInvitationOpen ? (
        <CoverPage
          onOpenInvitation={handleOpenInvitation}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
        />
      ) : (
        <MainContent
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
        />
      )}
    </div>
  );
}

export default App;
