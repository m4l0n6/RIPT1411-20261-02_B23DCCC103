import { createContext, useContext } from "react";

interface AccordionContextType {
  value: string | null;
  setValue: (value: string | null) => void;
}

export const AccordionContext = createContext<AccordionContextType | null>(
  null,
);

export function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("Accordion components must be used inside Accordion");
  }

  return context;
}
