"use client";

import { useState, useEffect, useRef, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const questionImage = PlaceHolderImages.find((img) => img.id === "love-question");
const successImage = PlaceHolderImages.find((img) => img.id === "success-celebration");

const messages = [
  "Hey you,",
  "I have a little question for you...",
  "It's been on my mind for a while now.",
  "You make my world so much brighter.",
];

const noMessages = [
  "Wait, what? No?",
  "Are you sure about that?",
  "Maybe a misclick?",
  "Think again, my love!",
  "My heart is breaking...",
  "Is this a final answer?",
  "Okay, I'll stop asking...",
  "Just kidding, one more try?",
];

const FloatingGardenItem: FC<{
  emoji: string;
  initialX: number;
  size: number;
  duration: number;
  delay: number;
  isButterfly: boolean;
}> = ({ emoji, initialX, size, duration, delay, isButterfly }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${initialX}%`,
        fontSize: `${size}rem`,
        zIndex: -1,
      }}
      initial={{ y: "100vh" }}
      animate={{ y: "-10vh" }}
      transition={{
        delay,
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.div
        animate={{
          x: ["0rem", "1.5rem", "-1.5rem", "0rem"],
          scale: isButterfly ? [0.8, 1.1, 0.8] : 1,
        }}
        transition={{
          duration: isButterfly ? 2 : 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
};

const HeartBurst: FC = () => {
    const colors = ['#F4C2C2', '#B6A5C8', '#ff7aa2', '#ffb3c1'];
    const hearts = Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * 360;
        const radius = Math.random() * 80 + 20;
        return {
            x: Math.cos(angle * (Math.PI / 180)) * radius,
            y: Math.sin(angle * (Math.PI / 180)) * radius,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 0.5,
        };
    });

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {hearts.map((heart, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                        scale: [1, 1.5, 0],
                        x: heart.x,
                        y: heart.y,
                        opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 1, ease: 'easeOut', delay: heart.delay }}
                    className="absolute"
                >
                    <Heart className="w-4 h-4" style={{ color: heart.color, fill: heart.color }}/>
                </motion.div>
            ))}
        </div>
    );
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [floatingGarden, setFloatingGarden] = useState<any[]>([]);

  useEffect(() => {
    const gardenEmojis = ['🦋', '🌹', '🌸', '🌷', '🌺'];
    const newFloatingGarden = Array.from({ length: 20 }).map((_, i) => {
        const emoji = gardenEmojis[i % gardenEmojis.length];
        return {
            id: i,
            emoji,
            isButterfly: emoji === '🦋',
            initialX: Math.random() * 95,
            size: emoji === '🦋' ? (Math.random() * 1 + 1.5) : (Math.random() * 1.5 + 2),
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 15,
        };
    });
    setFloatingGarden(newFloatingGarden);
  }, []);

  useEffect(() => {
    if (step === 5) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [step]);
  
  const handleNext = () => {
    if (step < messages.length) {
      setStep(step + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 1000);
    } else {
       setStep(step + 1);
    }
  };

  const handleYes = () => {
    setStep(5);
  };
  
  const handleNoHover = () => {
    const button = noButtonRef.current;
    if (button) {
      const container = button.parentElement;
      if (container) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();
          const newX = Math.random() * (containerRect.width - buttonRect.width);
          const newY = Math.random() * (containerRect.height - buttonRect.height);
          
          button.style.position = 'absolute';
          button.style.left = `${newX}px`;
          button.style.top = `${newY}px`;
          
          setNoCount(noCount + 1);
      }
    }
  };

  const getYesButtonSize = () => {
    const sizes = [
      'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'
    ];
    return sizes[Math.min(noCount, sizes.length - 1)];
  };

  const renderContent = () => {
    if (step === 5) {
      return (
        <AnimatePresence>
            <motion.div
                key="success"
                className="text-center flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {successImage && (
                    <Image
                    src={successImage.imageUrl}
                    alt={successImage.description}
                    data-ai-hint={successImage.imageHint}
                    width={400}
                    height={500}
                    className="rounded-2xl shadow-2xl"
                    />
                )}
                <h2 className="text-3xl font-bold text-primary-foreground dark:text-primary-foreground font-headline">YAY! See you on Feb 14th!</h2>
                <p>You've made me the happiest person alive! 🎉</p>
            </motion.div>
        </AnimatePresence>
      );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center gap-6"
            >
                {step <= 3 && (
                    <>
                        <p className="text-2xl md:text-3xl font-headline">{messages[step]}</p>
                        <div className="relative">
                            <Button onClick={handleNext} size="lg" className="text-lg">
                                Next 💌
                            </Button>
                            {showHeartBurst && <HeartBurst />}
                        </div>
                    </>
                )}
                {step === 4 && (
                    <div className="flex flex-col items-center gap-4">
                        {questionImage && (
                            <Image
                                src={questionImage.imageUrl}
                                alt={questionImage.description}
                                data-ai-hint={questionImage.imageHint}
                                width={300}
                                height={375}
                                className="rounded-2xl shadow-2xl"
                            />
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold mt-4 font-headline">Will you be my Valentine?</h2>
                        <div className="relative w-full h-24 flex items-center justify-center gap-4">
                           <Button onClick={handleYes} size="lg" className={`${getYesButtonSize()} transition-all duration-300`}>
                                Yes, I will!
                            </Button>
                           <motion.button
                                ref={noButtonRef}
                                onMouseEnter={handleNoHover}
                                onTouchStart={handleNoHover}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors"
                            >
                                {noMessages[noCount % noMessages.length]}
                            </motion.button>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden p-4">
      {floatingGarden.map((e) => (
        <FloatingGardenItem key={e.id} {...e} />
      ))}
      <div className="w-full max-w-md bg-white/30 dark:bg-black/30 backdrop-blur-lg rounded-2xl p-6 md:p-10 shadow-2xl text-foreground dark:text-white/90 flex items-center justify-center min-h-[300px]">
        {renderContent()}
      </div>
    </main>
  );
}
