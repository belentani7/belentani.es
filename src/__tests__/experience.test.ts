import { beforeEach, expect, test } from 'vitest';
import { useExperienceStore } from '../store/experienceStore';

beforeEach(() => useExperienceStore.getState().resetToCanon());
test('back from Canon 0 remains valid', () => {
  useExperienceStore.getState().goBack();
  expect(useExperienceStore.getState().currentSystem).toBe('judas-canon');
  expect(useExperienceStore.getState().history).toHaveLength(1);
});
test('travel preserves history and reset returns to Canon 0', () => {
  const store = useExperienceStore;
  store.getState().travelTo('belentani-artist', 'artist-bio');
  store.getState().travelTo('future-era', 'cosmos-hud');
  store.getState().goBack();
  expect(store.getState().currentEra).toBe('belentani-artist');
  store.getState().toggleImmersiveMode();
  store.getState().resetToCanon();
  expect(store.getState().isImmersiveMode).toBe(false);
  expect(store.getState().currentEra).toBe('judas-era');
  expect(store.getState().history).toHaveLength(1);
});
test('repeated navigation does not inflate history', () => {
  useExperienceStore.getState().travelTo('judas-era', 'judas-canon');
  expect(useExperienceStore.getState().history).toHaveLength(1);
});
