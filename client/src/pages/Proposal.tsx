import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Send, Check, Mail, ArrowRight, Camera, Sparkles } from "lucide-react";
import { useRespondValentine } from "@/hooks/use-valentine";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertResponseSchema } from "@shared/schema";

const getRandomOffset = (current: number) => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const distance = Math.floor(Math.random() * 100) + 50;
  return current + (distance * direction);
};

const journeySteps = [
  {
    title: "Where it all began...",
    content: "From the moment we first met, I knew there was something special about you. Every smile, every laugh, and every moment we've shared has been a gift.",
    icon: Sparkles
  },
  {
    title: "The Little Things",
    content: "It's the way you look at me, the way you make me feel safe, and the way you always know how to brighten my day. These small moments are my favorite memories.",
    icon: Heart
  },
  {
    title: "My Heart's Letter",
    content: "You are my best friend, my confidant, and my home. I am so lucky to have you in my life, and I can't wait to see what the future holds for us together.",
    icon: Mail
  }
];

export default function Proposal() {
  const [phase, setPhase] = useState<"envelope" | "journey" | "question" | "success">("envelope");
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noHoverCount, setNoHoverCount] = useState(0);

  const respondMutation = useRespondValentine();

  const form = useForm<z.infer<typeof insertResponseSchema>>({
    resolver: zodResolver(insertResponseSchema),
    defaultValues: {
      responderName: "",
      accepted: true,
      message: "",
    },
  });

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
      confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff6b8b', '#ffb6c1', '#ffffff'] });
      confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff6b8b', '#ffb6c1', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const onSubmit = (data: z.infer<typeof insertResponseSchema>) => {
    respondMutation.mutate(data);
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
      {/* Decorative floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{ x: Math.random() * 100 + "%", y: "110vh", scale: Math.random() * 0.5 + 0.5, rotate: Math.random() * 360 }}
            animate={{ y: "-10vh", rotate: Math.random() * 360 }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
          >
            <Heart size={Math.random() * 40 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
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
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <div className="w-64 h-64 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-primary/20 group-hover:border-primary/40 transition-colors overflow-hidden">
                <Mail className="w-32 h-32 text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
              </div>
              <motion.div 
                className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-full shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart fill="currentColor" size={24} />
              </motion.div>
            </motion.div>
            <h1 className="text-4xl text-primary mb-4 drop-shadow-sm">Open here for a surprise...</h1>
            <p className="text-muted-foreground text-lg handwritten">Click to reveal my heart</p>
          </motion.div>
        )}

        {phase === "journey" && (
          <motion.div
            key={`journey-${journeyIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-2xl text-center z-10 p-8"
          >
            <Card className="border-none bg-white/60 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden">
              <CardContent className="pt-12 pb-8 px-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                  {(() => {
                    const StepIcon = journeySteps[journeyIndex].icon;
                    return <StepIcon className="w-10 h-10 text-primary" />;
                  })()}
                </div>
                <h2 className="text-4xl text-primary mb-6">{journeySteps[journeyIndex].title}</h2>
                <p className="text-xl leading-relaxed text-foreground/80 mb-12 handwritten italic">
                  "{journeySteps[journeyIndex].content}"
                </p>
                <Button 
                  onClick={nextJourneyStep}
                  className="rounded-full px-10 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2 group"
                >
                  {journeyIndex === journeySteps.length - 1 ? "The Final Question..." : "Keep Going..."}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex gap-2 mt-8">
                  {journeySteps.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all ${i === journeyIndex ? "w-8 bg-primary" : "w-2 bg-primary/20"}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === "question" && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-lg text-center z-10"
          >
            <motion.div 
              className="mb-8 relative inline-block"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <div className="w-48 h-48 mx-auto bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-xl shadow-primary/30 relative">
                <Heart className="w-24 h-24 text-white fill-white animate-pulse" />
                <motion.div 
                   className="absolute -top-2 -right-2 text-white"
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={32} fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl text-primary font-bold mb-6 drop-shadow-sm">
              Will you be my Valentine?
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium">
              {noHoverCount > 0 ? (
                <span className="text-accent-foreground font-bold">
                  {noHoverCount < 3 ? "Pretty please?" : 
                   noHoverCount < 6 ? "Don't be like that!" : 
                   "You're breaking my heart! 💔"}
                </span>
              ) : "You are my favorite person in the world..."}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative h-32">
              <motion.button
                layout
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg shadow-primary/40 hover:bg-primary/90 hover:shadow-xl transition-all z-20 flex items-center gap-2"
                style={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.1 }}
                whileTap={{ scale: yesScale * 0.9 }}
                onClick={handleYesClick}
              >
                <Heart className="fill-white w-6 h-6" />
                YES!
              </motion.button>

              <motion.button
                className="bg-muted text-muted-foreground px-8 py-4 rounded-full font-bold text-xl hover:bg-muted/80 transition-colors absolute md:static"
                style={{ 
                  x: noButtonPos.x, 
                  y: noButtonPos.y,
                  position: noHoverCount > 0 ? 'absolute' : 'relative'
                }}
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-full max-w-md z-10"
          >
            <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-[2rem]">
              <CardContent className="pt-12 px-8 pb-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
                </motion.div>

                <h2 className="text-4xl text-primary mb-4">
                  Yay! I knew it! ❤️
                </h2>
                <p className="text-muted-foreground mb-12 text-lg italic handwritten">
                  "You've made me the happiest person in the world."
                </p>

                {respondMutation.isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 p-8 rounded-[2rem] border-2 border-primary/10"
                  >
                    <p className="text-2xl font-medium text-primary mb-2">
                      Message sent! 💌
                    </p>
                    <p className="text-muted-foreground">
                      I love you so much!
                    </p>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                      <FormField
                        control={form.control}
                        name="responderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/70 font-medium">Your Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="My Valentine..." 
                                className="bg-white rounded-2xl border-2 border-primary/5 focus:border-primary/40 h-14"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/70 font-medium">Sweet Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Write something sweet back..." 
                                className="bg-white rounded-2xl border-2 border-primary/5 focus:border-primary/40 min-h-[140px] resize-none p-4"
                                {...field} 
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={respondMutation.isPending}
                        className="w-full h-16 text-xl rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3"
                      >
                        {respondMutation.isPending ? "Sending..." : (
                          <>Send My Love <Send size={22} /></>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-sm">
                <Camera size={18} className="text-primary" />
                <p className="text-sm text-muted-foreground font-medium">
                  Screen capture this and send it to me!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
