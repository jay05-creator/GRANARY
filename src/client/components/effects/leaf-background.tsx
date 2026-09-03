import { motion } from "motion/react";

/**
 * Scattered faded leaf SVGs as a subtle decorative background.
 * Pure CSS/SVG — no external images needed.
 */
export function LeafBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient orbs (existing depth) */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-emerald-600/5 blur-3xl" />

      {/* Scattered leaves */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Leaf 1 — top-left, large */}
        <motion.g
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.06, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <path
            d="M120 80 C140 40, 200 20, 220 60 C240 100, 180 140, 160 120 C140 100, 100 120, 120 80Z"
            fill="currentColor"
            className="text-emerald-600"
          />
          <path
            d="M165 75 L185 95"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-emerald-700"
            opacity={0.4}
          />
        </motion.g>

        {/* Leaf 2 — top-right */}
        <motion.g
          initial={{ opacity: 0, rotate: 15 }}
          animate={{ opacity: 0.05, rotate: 12 }}
          transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
        >
          <path
            d="M1250 120 C1270 70, 1330 50, 1340 90 C1350 130, 1290 170, 1270 145 C1250 120, 1230 170, 1250 120Z"
            fill="currentColor"
            className="text-emerald-500"
          />
          <path
            d="M1290 100 L1310 120"
            stroke="currentColor"
            strokeWidth="0.7"
            className="text-emerald-600"
            opacity={0.35}
          />
        </motion.g>

        {/* Leaf 3 — mid-left */}
        <motion.g
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 0.04, rotate: -15 }}
          transition={{ duration: 2.2, delay: 0.6, ease: "easeOut" }}
        >
          <path
            d="M60 450 C80 400, 140 380, 150 420 C160 460, 100 500, 85 475 C70 450, 40 500, 60 450Z"
            fill="currentColor"
            className="text-emerald-700"
          />
          <path
            d="M100 440 L115 465"
            stroke="currentColor"
            strokeWidth="0.6"
            className="text-emerald-800"
            opacity={0.3}
          />
        </motion.g>

        {/* Leaf 4 — right side, mid */}
        <motion.g
          initial={{ opacity: 0, rotate: 25 }}
          animate={{ opacity: 0.05, rotate: 20 }}
          transition={{ duration: 2.8, delay: 0.4, ease: "easeOut" }}
        >
          <path
            d="M1350 480 C1370 430, 1420 410, 1430 450 C1440 490, 1380 520, 1365 500 C1350 480, 1330 530, 1350 480Z"
            fill="currentColor"
            className="text-emerald-500"
          />
        </motion.g>

        {/* Leaf 5 — bottom-left */}
        <motion.g
          initial={{ opacity: 0, rotate: -5 }}
          animate={{ opacity: 0.06, rotate: -8 }}
          transition={{ duration: 2.4, delay: 0.8, ease: "easeOut" }}
        >
          <path
            d="M200 750 C220 700, 280 680, 290 720 C300 760, 240 790, 225 770 C210 750, 180 800, 200 750Z"
            fill="currentColor"
            className="text-emerald-600"
          />
          <path
            d="M245 735 L260 760"
            stroke="currentColor"
            strokeWidth="0.7"
            className="text-emerald-700"
            opacity={0.35}
          />
        </motion.g>

        {/* Leaf 6 — bottom-right */}
        <motion.g
          initial={{ opacity: 0, rotate: 30 }}
          animate={{ opacity: 0.04, rotate: 25 }}
          transition={{ duration: 2.6, delay: 1.0, ease: "easeOut" }}
        >
          <path
            d="M1180 780 C1200 730, 1260 710, 1270 750 C1280 790, 1220 820, 1200 800 C1180 780, 1160 830, 1180 780Z"
            fill="currentColor"
            className="text-emerald-500"
          />
        </motion.g>

        {/* Leaf 7 — center-left, small */}
        <motion.g
          initial={{ opacity: 0, rotate: 10 }}
          animate={{ opacity: 0.035, rotate: 8 }}
          transition={{ duration: 2.1, delay: 1.2, ease: "easeOut" }}
        >
          <path
            d="M350 300 C365 270, 400 260, 405 285 C410 310, 380 330, 370 318 C360 306, 335 330, 350 300Z"
            fill="currentColor"
            className="text-emerald-700"
          />
        </motion.g>

        {/* Leaf 8 — top-center, small */}
        <motion.g
          initial={{ opacity: 0, rotate: -12 }}
          animate={{ opacity: 0.04, rotate: -10 }}
          transition={{ duration: 2.3, delay: 0.5, ease: "easeOut" }}
        >
          <path
            d="M700 50 C715 20, 750 10, 755 35 C760 60, 730 80, 720 65 C710 50, 685 80, 700 50Z"
            fill="currentColor"
            className="text-emerald-600"
          />
        </motion.g>

        {/* Leaf 9 — bottom-center */}
        <motion.g
          initial={{ opacity: 0, rotate: 18 }}
          animate={{ opacity: 0.035, rotate: 15 }}
          transition={{ duration: 2.7, delay: 0.9, ease: "easeOut" }}
        >
          <path
            d="M800 820 C820 770, 870 755, 875 790 C880 825, 840 850, 825 835 C810 820, 780 860, 800 820Z"
            fill="currentColor"
            className="text-emerald-500"
          />
        </motion.g>

        {/* Leaf 10 — right-center, tiny */}
        <motion.g
          initial={{ opacity: 0, rotate: -8 }}
          animate={{ opacity: 0.03, rotate: -5 }}
          transition={{ duration: 2.0, delay: 1.4, ease: "easeOut" }}
        >
          <path
            d="M1100 350 C1110 325, 1135 318, 1138 338 C1141 358, 1120 372, 1112 362 C1104 352, 1090 375, 1100 350Z"
            fill="currentColor"
            className="text-emerald-600"
          />
        </motion.g>
      </svg>
    </div>
  );
}
