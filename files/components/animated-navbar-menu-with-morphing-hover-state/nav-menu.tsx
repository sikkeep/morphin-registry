import { Easing, motion, Transition } from "framer-motion";

const navItems = [
  {
    label: "Expertises",
    href: "/",
  },
  {
    label: "Work",
    href: "/about",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function NavDemo() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#faf4ec]">
      <nav className="flex items-center justify-center bg-white rounded-lg p-1">
        <ul className="flex items-center md:gap-4 gap-1 min-h-10">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}

const SPRING_CONFIG_TEXT = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 1.3,
} as Transition;

const EASE_CUBIC_CONFIG = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as Easing,
} as Transition;

function NavItem({ item }: { item: (typeof navItems)[0] }) {
  return (
    <li className="text-xs md:text-base font-semibold">
      <motion.a
        href={item.href}
        className="relative px-2 py-2 rounded-md overflow-hidden block"
        initial="initial"
        whileHover="hover"
        variants={{
          initial: {},
          hover: {},
        }}
      >
        <span className="relative text-transparent">{item.label}</span>

        <motion.span
          className="z-2 absolute inset-0 w-full h-full flex items-center justify-center"
          initial={{
            y: 0,
            scale: 1,
            rotate: 0,
          }}
          variants={{
            hover: {
              y: -100,
              scale: 0.5,
              rotate: -30,
            },
          }}
          transition={SPRING_CONFIG_TEXT}
        >
          {item.label}
        </motion.span>

        <motion.span
          className="absolute inset-0 bg-orange-500 w-full h-full scale-x-150 z-1 overflow-hidden"
          initial={{
            y: 100,
            rotate: -40,
          }}
          variants={{
            hover: {
              y: 0,
              rotate: 0,
            },
          }}
          transition={EASE_CUBIC_CONFIG}
        >
          <motion.span
            className="absolute inset-0 bg-neutral-900 w-full h-full"
            initial={{
              y: 150,
              rotate: -60,
            }}
            variants={{
              hover: {
                y: 0,
                rotate: 0,
              },
            }}
            transition={EASE_CUBIC_CONFIG}
          ></motion.span>
        </motion.span>

        <motion.span
          className="z-2 absolute inset-0 flex items-center justify-center text-white"
          initial={{
            y: 180,
            rotate: -60,
            scale: 0.5,
          }}
          variants={{
            hover: {
              y: 0,
              rotate: 0,
              scale: 1,
            },
          }}
          transition={SPRING_CONFIG_TEXT}
        >
          {item.label}
        </motion.span>
      </motion.a>
    </li>
  );
}
