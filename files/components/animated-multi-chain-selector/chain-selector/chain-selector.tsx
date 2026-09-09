import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import {
  AllNetworksIcon,
  NetworkIcon,
  SelectedNetworksIcon,
  type NetworkId,
} from "@/components/chain-selector/network-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const networks: Array<{ id: NetworkId; label: string }> = [
  { id: "ethereum", label: "Ethereum" },
  { id: "base", label: "Base" },
  { id: "polygon", label: "Polygon" },
  { id: "optimism", label: "Optimism" },
]

const easeOut = [0.22, 1, 0.36, 1] as const

export type ChainSelection = NetworkId[] | "all"

type ChainSelectorProps = {
  className?: string
  defaultOpen?: boolean
  defaultValue?: ChainSelection
  onValueChange?: (value: ChainSelection) => void
}

function AnimatedCheck({ selected }: { selected: boolean }) {
  return (
    <motion.span
      animate={{
        backgroundColor: selected ? "var(--selector-check)" : "transparent",
        borderColor: selected ? "var(--selector-check)" : "var(--selector-check-outline)",
        scale: selected ? 1 : 0.98,
      }}
      aria-hidden="true"
      className="grid size-[1.375rem] shrink-0 place-items-center rounded-full border-[1.5px]"
      initial={false}
      transition={{ type: "spring", stiffness: 430, damping: 28, mass: 0.55 }}
    >
      <svg className="size-3.5" viewBox="0 0 28 28">
        <motion.path
          animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          d="m7.1 14.2 4.4 4.4 9.6-10"
          fill="none"
          initial={false}
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
          transition={{ duration: 0.25, ease: easeOut }}
        />
      </svg>
    </motion.span>
  )
}

function SelectorChevron({ open }: { open: boolean }) {
  return (
    <motion.span
      animate={open ? "open" : "closed"}
      aria-hidden="true"
      className="ml-auto flex w-4 flex-col items-center gap-px"
      initial={false}
    >
      <motion.svg
        className="h-2 w-3.5"
        variants={{ closed: { y: 1, opacity: 0.6 }, open: { y: -1, opacity: 0.82 } }}
        viewBox="0 0 28 14"
      >
        <path
          d="M3 11 14 3l11 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.2"
        />
      </motion.svg>
      <motion.svg
        className="h-2 w-3.5"
        variants={{ closed: { y: -1, opacity: 0.6 }, open: { y: 1, opacity: 0.82 } }}
        viewBox="0 0 28 14"
      >
        <path
          d="m3 3 11 8 11-8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.2"
        />
      </motion.svg>
    </motion.span>
  )
}

function SelectionLabel({ selection }: { selection: ChainSelection }) {
  const label =
    selection === "all"
      ? "All Chains"
      : selection.length === 1
        ? networks.find(({ id }) => id === selection[0])?.label
        : `${selection.length} Chains`

  return (
    <span className="relative ml-2.5 h-6 flex-1 overflow-hidden text-left leading-6">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          className="absolute inset-x-0 top-0"
          exit={{ filter: "blur(2px)", opacity: 0, y: -6 }}
          initial={{ filter: "blur(2px)", opacity: 0, y: 6 }}
          key={label}
          transition={{ duration: 0.34, ease: easeOut }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function ChainSelector({
  className,
  defaultOpen = false,
  defaultValue = "all",
  onValueChange,
}: ChainSelectorProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [selection, setSelection] = useState<ChainSelection>(defaultValue)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [])

  const updateSelection = (next: ChainSelection) => {
    setSelection(next)
    onValueChange?.(next)
  }

  const toggleNetwork = (network: NetworkId) => {
    if (selection === "all") {
      updateSelection([network])
      return
    }

    const next = selection.includes(network)
      ? selection.filter((item) => item !== network)
      : [...selection, network]

    if (next.length === 0 || next.length === networks.length) {
      updateSelection("all")
      return
    }

    updateSelection(networks.map(({ id }) => id).filter((id) => next.includes(id)))
  }

  return (
    <div
      className={cn("relative w-[min(18.25rem,calc(100vw-1.5rem))]", className)}
      ref={rootRef}
    >
      <Button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        size="chainTrigger"
        variant="chainTrigger"
      >
        <SelectedNetworksIcon selected={selection} />
        <SelectionLabel selection={selection} />
        <SelectorChevron open={open} />
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-3 max-h-[calc(100vh-17.1vh-4rem)] w-full origin-top-left overflow-y-auto overscroll-contain rounded-[0.875rem] border border-selector-outline bg-selector-menu shadow-[var(--selector-menu-shadow)] transition-[background-color,border-color,box-shadow] duration-200 [scrollbar-width:none] motion-reduce:transition-none [&::-webkit-scrollbar]:hidden"
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            id={menuId}
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            role="listbox"
            transition={{ duration: 0.38, ease: easeOut }}
          >
            <Button
              aria-selected={selection === "all"}
              className="h-[3.25rem]"
              data-selected={selection === "all"}
              onClick={() => updateSelection("all")}
              role="option"
              size="chainOption"
              variant="chainOption"
            >
              <AnimatedCheck selected={selection === "all"} />
              <AllNetworksIcon className="size-6" />
              <span>All Chains</span>
            </Button>

            <div aria-hidden="true" className="mx-3.5 h-px bg-selector-divider" />

            {networks.map(({ id, label }) => {
              const selected = selection !== "all" && selection.includes(id)
              return (
                <Button
                  aria-selected={selected}
                  data-selected={selected}
                  key={id}
                  onClick={() => toggleNetwork(id)}
                  role="option"
                  size="chainOption"
                  variant="chainOption"
                >
                  <AnimatedCheck selected={selected} />
                  <NetworkIcon className="size-6" network={id} />
                  <span>{label}</span>
                </Button>
              )
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
