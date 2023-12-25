/** @format */

import { ComponentProps } from './component-props';
import { HtmlParserFunc } from './html-parser-func';
import { Selector } from './selector';
import { TypedProps } from './typed-props';

export type ComponentInit<Props extends ComponentProps = any, S extends string | never = never> = {
    template: (parser: HtmlParserFunc, props: TypedProps<Props>) => ReturnType<HtmlParserFunc>;
    selector?: S extends string ? Selector<S> : never;
};
