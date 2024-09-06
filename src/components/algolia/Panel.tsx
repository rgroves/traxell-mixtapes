import {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  ReactNode,
} from "react";

import { cx } from "../../utils/general";

export type PanelProps = ComponentProps<"div"> &
  PropsWithChildren<{
    header?: string | ReactNode;
    footer?: string | ReactNode;
    classNames?: Partial<IPanelClassNames>;
  }>;

export interface IPanelClassNames {
  root: string;
  header: string;
  body: string;
  footer: string;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function _Panel(
  {
    children,
    header,
    footer,
    className,
    classNames = {},
    ...props
  }: PanelProps,
  ref
) {
  return (
    <div
      {...props}
      className={cx("ais-Panel", classNames.root, className)}
      ref={ref}
    >
      {header && (
        <div className={cx("ais-Panel-header", classNames.header)}>
          {header}
        </div>
      )}
      <div className={cx("ais-Panel-body", classNames.body)}>{children}</div>
      {footer && (
        <div className={cx("ais-Panel-footer", classNames.footer)}>
          {footer}
        </div>
      )}
    </div>
  );
});
