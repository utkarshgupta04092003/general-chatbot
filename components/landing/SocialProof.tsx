export function SocialProof() {
  return (
    <section className="py-12 border-y border-border bg-card/30">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by teams at
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale">
          {["Acme Corp", "TechFlow", "DataSync", "CloudBase", "NovaSoft"].map(
            (brand) => (
              <span
                key={brand}
                className="text-lg font-bold text-foreground tracking-wide"
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
