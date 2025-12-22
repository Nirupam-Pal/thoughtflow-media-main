import { FlipWords } from "@/components/ui/FlipWords";

const HeroText = () => {
  const words = ["Solutions", "Strategies"];
  return (
    <span className="inline-block">
      <FlipWords
        words={words}
        className="font-bold text-primary text-5xl md:text-7xl lg:text-8xl"
      />
    </span>
  );
};

export default HeroText;
