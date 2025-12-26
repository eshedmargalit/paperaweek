import { vi } from 'vitest';
import * as storage from '../storage';
import { getPersistedTheme, saveTheme } from './themes';

vi.mock('../storage');
const mockStorage = storage as any;

describe('themes', () => {
  describe(getPersistedTheme.name, () => {
    it('returns null when an invalid theme is saved', () => {
      mockStorage.getFromLocalStorage.mockReturnValueOnce('potato');
      expect(getPersistedTheme()).toBeNull();
    });

    it('returns the persisted theme if it is valid', () => {
      mockStorage.getFromLocalStorage.mockReturnValueOnce('orange');
      expect(getPersistedTheme()).toEqual('orange');
    });
  });

  describe(saveTheme.name, () => {
    it('saves to local storage with the right args', () => {
      saveTheme('green');
      expect(mockStorage.saveToLocalStorage).toHaveBeenCalledWith('theme', 'green');
    });
  });
});
