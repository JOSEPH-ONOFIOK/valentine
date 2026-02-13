"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Check,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ---------------- Utils ---------------- */

// Prevent No button from escaping screen
const getSafeOffset = () => {
  const maxX = window.innerWidth / 2 - 100;
  const maxY = window.innerHeight / 2 - 120;

  return {
    x: (Math.random() - 0.5) * maxX,
    y: (Math.random() - 0.5) * maxY,
  };
};

// Tiny heart burst
const tinyHearts = () => {
  confetti({
    particleCount: 20,
    spread: 70,
    origin: { y: 0.7 },
  });
};

/* ---------------- Journey Steps ---------------- */

const journeySteps = [
  {
    title: "Every Love Story Has a Beginning...",
    buttonText: "Our story continues... 💌",
    content: (
      <>
        <p className="font-montserrat">Ours started in the most unexpected place</p>
        <p className="italic text-primary font-medium mt-2 font-montserrat">
          at manna, both of us just trying to get noodles.
        </p>
        <p className="mt-4 font-montserrat">
          I didn’t know it then, but that moment would change everything.
        </p>
        <p className="font-montserrat">I started a conversation…</p>
        <p className="font-montserrat">And I haven’t wanted to stop since.</p>
      </>
    ),
  },
  {
    title: "Something Different",
    buttonText: "Keep going... ",
    content: (
      <>
        <p className="font-montserrat">
          I'm not gonna lie and say it was love at first sight or anything like that.
        </p>
        <p className="font-montserrat">
          But what did I know?{" "}
          <span className="italic text-primary font-medium">
            you were different
          </span>.
        </p>
        <p className="font-montserrat">
          There was something about the way you carried yourself, the way you talked
        </p>
        <p className="font-montserrat">
          Something that made me want to keep the conversation going.
        </p>
        <p className="font-montserrat">
          You weren't like everyone else. You were{" "}
          <span className="italic text-primary font-medium">unique</span>.
        </p>
        <p className="font-montserrat">
          And that curiosity? That interest? It only grew the more I got to know you.
        </p>
      </>
    ),
  },
  { title: "Our Favorite Moments", buttonText: "There's more... ", content: ( <div className="space-y-4 font-montserrat"> <div className="bg-white rounded-2xl p-5 shadow-md animate-fadeInUp"> <h3 className="font-semibold text-primary mb-1 font-cormorant"> That First Day </h3> <p>That random morning when we both wanted noodles and ended up wanting so much more. I can still remember how easy it felt to talk with you. The beginning of something I didn't see coming. </p> </div> <div className="bg-white rounded-2xl p-5 shadow-md animate-fadeInUp delay-150"> <h3 className="font-semibold text-primary mb-1 font-cormorant"> Our First Kiss </h3> <p>The moment that made my heart race and the world go quiet.I remember exactly how it felt; nervous, the butterflies, the smile i couldn't wipe from off my face after. When I knew this wasn't just in my head anymore, it was real for both of us. </p> </div> <div className="bg-white rounded-2xl p-5 shadow-md animate-fadeInUp delay-300"> <h3 className="font-semibold text-primary mb-1 font-cormorant"> The play at Boja </h3> <p>Watching the play, but honestly? I was more aware of you than anything on stage. All I could think about was how close you were. We weren't just watching the play, we were caught in our own moment. The tension building with every passing moment, Wanting nothing more than to kiss you but knowing we had to wait. The tension was driving me crazy</p> </div> </div> ), },
  {
  title: "What I Love About You",
  buttonText: "Almost there... ",
  content: (
    <ul className="space-y-3 text-left font-montserrat">
      {[
        "Your thoughtfulness isn't just just sweet gestures, its the way you pay attention to who I am and what matters to me ",
        "How naturally affectionate you are, like loving me is the easiest thing in the world. It makes me feel safe to love you back",
        "You look at me like I'm etraordinary, and somehow, when I'm with you, I actually believe it",
        "When you're trying so hard not to laugh at my jokes wehn you're mad, but i can see it breaking through. That's when I know i've made your day a little brighter",
        "Everything about the way you look takes my breathe away, I could spend forever just admiring you",
        "When you put on that 'I don't need your attention' act but I know deep down you're loving every second; your playful side is irresistible ",
      ].map((item, i) => (
        <li
          key={i}
          className="bg-white p-4 rounded-xl shadow-sm flex gap-2 items-center animate-slideIn"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          💕 <span>{item}</span>
        </li>
      ))}
    </ul>
  ),
},
{
  title: "Every Day With You",
  buttonText: "I feel it too 💞",
  content: (
    <>
      <p className="font-montserrat">
        These past months have shown me something special—
      </p>
      <p className="italic text-primary font-medium mt-2 font-montserrat">
        that the ordinary can become extraordinary when you're with the right person.
      </p>
      <p className="font-montserrat">
        You've brought so much joy, laughter, and light into my life.
      </p>
      <p className="font-montserrat">
        Every conversation, every moment, every silly little thing we do together...
      </p>
      <p className="font-montserrat">
        It all matters because its with you.
      </p>
      <p className="font-montserrat">
        And I find myself looking forward to all the moments we haven't had yet.
      </p>
      <p className="font-montserrat">
        All the laughs, the adventures, the quiet times, and everything in between.
      </p>
    </>
  ),
}
,
];

/* ---------------- Gallery ---------------- */

const memoryPhotos = [
  "/images/memory_1.jpeg",
  "/images/memory_2.jpeg",
  "/images/memory_3.jpeg",
  "/images/memory_4.jpeg",
  "/images/memory_5.jpeg",
  "/images/memory_6.jpeg",
];

export default function Proposal() {
  const [phase, setPhase] = useState<
    "envelope" | "journey" | "question" | "success"
  >("envelope");

  const [journeyIndex, setJourneyIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);

  const handleNoMove = () => {
    const newPos = getSafeOffset();
    setNoButtonPos(newPos);
    setYesScale((prev) => Math.min(prev + 0.15, 2.5));
    tinyHearts();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-gradient-to-br from-pink-50 to-red-50 font-montserrat">
      
      <AnimatePresence mode="wait">
        {/* Envelope */}
        {phase === "envelope" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10 cursor-pointer"
            onClick={() => setPhase("journey")}
          >
            <div className="w-56 h-56 md:w-64 md:h-64 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
              <Mail className="w-24 h-24 md:w-32 md:h-32 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl text-primary mt-6 font-cormorant">
              Open here for a surprise...
            </h1>
          </motion.div>
        )}

        {/* Journey */}
        {phase === "journey" && (
          <motion.div
            key={`journey-${journeyIndex}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="w-full max-w-2xl text-center z-10 p-6"
          >
            <Card className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem]">
              <CardContent className="pt-12 pb-10 px-8">
                <h2 className="text-4xl md:text-5xl text-primary mb-8 font-cormorant">
                  {journeySteps[journeyIndex].title}
                </h2>

                <div className="text-lg md:text-xl leading-relaxed text-foreground/80 space-y-3 italic">
                  {journeySteps[journeyIndex].content}
                </div>

                <Button
                  onClick={() => {
                    tinyHearts();
                    if (journeyIndex < journeySteps.length - 1) {
                      setJourneyIndex((prev) => prev + 1);
                    } else {
                      setPhase("question");
                    }
                  }}
                  className="mt-10 
                  px-6 h-11 text-sm
                  md:px-10 md:h-14 md:text-lg
                  rounded-full"
                >
                  {journeySteps[journeyIndex].buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Question */}
        {phase === "question" && (
          <motion.div key="proposal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center z-10">
            <h1 className="text-4xl md:text-5xl text-primary mb-10 font-cormorant">
              Will you be my Valentine?
            </h1>

            <div className="relative h-40 flex items-center justify-center gap-6">

              {/* YES */}
              <motion.button
                className="bg-primary text-white 
                px-6 py-3 text-lg
                md:px-8 md:py-4 md:text-xl
                rounded-full font-bold"
                animate={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                  triggerConfetti();
                  setPhase("success");
                }}
              >
                YES ❤️
              </motion.button>

              {/* NO */}
              <motion.button
                className="bg-muted 
                px-6 py-3 text-lg
                md:px-8 md:py-4 md:text-xl
                rounded-full font-bold absolute"
                onMouseEnter={handleNoMove}
                onClick={handleNoMove}
                animate={{
                  x: noButtonPos.x,
                  y: noButtonPos.y,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                }}
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
            <Card className="shadow-2xl bg-white rounded-[2rem]">
              <CardContent className="pt-12 px-8 pb-12 text-center">
               
                <h2 className="text-3xl md:text-4xl text-primary mb-4 font-cormorant">
                  Yay! I knew it! ❤️
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  {memoryPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                      <img
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <p className="text-lg">
                  Here's to all our memories and all the ones we'll make together 💕
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
