import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Send, Check } from "lucide-react";
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

// Helper for "No" button escaping logic
const getRandomOffset = (current: number) => {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const distance = Math.floor(Math.random() * 100) + 50;
  return current + (distance * direction);
};

export default function Proposal() {
  const [accepted, setAccepted] = useState(false);
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
    setYesScale((prev) => Math.min(prev + 0.15, 3)); // Grow yes button
    setNoHoverCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    setAccepted(true);
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
        colors: ['#ff6b8b', '#ffb6c1', '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b8b', '#ffb6c1', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const onSubmit = (data: z.infer<typeof insertResponseSchema>) => {
    respondMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 100,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: -100,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          >
            <Heart size={Math.random() * 40 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-lg text-center z-10"
          >
            {/* Cute Mascot / Hero Image */}
            <motion.div 
              className="mb-8 relative inline-block"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              {/* Using a cute animated heart illustration */}
              <div className="w-48 h-48 mx-auto bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-xl shadow-primary/30">
                <Heart className="w-24 h-24 text-white fill-white animate-pulse" />
              </div>
              <div className="absolute -bottom-2 w-32 h-4 bg-black/10 blur-md rounded-[100%] left-1/2 -translate-x-1/2" />
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
              ) : "I've been waiting to ask you..."}
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
                onClick={handleNoHover} // Mobile support
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-full max-w-md z-10"
          >
            <Card className="border-2 border-primary/20 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-8 px-6 pb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
                </motion.div>

                <h2 className="text-4xl text-primary mb-2">
                  Yay! I knew it! ❤️
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  You just made me the happiest person ever.
                </p>

                {respondMutation.isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 p-6 rounded-2xl"
                  >
                    <p className="text-xl font-medium text-primary mb-2">
                      Message sent! 💌
                    </p>
                    <p className="text-muted-foreground">
                      Can't wait to see you!
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
                            <FormLabel className="text-base font-semibold text-foreground/80">Your Name (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your lovely name..." 
                                className="bg-white rounded-xl border-2 border-primary/10 focus:border-primary/50 text-lg py-6"
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
                            <FormLabel className="text-base font-semibold text-foreground/80">Send me a message?</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Write something sweet..." 
                                className="bg-white rounded-xl border-2 border-primary/10 focus:border-primary/50 text-lg min-h-[120px] resize-none"
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
                        className="w-full h-14 text-xl rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                      >
                        {respondMutation.isPending ? "Sending..." : (
                          <span className="flex items-center gap-2">
                            Send Love <Send size={20} />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {/* Post-acceptance memory link or extra content */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Screen capture this and send it to me! 📸
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
