/**
 * @file storage.js
 * @description Provides localStorage save/load functions for tasks.
 */

import { tasks, refreshTaskMap } from './tasks.js';

/**
 * Saves the current tasks array to localStorage.
 */
export function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('lastSaved', Date.now().toString());
}

/**
 * Loads tasks from localStorage into the tasks array.
 * If no stored data, does nothing.
 * @returns {boolean} True if data was loaded from localStorage
 */
export function loadFromLocalStorage() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      tasks.length = 0; // Clear existing
      parsed.forEach(task => tasks.push(task));
      refreshTaskMap(); // Update the taskMap after loading
      return true;
    } catch (error) {
      console.error('Error parsing stored tasks:', error);
      return false;
    }
  }
  return false;
}

/**
 * Gets the timestamp of when data was last saved
 * @returns {number|null} Timestamp or null if not found
 */
export function getLastSavedTime() {
  const lastSaved = localStorage.getItem('lastSaved');
  return lastSaved ? parseInt(lastSaved) : null;
}

/**
 * Checks if there are any local changes that haven't been synced
 * @returns {boolean} True if there are unsaved changes
 */
export function hasUnsavedChanges() {
  const lastSaved = getLastSavedTime();
  const lastModified = localStorage.getItem('lastModified');
  if (!lastSaved || !lastModified) return false;
  
  return parseInt(lastModified) > lastSaved;
}

/**
 * Marks that local data has been modified
 */
export function markAsModified() {
  localStorage.setItem('lastModified', Date.now().toString());
}