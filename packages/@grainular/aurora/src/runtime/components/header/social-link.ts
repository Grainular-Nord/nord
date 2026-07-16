import type { ComponentFragment } from '@grainular/nord';
import type { AuroraSocialLink } from '../../../lib/config/config';
import { isComponentFragment } from '../../lib/is-component-fragment';
import { resolveIcon } from '../primitives/icon';
import { IconButton } from '../primitives/icon-button';

export const SocialLink = (item: AuroraSocialLink | ComponentFragment) => {
    if (isComponentFragment(item)) return item;
    return IconButton({ label: item.label, href: item.link, external: true, icon: resolveIcon(item.icon) });
};
