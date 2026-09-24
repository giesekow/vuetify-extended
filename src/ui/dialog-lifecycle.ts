import { nextTick } from 'vue';

/** Vuetify can emit after-enter before the browser finishes its CSS transform. */
export async function finishDialogEntry(content?: HTMLElement): Promise<boolean> {
  await nextTick();
  const animations = content?.getAnimations?.().filter(animation =>
    animation.playState === 'running' &&
    Number.isFinite(animation.effect?.getComputedTiming().endTime)
  ) || [];
  const results = await Promise.allSettled(animations.map(animation => animation.finished));
  // A cancelled entry must not release a stale popup request.
  return results.every(result => result.status === 'fulfilled');
}
