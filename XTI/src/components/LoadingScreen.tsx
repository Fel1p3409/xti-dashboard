import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simula carregamento progressivo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Flash dramático antes de completar
          setShowFlash(true);
          setTimeout(() => {
            setShowFlash(false);
            setTimeout(() => onLoadingComplete(), 300);
          }, 400);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // Responsive values baseados em breakpoints do Tailwind
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 768;
  const isDesktop = windowWidth >= 768;

  // Valores responsivos - Órbita grande envolvendo logo + texto
  const orbitRadius = isMobile ? 140 : isTablet ? 170 : 200;
  const orbitRadiusX = isMobile ? 180 : isTablet ? 220 : 260; // Raio horizontal (mais largo)
  const orbitRadiusY = isMobile ? 120 : isTablet ? 145 : 170; // Raio vertical (mais estreito)
  const containerSize = isMobile ? 280 : isTablet ? 340 : 400;
  const centerOffset = isMobile ? 20 : isTablet ? 30 : 40;
  const particleSize = isMobile ? 16 : isTablet ? 18 : 20;

  return (
    <motion.div
      className="fixed inset-0 bg-[#0d1117] flex flex-col items-center justify-center z-50 px-4 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Flash Branco Dramático (estilo Netflix) */}
      {showFlash && (
        <motion.div
          className="fixed inset-0 bg-white z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      )}

      {/* Background com Gradient Animado */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(46, 160, 67, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(88, 166, 255, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(46, 160, 67, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(46, 160, 67, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Partículas de Fundo Flutuantes (estilo Netflix) */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: i % 2 === 0 ? 'rgba(46, 160, 67, 0.4)' : 'rgba(88, 166, 255, 0.4)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Logo com Animações */}
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-md">
        {/* Container para Logo */}
        <div className="relative w-full flex justify-center">
          {/* Logo Principal */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotateY: 0
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2
            }}
            className="relative z-20"
          >
            {/* Glow Effect Pulsante Intenso */}
            <motion.div
              className="absolute inset-0 blur-3xl opacity-60"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-[#2ea043] via-[#58a6ff] to-[#2ea043]" />
            </motion.div>

            {/* Raios de Luz (estilo Netflix) */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-transparent via-[#2ea043] to-transparent"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-50%)`,
                    transformOrigin: 'center',
                  }}
                  animate={{
                    scaleY: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              ))}
            </motion.div>

            {/* Logo Image */}
            <motion.img
              src="https://i.ibb.co/jswt9pR/LOGO-XTRADERS-Intelligence-1-1.png"
              alt="XTRADERS Intelligence"
              className="w-48 sm:w-56 md:w-64 h-auto relative z-10"
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(46, 160, 67, 0.8))',
                  'drop-shadow(0 0 40px rgba(88, 166, 255, 0.8))',
                  'drop-shadow(0 0 20px rgba(46, 160, 67, 0.8))',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        {/* Texto "INTELLIGENCE" Animado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-['Orbitron'] text-lg sm:text-xl md:text-2xl tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[#c9d1d9] uppercase relative z-20"
        >
          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            INTELLIGENCE
          </motion.span>
        </motion.div>

        {/* Barra de Progresso */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[256px] mt-4 sm:mt-6 md:mt-8 relative z-20"
        >
          {/* Container da Barra */}
          <div className="relative h-2 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
            {/* Barra de Progresso com Gradient */}
            <motion.div
              className="h-full bg-gradient-to-r from-[#2ea043] via-[#58a6ff] to-[#2ea043] rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              {/* Brilho Animado */}
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>

          {/* Porcentagem */}
          <motion.div
            className="text-center mt-3 font-['Orbitron'] text-sm text-[#8b949e]"
            key={Math.floor(progress)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.floor(progress)}%
          </motion.div>
        </motion.div>

        {/* Texto de Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="font-['Inter'] text-xs text-[#8b949e] uppercase tracking-wider mt-4"
        >
          Carregando auditoria...
        </motion.div>
      </div>
    </motion.div>
  );
}