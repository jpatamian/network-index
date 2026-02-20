import { useState } from "react";

export function useFormData<T extends Record<string, string>>(initial: T) {
  const [formData, setFormData] = useState<T>(initial);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return { formData, setFormData, handleChange };
}
