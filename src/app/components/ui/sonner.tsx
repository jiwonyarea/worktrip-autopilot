"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: 'white',
          color: '#0A0A0A',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        },
        classNames: {
          success: 'text-[#0A0A0A]',
          error: 'text-[#0A0A0A]',
          warning: 'text-[#0A0A0A]',
          info: 'text-[#0A0A0A]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
