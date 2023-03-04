import type { ReactNode } from "react";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

interface ContextMenuContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement>;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const contextValue = {
    isOpen,
    setIsOpen,
    menuRef,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <ContextMenuContext.Provider value={contextValue}>
      {children}
    </ContextMenuContext.Provider>
  );
}

interface ContextMenuConsumerProps {
  children: (context: ContextMenuContextType) => ReactNode;
}

export function ContextMenuConsumer({
  children,
}: ContextMenuConsumerProps)  {
  const contextValue = useContext(ContextMenuContext);
  if (contextValue === null) {
    throw new Error(
      "ContextMenuConsumer must be used within a ContextMenuProvider"
    );
  }
  return children(contextValue);
};

interface ContextMenuTriggerProps {
  children: ReactNode;
  menu: ReactNode;
}

export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({
  children,
  menu,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { isOpen, setIsOpen, menuRef } = useContext(ContextMenuContext);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      {isOpen && (
        <div
          ref={menuRef}
          style={{ position: "absolute", top: position.y, left: position.x }}
        >
          {menu}
        </div>
      )}
    </>
  );
};

interface ContextMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  children,
  onClick,
}) => {
  const { setIsOpen } = useContext(ContextMenuContext);
  const handleClick = () => {
    setIsOpen(false);
    if (onClick) {
      onClick();
    }
  };
  return <div onClick={handleClick}>{children}</div>;
};
