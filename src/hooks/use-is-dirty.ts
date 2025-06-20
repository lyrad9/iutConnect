import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

/**
 * Custom hook that tracks if a form has been changed (is dirty)
 * @param form The react-hook-form useForm instance
 * @returns boolean indicating if the form is dirty
 */
export function useIsDirty(form: UseFormReturn<any>) {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const subscription = form.watch(() => {
      // Check if any field is dirty
      setIsDirty(form.formState.isDirty);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return isDirty;
}
