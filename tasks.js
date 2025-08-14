/**
 * @file tasks.js
 * @description Functions to manipulate tasks data.
 */

import { fetchTasks, createTask as createTaskAPI, updateTask as updateTaskAPI, deleteTaskAPI } from './api.js';
import { markAsModified } from './storage.js';

/**
 * Global tasks array that will be populated from API
 * @type {Array<{id: number, title: string, description: string, status: string}>}
 */
export let tasks = [];

/**
 * Map to quickly lookup tasks by ID.
 * @type {Object<number, Object>}
 */
export const taskMap = {};

/**
 * Refresh the taskMap from the tasks array.
 */
export function refreshTaskMap() {
  Object.keys(taskMap).forEach(key => delete taskMap[key]); // clear old keys
  tasks.forEach(task => {
    taskMap[task.id] = task;
  });
}

/**
 * Load tasks from API and update local state
 * @returns {Promise<Array>} Promise that resolves to array of tasks
 */
export async function loadTasksFromAPI() {
  try {
    tasks = await fetchTasks();
    refreshTaskMap();
    return tasks;
  } catch (error) {
    console.error('Error loading tasks from API:', error);
    throw error;
  }
}

/**
 * Add a new task to the list and map.
 * @param {{title: string, description: string, status: string}} taskData
 * @returns {Promise<Object>} Promise that resolves to the newly created task object.
 */
export async function addTask(taskData) {
  try {
    const newTask = await createTaskAPI(taskData);
    tasks.push(newTask);
    taskMap[newTask.id] = newTask;
    markAsModified(); // Mark that data has been modified
    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
}

/**
 * Edit an existing task.
 * @param {number} taskId
 * @param {{title: string, description: string, status: string}} updates
 * @returns {Promise<boolean>} Promise that resolves to true if task was found and updated.
 */
export async function editTask(taskId, updates) {
  try {
    const updatedTask = await updateTaskAPI(taskId, updates);
    const task = taskMap[taskId];
    if (!task) return false;

    // Update local task data
    task.title = updatedTask.title;
    task.description = updatedTask.description;
    task.status = updatedTask.status;
    markAsModified(); // Mark that data has been modified
    return true;
  } catch (error) {
    console.error('Error editing task:', error);
    throw error;
  }
}

/**
 * Delete a task by ID.
 * @param {number} taskId
 * @returns {Promise<boolean>} Promise that resolves to true if a task was deleted.
 */
export async function deleteTask(taskId) {
  try {
    await deleteTaskAPI(taskId);
    const index = tasks.findIndex(task => task.id === taskId);
    if (index === -1) return false;

    tasks.splice(index, 1);
    delete taskMap[taskId];
    markAsModified(); // Mark that data has been modified
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}