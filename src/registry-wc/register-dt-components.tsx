import {
  applyPolyfills,
  defineCustomElements,
  JSX as LocalJSX,
} from "@npm-bbta/bbog-dig-dt-webcomponents-lib/loader";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type StencilProps<T> = {
  [P in keyof T]?: Omit<T[P], "ref"> | HTMLAttributes<T>;
};

type ReactProps<T> = {
  [P in keyof T]?: DetailedHTMLProps<HTMLAttributes<T[P]>, T[P]>;
};

type StencilToReact<
  T = LocalJSX.IntrinsicElements,
  U = HTMLElementTagNameMap
> = StencilProps<T> & ReactProps<U>;

declare global {
  export namespace JSX {
    // tslint:disable-next-line
    interface IntrinsicElements extends StencilToReact {}
  }
}

applyPolyfills().then(() =>
  defineCustomElements(window, {
    transformTagName: (tagName: any) => `cont-rlb-${tagName}`,
  } as any)
);
