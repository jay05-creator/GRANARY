import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/client/cn";

/** React Bits-inspired SplitText: word stagger with blur + rise. */
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={cn("flex flex-wrap gap-x-[0.28em]", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block pb-1"
          initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.055,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
