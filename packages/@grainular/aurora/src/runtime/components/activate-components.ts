import { mount, type PureComponent } from '@grainular/nord';
import type { AuroraComponentDefinition, AuroraComponentModule } from '../../lib/config/config';
import { deserializeComponentProps } from './component-host';

const componentSelector = '[data-aurora-component]';

export const activateComponents = async (definitions: AuroraComponentDefinition[]) => {
    const components = new Map(definitions.map((definition) => [definition.name, definition]));
    const modules = new Map<string, Promise<AuroraComponentModule>>();

    const directHosts = (root: ParentNode) =>
        Array.from(root.querySelectorAll<HTMLElement>(componentSelector)).filter((element) => {
            const ancestor = element.parentElement?.closest<HTMLElement>(componentSelector);
            return !ancestor || ancestor === root;
        });

    const activateWithin = async (root: ParentNode): Promise<void> => {
        await Promise.all(
            directHosts(root).map(async (element) => {
                if (element.hasAttribute('data-aurora-active')) return;

                const name = element.dataset.auroraComponent;
                const definition = name ? components.get(name) : undefined;
                if (definition?.client) {
                    const props = deserializeComponentProps(element.dataset.auroraComponentProps ?? '%7B%7D');
                    let module = modules.get(definition.name);
                    if (!module) {
                        module = definition.component();
                        modules.set(definition.name, module);
                    }

                    const { default: component } = await module;
                    const application = (() => component(props)) as PureComponent;

                    mount(application, { to: element });
                    element.dataset.auroraActive = '';
                }

                // Mounting an outer island replaces its SSR subtree. Scan the
                // resulting DOM so any newly-created nested hosts activate next.
                await activateWithin(element);
            }),
        );
    };

    await activateWithin(document);
};
