import canUseDOM from '../canUseDOM';
import { useUID } from '../uniqueID';
import moveFocusInside, { focusInside, getFocusableIn } from 'focus-lock';
import React from 'react';

/** "safe" focus movement means that function wrapper tries
 * to detect focus war (when two focus locks are trying to
 * control focus recursively) and disables it for 10 seconds
 */
let focusMoveRequests: number[] = [];
let focusMoveDisabledUntil = 0;
const safeMoveFocusInside: typeof moveFocusInside = (...args) => {
  if (focusMoveDisabledUntil > Date.now()) return;
  focusMoveRequests.push(Date.now());
  if (focusMoveRequests.length > 10) {
    const timeBetweenCloseButNotNeighborFocusMoveRequests = Math.abs(
      focusMoveRequests[focusMoveRequests.length - 10] -
        focusMoveRequests[focusMoveRequests.length - 1],
    );
    if (timeBetweenCloseButNotNeighborFocusMoveRequests < 20) {
      focusMoveDisabledUntil = Date.now() + 10000;
      focusMoveRequests = [];
      console.error(
        '[useFocusLock] Probably the focus war was detected. It is a process when multiple browser focus control subjects are reacting to "blur" event on their element and are trying to get it back. Focus move function was disabled for 10 seconds. Probably your page has different focus lock systems. If you have multiple versions of Intergalactic components, updated them to the latest version.',
      );
      return;
    }
  }
  if (focusMoveRequests.length > 500) focusMoveRequests = focusMoveRequests.slice(-10);

  return moveFocusInside(...args);
};

const focusBordersConsumers = new Set();
const focusBordersRefs = { before: null, after: null } as {
  before: null | HTMLElement;

  after: null | HTMLElement;
};
const addBorders = () => {
  if (!focusBordersRefs.before) {
    focusBordersRefs.before = document.createElement('div');
    focusBordersRefs.before.setAttribute('tabindex', '0');
    focusBordersRefs.before.style.position = 'fixed';
    focusBordersRefs.before.dataset.id = '__intergalactic-focus-border-before';
    document.body.prepend(focusBordersRefs.before);
  }
  if (!focusBordersRefs.after) {
    focusBordersRefs.after = document.createElement('div');
    focusBordersRefs.after.setAttribute('tabindex', '0');
    focusBordersRefs.after.dataset.id = '__intergalactic-focus-border-after';
    focusBordersRefs.after.style.position = 'fixed';
    document.body.append(focusBordersRefs.after);
  }
};
const removeBorders = () => {
  focusBordersRefs.before?.remove();
  focusBordersRefs.after?.remove();
  focusBordersRefs.before = null;
  focusBordersRefs.after = null;
};
const areBordersPlacedCorrectly = () => {
  if (!focusBordersRefs.before || !focusBordersRefs.after) return true;
  if (document.body.children[0] !== focusBordersRefs.before) return false;
  if (document.body.children[document.body.children.length - 1] !== focusBordersRefs.after)
    return false;
  return true;
};
const useFocusBorders = (disabled?: boolean) => {
  const id = useUID('focus-borders-consumer');
  React.useEffect(() => {
    if (!disabled) {
      focusBordersConsumers.add(id);
    }

    if (!areBordersPlacedCorrectly()) removeBorders();
    if (focusBordersConsumers.size > 0) addBorders();

    return () => {
      focusBordersConsumers.delete(id);
      if (focusBordersConsumers.size === 0) removeBorders();
    };
  }, [id, disabled]);
};

/**
 * In some cases same page might contain different versions of components.
 * In such cases, we need to ensure that only one version of focus lock hook is used.
 * So, it's why we have `useFocusLockHook` function that is wrapped into `useFocusLock`.
 *
 * While evaluating this file code, we check if global focus lock hook is already defined.
 * If it's defined, we replace it ONLY if our version is higher and no components currently use it.
 * The last condition is very important because we are unable to replace React hook without reimplementing
 * React hooks lifecycle in some kind of wrapper.
 *
 * Such versions merging requires us to keep hook api backward compatible.
 * When hook logic changes, the variable `focusLockVersion` should be incremented.
 */
const focusLockVersion = 1;
const globalFocusLockHookKey = '__intergalactic_focus_lock_hook';

const focusLockAllTraps = new Set<HTMLElement>();
const focusLockUsedInMountedComponents = new Set<string>();
/** Focus master is a special mode in which focus lock might work.
 * Normally, focus lock hook allows user focus to move freely between
 * all active focus traps. When component provides `focusMaster=true`
 * parameter, it says that it doesn't want to share focus with other traps.
 * It is very useful for a big components like modals or side-bars that
 * also have some visual backdrop.
 * The last element in focus masters stack is considered as a current focus master.
 */
const focusMastersStack: HTMLElement[] = [];

const useFocusLockHook = (
  trapRef: React.RefObject<HTMLElement>,
  autoFocus: boolean,
  returnFocusTo: React.RefObject<HTMLElement> | null | 'auto',
  disabled = false,
  focusMaster = false,
) => {
  useFocusBorders(disabled);

  const autoTriggerRef = React.useRef<HTMLElement | null>(null);
  const lastUserInteractionRef = React.useRef<'mouse' | 'keyboard' | undefined>(undefined);

  const handleFocusIn = React.useCallback(
    (event: Event & { relatedTarget?: HTMLElement; target?: HTMLElement }) => {
      const focusCameFrom = event.relatedTarget;
      setTimeout(() => {
        if (!focusCameFrom) return;
        if (autoTriggerRef.current) return;
        autoTriggerRef.current = focusCameFrom;
      }, 0);
      if (lastUserInteractionRef.current === 'mouse') return;
      Promise.resolve().then(() => {
        if (!trapRef.current) return;
        const currentFocusMaster = focusMastersStack[focusMastersStack.length - 1];
        if (currentFocusMaster && currentFocusMaster !== trapRef.current) return;
        const trapNodes = currentFocusMaster
          ? [trapRef.current]
          : [trapRef.current, ...focusLockAllTraps];
        if (focusInside(trapNodes)) return;

        safeMoveFocusInside(trapRef.current, event.target);
      });
    },
    [],
  );
  const handleMouseEvent = React.useCallback(() => {
    lastUserInteractionRef.current = 'mouse';
  }, []);
  const handleKeyboardEvent = React.useCallback(() => {
    lastUserInteractionRef.current = 'keyboard';
  }, []);
  const returnFocus = React.useCallback(() => {
    const trapNode = trapRef.current!;
    if (!focusInside(trapNode)) return;
    if (typeof returnFocusTo === 'object' && returnFocusTo?.current) {
      const returnFocusNode = returnFocusTo?.current;
      setTimeout(() => safeMoveFocusInside(returnFocusNode, trapNode), 0);
    }
    if (returnFocusTo === 'auto' && autoTriggerRef.current) {
      const autoTrigger = autoTriggerRef.current;
      setTimeout(() => safeMoveFocusInside(autoTrigger, trapNode), 0);
    }
  }, [returnFocusTo]);
  React.useEffect(() => {
    if (typeof trapRef !== 'object' || trapRef === null) return;
    const node = trapRef.current;
    if (!node) return;
    focusLockAllTraps.add(node);
    return () => {
      if (!node) return;
      focusLockAllTraps.delete(node);
    };
  }, [trapRef]);
  React.useEffect(() => {
    if (typeof trapRef !== 'object' || trapRef === null) return;
    if (disabled) return;
    if (!canUseDOM()) return;
    if (!trapRef.current) return;

    if (focusMaster) {
      focusMastersStack.push(trapRef.current);
    }

    return () => {
      if (!focusMaster) return;
      if (focusMastersStack[focusMastersStack.length - 1] === trapRef.current) {
        focusMastersStack.pop();
      } else {
        focusMastersStack.splice(focusMastersStack.indexOf(trapRef.current!), 1);
      }
    };
  }, [disabled, focusMaster]);
  React.useEffect(() => {
    if (disabled) return;
    if (!canUseDOM()) return;
    if (!trapRef.current) return;
    const focusableChildren = Array.from(trapRef.current.children).flatMap((node) =>
      getFocusableIn(node as HTMLElement),
    );
    if (focusableChildren.length === 0) return;

    document.body.addEventListener('focusin', handleFocusIn as any);
    document.body.addEventListener('mousedown', handleMouseEvent);
    document.body.addEventListener('touchstart', handleMouseEvent);
    document.body.addEventListener('keydown', handleKeyboardEvent);

    if (autoFocus)
      safeMoveFocusInside(
        trapRef.current,
        typeof returnFocusTo === 'object' ? returnFocusTo?.current! : document.body,
      );

    return () => {
      document.body.removeEventListener('focusin', handleFocusIn as any);
      document.body.removeEventListener('mousedown', handleMouseEvent);
      document.body.removeEventListener('touchstart', handleMouseEvent);
      document.body.removeEventListener('keydown', handleKeyboardEvent);
      returnFocus();
      autoTriggerRef.current = null;
    };
  }, [disabled, autoFocus, returnFocusTo, returnFocus]);

  const id = useUID('focus-lock-consumer');
  React.useEffect(() => {
    if (disabled) return;
    focusLockUsedInMountedComponents.add(id);
    return () => {
      focusLockUsedInMountedComponents.delete(id);
    };
  }, [disabled]);
};
const establishHookAsGlobal = () => {
  (globalThis as any)[globalFocusLockHookKey] = {
    hook: useFocusLockHook,
    version: focusLockVersion,
    usedInComponents: focusLockUsedInMountedComponents,
  };
};
if (!(globalThis as any)[globalFocusLockHookKey]) {
  establishHookAsGlobal();
} else if (typeof (globalThis as any)[globalFocusLockHookKey].version !== 'number') {
  establishHookAsGlobal();
} else {
  const { version: theirVersion, usedInComponents } = (globalThis as any)[globalFocusLockHookKey];
  if (focusLockVersion > theirVersion && usedInComponents.size === 0) {
    establishHookAsGlobal();
  }
}

export const useFocusLock: typeof useFocusLockHook = (...args) => {
  const hook = (globalThis as any)[globalFocusLockHookKey]?.hook ?? useFocusLockHook;
  return hook(...args);
};

export const isFocusInside = focusInside;
export const setFocus = safeMoveFocusInside as (topNode: HTMLElement, lastNode?: Element) => void;
