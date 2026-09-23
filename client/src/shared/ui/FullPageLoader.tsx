const FullPageLoader = () => {
  return (
    <div className="min-h-dvh bg-background text-text-primary">
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-border/60">
        <div
          className="h-full w-2/5 bg-primary"
          style={{
            animation: "bantay-progress 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
      </div>

      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-sm font-semibold tracking-tight text-text-primary">
          Bantay PH
        </span>
      </div>

      <style>{`
        @keyframes bantay-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoader;