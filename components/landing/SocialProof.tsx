export function SocialProof() {
  return (
    <section className="py-12 border-y border-white/5 bg-slate-900/30">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-sm text-slate-500 mb-8">
          Trusted by teams at
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale">
          {["Acme Corp", "TechFlow", "DataSync", "CloudBase", "NovaSoft"].map(
            (brand) => (
              <span
                key={brand}
                className="text-lg font-bold text-white tracking-wide"
              >
                {brand}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
