import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CarouselApi } from "@/components/ui/carousel";

interface CarouselDotsProps {
  api: CarouselApi | undefined;
  className?: string;
}

/** Compact pill-style pagination bar shared across the site's carousels. */
const CarouselDots = ({ api, className }: CarouselDotsProps) => {
  const [snaps, setSnaps] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSnaps(api.scrollSnapList());
      setCurrent(api.selectedScrollSnap());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  if (snaps.length <= 1) return null;

  return (
    <div className={cn("mt-6 flex items-center justify-center gap-2", className)}>
      {snaps.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === current}
          onClick={() => api?.scrollTo(i)}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === current
              ? "w-6 bg-foreground"
              : "w-1.5 bg-white/25 hover:bg-white/40"
          )}
        />
      ))}
    </div>
  );
};

export default CarouselDots;
