export type BaseMenuItem = {
  label: string;
  icon?: string | false;
  isActive?: boolean;
  onClick?: (event: MouseEvent, value: BaseMenuItem) => void;
  children?: BaseMenuItem[];
};

export const setActive = <T extends BaseMenuItem>(items: T[], value: T, shouldPropagate?: boolean) => {
  items.forEach((item) => {
    if (item.children) {
      setActive(item.children, value, shouldPropagate);
      if (shouldPropagate) item.isActive = item.children.some((child) => child.isActive);
    } else item.isActive = item === value;
  });
};
