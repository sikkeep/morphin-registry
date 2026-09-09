import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

export type NetworkId = "ethereum" | "base" | "polygon" | "optimism"

type NetworkIconProps = {
  network: NetworkId
  className?: string
  animated?: boolean
}

const networkColors: Record<NetworkId, string> = {
  ethereum: "var(--network-ethereum)",
  base: "var(--network-base)",
  polygon: "var(--network-polygon)",
  optimism: "var(--network-optimism)",
}

function NetworkMark({ network }: { network: NetworkId }) {
  if (network === "ethereum") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path fill="#fff" d="m16 4 7.1 12.1L16 20.3 8.9 16.1 16 4Z" />
        <path fill="#fff" fillOpacity=".88" d="m16 21.8 7.1-4.1L16 28 8.9 17.7l7.1 4.1Z" />
        <path fill="#cbd1d5" d="M16 20.3V4L8.9 16.1l7.1 4.2Z" />
      </svg>
    )
  }

  if (network === "base") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path
          fill="#fff"
          d="M15.7 26.1a10.1 10.1 0 1 0-9.8-12.5h14.7v4.8H5.9a10.1 10.1 0 0 0 9.8 7.7Z"
        />
      </svg>
    )
  }

  if (network === "polygon") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.2"
          d="m19.6 11.8-4.1-2.4a3.3 3.3 0 0 0-3.3 0l-4.3 2.5a3.3 3.3 0 0 0 0 5.7l4.1 2.3a3.3 3.3 0 0 0 3.3 0l4.5-2.6m-7.4 2.9 4.1 2.4a3.3 3.3 0 0 0 3.3 0l4.3-2.5a3.3 3.3 0 0 0 0-5.7L20 12a3.3 3.3 0 0 0-3.3 0l-4.5 2.6"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path
        fill="#fff"
        d="M8.1 20.8c0-4.8 3.8-9.2 9-10.2l.9 4.2c-3.1.6-5.2 3.2-5.2 6h-4.7Zm6.8-10.1h8.9v4.2h-8.9v-4.2Zm0 6.4h6.7v4.2h-6.7v-4.2Z"
      />
    </svg>
  )
}

export function NetworkIcon({ network, className, animated = false }: NetworkIconProps) {
  return (
    <motion.span
      animate={{ opacity: 1, scale: 1 }}
      exit={animated ? { opacity: 0, scale: 0.55 } : undefined}
      initial={animated ? { opacity: 0, scale: 0.55 } : false}
      layout
      transition={{ type: "spring", stiffness: 420, damping: 31, mass: 0.65 }}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full shadow-[var(--network-icon-shadow)] [&>svg]:size-[72%]",
        className,
      )}
      style={{ backgroundColor: networkColors[network] }}
    >
      <NetworkMark network={network} />
    </motion.span>
  )
}

export function AllNetworksIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 grid-cols-2 place-items-center gap-0.5", className)}
    >
      <NetworkIcon className="size-full" network="ethereum" />
      <NetworkIcon className="size-full" network="base" />
      <NetworkIcon className="size-full" network="polygon" />
      <NetworkIcon className="size-full" network="optimism" />
    </span>
  )
}

export function SelectedNetworksIcon({ selected }: { selected: NetworkId[] | "all" }) {
  const items: NetworkId[] = selected === "all"
    ? ["ethereum", "base", "polygon", "optimism"]
    : selected

  return (
    <span className="relative size-6 shrink-0">
      <AnimatePresence initial={false}>
        {items.map((network, index) => {
          const count = items.length
          return (
            <NetworkIcon
              animated
              className={cn(
                "absolute",
                count === 1 && "left-px top-px size-[1.375rem]",
                count === 2 && "size-[1.0625rem]",
                count === 2 && index === 0 && "left-0 top-0",
                count === 2 && index === 1 && "bottom-0 right-0",
                count >= 3 && "size-[0.6875rem]",
                count >= 3 && index === 0 && "left-px top-px",
                count >= 3 && index === 1 && "right-px top-px",
                count >= 3 && index === 2 && "bottom-px left-px",
                count >= 3 && index === 3 && "bottom-px right-px",
              )}
              key={network}
              network={network}
            />
          )
        })}
      </AnimatePresence>
    </span>
  )
}
