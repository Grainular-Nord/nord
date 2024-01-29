/** @format */

import { Directive } from '../../types';
import { createDirective } from './create-directive';

export type SuspenseDirective<T> = {
    then: (template: (awaited: T) => NodeList) => Directive<Text> & {
        else: (template: NodeList) => Directive<Text> & {
            catch: (template: (error: unknown) => NodeList) => Directive<Text>;
        };
        catch: (template: (error: unknown) => NodeList) => Directive<Text> & {
            else: (template: NodeList) => Directive<Text>;
        };
    };
};

/**
 * This directive allows for the declarative handling of asynchronous operations within a template.
 * The directive provides `then`, `else`, and `catch` methods to handle the
 * resolved value, loading state, and any errors respectively.
 *
 * @param {Promise<T>} promise - The Promise to be handled.`.
 * @returns {SuspenseDirective<T>} A `SuspenseDirective` object with `then`, `else`, and `catch` methods.
 *
 * - The `then` method takes a template function that receives the awaited value from the promise and returns a NodeList.
 * - The `else` method takes a NodeList that defines the content to display while the promise is unresolved.
 * - The `catch` method takes a template function that is invoked in case of an error, with the error as an argument.
 *
 * Each of these methods returns a Directive that can be used to chain further `else` or `catch` handling.
 */

export const suspend = <T>(promise: Promise<T>): SuspenseDirective<T> => {
    let promiseTemplate: ((awaited: T) => NodeList) | null;
    let errorTemplate: ((error: unknown) => NodeList) | null;
    let elseNodes: NodeList | null;
    // Directive to execute a error fallback
    const setErrorTemplate = (template: (error: unknown) => NodeList) => {
        errorTemplate = template;
        return setContentDirective;
    };
    const setElseTemplate = (template: NodeList) => {
        elseNodes = template;
        return setContentDirective;
    };

    const marker = document.createComment(`[Suspend]`);
    let currentNodes: Node[] = [];

    const replaceNodes = (root: HTMLElement | null, nodes: Node[]) => {
        currentNodes.forEach((node) => {
            root?.removeChild(node);
        });
        nodes.forEach((node) => {
            root?.insertBefore(node, marker.nextElementSibling);
        });
        currentNodes = [...nodes];
    };

    const setContentDirective = createDirective(
        (node: Text) => {
            // Set the initial fallback node
            node.replaceWith(marker);
            const root = marker.parentElement;
            if (elseNodes) {
                replaceNodes(root, [...elseNodes]);
            }

            promise
                .then((result) => {
                    replaceNodes(root, [...promiseTemplate!(result)]);
                })
                .catch((error: unknown) => {
                    if (!errorTemplate) {
                        return;
                    }

                    replaceNodes(root, [...errorTemplate(error)]);
                });
        },
        { nodeType: 'Text' }
    );

    Object.defineProperties(setContentDirective, {
        else: {
            value: setElseTemplate,
            writable: false,
        },
        catch: {
            value: setErrorTemplate,
            writable: false,
        },
    });

    // Return the `then` directive
    return {
        then: (template: (awaited: T) => NodeList) => {
            promiseTemplate = template;
            return setContentDirective;
        },
    } as SuspenseDirective<T>;
};
