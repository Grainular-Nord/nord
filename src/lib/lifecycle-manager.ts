/** @format */

import { LifecycleRequest } from '../types/lifecycle-request';

const createLifecycleManager = () => {
    const trackedMounts: Array<LifecycleRequest> = [];
    const trackedUnmounts: Array<LifecycleRequest> = [];
    const mutationObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            // check if the added node is included in a trackedMounts entry
            for (const [entry, idx] of trackedMounts.map((entry, i) => [entry, i] as [LifecycleRequest, number])) {
                const addedNodes = [...mutation.addedNodes];
                const matchedNodes = entry.nodesToObserve.filter((node) => !addedNodes.includes(node));
                if (matchedNodes) {
                    entry.nodesToObserve = matchedNodes;
                    if (entry.nodesToObserve.length === 0) {
                        entry.handler();
                        trackedMounts.splice(idx, 1);
                    }
                }
            }

            // check if the removed node is included in a trackedUnmounts entry
            for (const [entry, idx] of trackedUnmounts.map((entry, i) => [entry, i] as [LifecycleRequest, number])) {
                const removedNodes = [...mutation.removedNodes];
                const matchedNodes = entry.nodesToObserve.filter((node) => !removedNodes.includes(node));
                if (matchedNodes) {
                    entry.nodesToObserve = matchedNodes;
                    if (entry.nodesToObserve.length === 0) {
                        entry.handler();
                        trackedUnmounts.splice(idx, 1);
                    }
                }
            }
        }
    });

    const trackOnCreate = ({ nodesToObserve, handler }: LifecycleRequest) => {
        trackedMounts.push({ nodesToObserve, handler });
    };
    const trackOnDestroy = ({ nodesToObserve, handler }: LifecycleRequest) => {
        trackedUnmounts.push({ nodesToObserve, handler });
    };

    const observe = (target: Element) => mutationObserver.observe(target, { childList: true, subtree: true });

    return { trackOnCreate, trackOnDestroy, observe };
};

export const lifecycleManager = createLifecycleManager();
