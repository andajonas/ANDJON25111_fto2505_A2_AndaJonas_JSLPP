/**
 * @file api.js
 * @description API service for fetching tasks from external API.
 */

const API_BASE_URL = 'https://jsl-kanban-api.vercel.app';

/**
 * Fetch tasks from the API
 * @returns {Promise<Array>} Promise that resolves to array of tasks
 */
export async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : []; // Ensure we return an array
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
}

/**
 * Create a new task locally (API doesn't support POST)
 * @param {Object} taskData - Task data to create
 * @returns {Promise<Object>} Promise that resolves to created task
 */
export async function createTask(taskData) {
  // Since the API is read-only, we'll create the task locally
  const newTask = {
    id: Date.now(),
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
  };
  
  return Promise.resolve(newTask);
}

/**
 * Update an existing task locally (API doesn't support PUT)
 * @param {number} taskId - ID of task to update
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Promise that resolves to updated task
 */
export async function updateTask(taskId, taskData) {
  // Since the API is read-only, we'll return the updated data
  const updatedTask = {
    id: taskId,
    title: taskData.title,
    description: taskData.description,
    status: taskData.status,
  };
  
  return Promise.resolve(updatedTask);
}

/**
 * Delete a task locally (API doesn't support DELETE)
 * @param {number} taskId - ID of task to delete
 * @returns {Promise<boolean>} Promise that resolves to true if successful
 */
export async function deleteTaskAPI(taskId) {
  // Since the API is read-only, we'll just return success
  return Promise.resolve(true);
}