import { APP_NAME } from "@/lib/config";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Loved by teams worldwide</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Chen",
              role: "Head of CX at TechFlow",
              content:
                "We reduced support tickets by 60% in the first month. Setup took literally 3 minutes.",
              rating: 5,
            },
            {
              name: "Marcus Rodriguez",
              role: "Founder at DataSync",
              content: `Our customers love getting instant answers 24/7. ${APP_NAME} paid for itself in week one.`,
              rating: 5,
            },
            {
              name: "Emily Watson",
              role: "Product Lead at Acme Corp",
              content:
                "I was skeptical about AI accuracy, but it answers questions from our docs perfectly.",
              rating: 5,
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-slate-900 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div>
                <div className="font-medium text-sm">{testimonial.name}</div>
                <div className="text-xs text-slate-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
