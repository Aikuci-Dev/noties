import type { Id } from "@noties/shared-schema";

type UseFormActionHandlers<TInput, TOutput> = {
  onSubmit: (values: TInput | TOutput) => Promise<void> | void;
  onSuccess?: (values: TInput | TOutput) => Promise<void> | void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};

export function useFormAction<TInput extends { id?: Id }, TOutput extends { id: Id }>(
  formRef: Ref<FormInstance<TInput, TOutput> | null>,
  handlers: UseFormActionHandlers<TInput, TOutput>,
) {
  const toast = useToast();

  const isSubmitting = ref(false);

  function reset() {
    formRef.value?.resetForm();
  }

  async function submit() {
    if (!formRef.value || isSubmitting.value) return;

    const result = await formRef.value.validateForm();
    if (!result) return;

    try {
      isSubmitting.value = true;
      await handlers.onSubmit(result);
      handlers.onSuccess?.(result);
    } catch (error) {
      if (handlers.onError) {
        handlers.onError(error);
      } else if (error instanceof Error) {
        toast.add({
          id: result.id,
          title: "Failed to perform this action",
          description: error.message,
          color: "error",
          type: "foreground",
        });
      } else {
        console.error("ERROR: ", error);
      }
    } finally {
      isSubmitting.value = false;
      handlers.onSettled?.();
    }
  }

  return {
    isSubmitting: readonly(isSubmitting),
    submit,
    reset,
  };
}
