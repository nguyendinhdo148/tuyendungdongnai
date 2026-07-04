// components/ui/custom-tooltip.tsx
import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

interface CustomTooltipProps {
  children: ReactNode;
  content: string;
}

export const CustomTooltip = ({ children, content }: CustomTooltipProps) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-sm rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-md"
            side="top"
            sideOffset={4}
          >
            {content}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
