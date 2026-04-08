import type { ComponentFragment } from '@grainular/nord';
import type { AppProps } from '../app';

export type LayoutProps = Omit<AppProps, 'config'>;
export type LayoutComponent = (props: LayoutProps) => ComponentFragment;
