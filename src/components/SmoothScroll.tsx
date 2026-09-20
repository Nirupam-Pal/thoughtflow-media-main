import { useEffect } from "react";
import { startSmoothScroll } from "@/lib/smooth-scroll";

/** Mounts the app-wide smooth scroller once. Renders nothing. */
const SmoothScroll = () => {
  useEffect(() => startSmoothScroll(), []);
  return null;
};

export default SmoothScroll;
