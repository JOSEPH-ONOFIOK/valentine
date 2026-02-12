"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Check,
  Mail,
  ArrowRight,
  Camera,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const getRandomOffset = (current: number) => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const distance = Math.floor(Math.random() * 100) + 50;
  return current + distance * direction;
};

const journeySteps = [
  {
    title: "Where it all began...",
    content:
      "From the moment we first met, I knew there was something special about you. Every smile, every laugh, and every moment we've shared has been a gift.",
    icon: Sparkles,
  },
  {
    title: "The Little Things",
    content:
      "It's the way you look at me, the way you make me feel safe, and the way you always know how to brighten my day. These small moments are my favorite memories.",
    icon: Heart,
  },
  {
    title: "My Heart's Letter",
    content:
      "You are my best friend, my confidant, and my home. I am so lucky to have you in my life, and I can't wait to see what the future holds for us together.",
    icon: Mail,
  },
];

const memoryPhotos = [
  "/images/memory_1.jpg",
  "/images/memory_2.jpg",
  "/images/memory_3.jpg",
  "/images/memory_4.jpg",
  "/images/memory_5.jpg",
  "/images/memory_6.jpg",
];

export default function Proposal() {
  const [phase, setPhase] = useState<
    "envelope" | "journey" | "question" | "success"
  >("envelope");

  const [journeyIndex, setJourneyIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noHoverCount, setNoHoverCount] = useState(0);

  const handleNoHover = () => {
    setNoButtonPos({
      x: getRandomOffset(noButtonPos.x),
      y: getRandomOffset(noButtonPos.y),
    });
    setYesScale((prev) => Math.min(prev + 0.15, 3));
    setNoHoverCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    setPhase("success");
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff6b8b", "#ffb6c1", "#ffffff"],
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff6b8b", "#ffb6c1", "#ffffff"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  const nextJourneyStep = () => {
    if (journeyIndex < journeySteps.length - 1) {
      setJourneyIndex(journeyIndex + 1);
    } else {
      setPhase("question");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-gradient-to-br from-pink-50 to-red-50">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{
              x: Math.random() * 100 + "%",
              y: "110vh",
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            animate={{ y: "-10vh", rotate: Math.random() * 360 }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          >
            <Heart
              size={Math.random() * 40 + 20}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Envelope */}
        {phase === "envelope" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
            className="text-center z-10 cursor-pointer group"
            onClick={() => setPhase("journey")}
          >
            <motion.div
              className="relative mb-8"
              animate={{ y: [0, -20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <div className="w-64 h-64 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                <Mail className="w-32 h-32 text-primary group-hover:scale-110 transition-transform" />
              </div>
            </motion.div>

            <h1 className="text-4xl text-primary mb-4">
              Open here for a surprise...
            </h1>
            <p className="text-muted-foreground text-lg">
              Click to reveal my heart
            </p>
          </motion.div>
        )}

        {/* Journey */}
        {phase === "journey" && (
          <motion.div
            key={`journey-${journeyIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl text-center z-10 p-8"
          >
            <Card className="border-none bg-white/60 backdrop-blur-md shadow-2xl rounded-[2rem]">
              <CardContent className="pt-12 pb-8 px-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                  {(() => {
                    const StepIcon =
                      journeySteps[journeyIndex].icon;
                    return (
                      <StepIcon className="w-10 h-10 text-primary" />
                    );
                  })()}
                </div>

                <h2 className="text-4xl text-primary mb-6">
                  {journeySteps[journeyIndex].title}
                </h2>

                <p className="text-xl leading-relaxed text-foreground/80 mb-12 italic">
                  "{journeySteps[journeyIndex].content}"
                </p>

                <Button
                  onClick={nextJourneyStep}
                  className="rounded-full px-10 h-14 text-lg"
                >
                  {journeyIndex === journeySteps.length - 1
                    ? "The Final Question..."
                    : "Keep Going..."}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Question */}
        {phase === "question" && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10"
          >
            <h1 className="text-5xl text-primary font-bold mb-10">
              Will you be my Valentine?
            </h1>

            <div className="flex items-center justify-center gap-6 relative h-32">
              <motion.button
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-xl"
                style={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.1 }}
                onClick={handleYesClick}
              >
                YES ❤️
              </motion.button>

              <motion.button
                className="bg-muted px-8 py-4 rounded-full font-bold text-xl absolute"
                style={{
                  x: noButtonPos.x,
                  y: noButtonPos.y,
                }}
                animate={{
                  x: noButtonPos.x,
                  y: noButtonPos.y,
                }}
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl z-10"
          >
            <Card className="border-none shadow-2xl bg-white/90 rounded-[2rem]">
              <CardContent className="pt-12 px-8 pb-12 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-12 h-12 text-green-600" />
                </div>

                <h2 className="text-4xl text-primary mb-6">
                  Yay! I knew it! ❤️
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                  {memoryPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://picsum.photos/seed/${index}/400/400`;
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
                  <Camera size={18} className="text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Screenshot this and send it to me!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
