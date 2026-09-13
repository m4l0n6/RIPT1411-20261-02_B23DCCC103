import { useState } from "react";
import {
  AccordionContext,
  useAccordionContext,
} from "./AccordionContext";

interface AccordionProps {
  children: React.ReactNode;
  defaultValue?: string | null;
}

interface ItemProps {
  value: string;
  children: React.ReactNode;
}

interface TriggerProps {
  children: React.ReactNode;
  value: string;
}

interface ContentProps {
  children: React.ReactNode;
  value: string;
}

// ====================
// Accordion
// ====================

function Accordion({
  children,
  defaultValue = null,
}: AccordionProps) {
  const [value, setValue] = useState<string | null>(
    defaultValue
  );

  return (
    <AccordionContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      <div className="accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ====================
// Accordion.Item
// ====================

function Item({ children }: ItemProps) {
  return (
    <div className="accordion-item">
      {children}
    </div>
  );
}

// ====================
// Accordion.Trigger
// ====================

function Trigger({ children, value }: TriggerProps) {
  const { value: activeValue, setValue } =
    useAccordionContext();

  const isActive = activeValue === value;

  const handleClick = () => {
    if (isActive) {
      setValue(null);
    } else {
      setValue(value);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={isActive ? "active" : ""}
    >
      {children}
    </button>
  );
}

// ====================
// Accordion.Content
// ====================

function Content({ children, value }: ContentProps) {
  const { value: activeValue } =
    useAccordionContext();

  if (activeValue !== value) {
    return null;
  }

  return (
    <div className="accordion-content">
      {children}
    </div>
  );
}

// ====================
// Compound Component
// ====================

Accordion.Item = Item;
Accordion.Trigger = Trigger;
Accordion.Content = Content;

export default Accordion;