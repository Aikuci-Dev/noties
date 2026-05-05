export const STATE_FLOATING_UI_ACTIVE_KEY = "floating-active" as const;

export const useFloatingUiActive = () => {
  return useState<string | null>(STATE_FLOATING_UI_ACTIVE_KEY, () => null);
};
export const setActiveFloatingUi = (id: string) => (useFloatingUiActive().value = id);
export const clearActiveFloatingUi = () => (useFloatingUiActive().value = null);
