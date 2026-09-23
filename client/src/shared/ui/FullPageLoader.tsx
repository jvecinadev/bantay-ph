import Logo from "../../assets/logo.png";

const FullPageLoader = () => {
  return (
    <div className="min-h-dvh bg-background text-text-primary">
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-border/60">
        <div
          className="h-full w-2/5 bg-primary"
          style={{
            animation:
              "bantay-progress 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
      </div>

      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6">
        <img
          src={Logo}
          alt="Bantay PH"
          className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          draggable={false}
        />

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-text-primary">
            Bantay PH
          </span>

          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
            <span className="inline-flex gap-1">
              <span
                className="h-1 w-1 rounded-full bg-current"
                style={{ animation: "bantay-dot 1.2s ease-in-out infinite" }}
              />
              <span
                className="h-1 w-1 rounded-full bg-current"
                style={{
                  animation: "bantay-dot 1.2s ease-in-out infinite 0.15s",
                }}
              />
              <span
                className="h-1 w-1 rounded-full bg-current"
                style={{
                  animation: "bantay-dot 1.2s ease-in-out infinite 0.3s",
                }}
              />
            </span>
            <span>Loading</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bantay-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @keyframes bantay-dot {
          0%, 80%, 100% { opacity: 0.35; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoader;