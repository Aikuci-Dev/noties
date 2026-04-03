export interface FormInstance<TInput, TOutput> {
  validateForm(): Promise<TInput | TOutput | false> | undefined;
  resetForm(): void;
}
