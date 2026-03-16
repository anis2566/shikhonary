import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const BLOCK_TRIGGERS = ["\\lim", "\\int", "\\sum", "\\prod"];

function shouldRenderBlock(math: string) {
  return BLOCK_TRIGGERS.some((cmd) => math.includes(cmd));
}

export function parseMathString(input: string): React.ReactNode[] {
  const parts = input.split(/\\\((.*?)\\\)/s);

  return parts.map((part, index) => {
    // Normal text
    if (index % 2 === 0) return part;

    const math = part.trim();

    // Block math (limits below)
    if (shouldRenderBlock(math)) {
      return <BlockMath key={index} math={math} />;
    }

    // Inline math
    return <InlineMath key={index} math={math} />;
  });
}
