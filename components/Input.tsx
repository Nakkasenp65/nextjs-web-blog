import React from "react";

interface InputProps {
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label?: string;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  name,
  label,
  placeholder,
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="w-full bg-muted/50 border border-border rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
};

export default Input;
