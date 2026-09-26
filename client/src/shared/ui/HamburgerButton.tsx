import { LuMenu } from "react-icons/lu";

const HamburgerButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open sidebar"
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 lg:hidden"
  >
    <LuMenu size={20} />
  </button>
);

export default HamburgerButton