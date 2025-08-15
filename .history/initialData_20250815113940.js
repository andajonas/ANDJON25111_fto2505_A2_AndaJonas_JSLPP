/**
 * @file initialData.js
 * @description Contains the initial tasks data array.
 */

/**
 * Initial list of tasks.
 * @type {Array<{id: number, title: string, description: string, status: string}>}
 */
export const initialTasks = [
    {
      id: 1,
      title: "Launch Epic Career 🚀",
      description: "Create a killer Resume",
      status: "todo",
      priority: "medium", // Added priority field
    },
    {
      id: 2,
      title: "Master JavaScript 💛",
      description: "Get comfortable with the fundamentals",
      status: "doing",
      priority: "high", // Added priority field
    },
    {
      id: 3,
      title: "Keep on Going 🏆",
      description: "You're almost there",
      status: "doing",
      priority: "low", // Added priority field
    },
    {
      id: 4,
      title: "Learn Data Structures and Algorithms 📚",
      description:
        "Study fundamental data structures and algorithms to solve coding problems efficiently",
      status: "todo",
      priority: "high", // Added priority field
    },
    {
      id: 5,
      title: "Contribute to Open Source Projects 🌐",
      description:
        "Gain practical experience and collaborate with others in the software development community",
      status: "done",
      priority: "medium", // Added priority field
    },
    {
      id: 6,
      title: "Build Portfolio Projects 🛠️",
      description:
        "Create a portfolio showcasing your skills and projects to potential employers",
      status: "done",**
      * @file ui.js
      * @description UI rendering and modal management.
      */
     
     import { taskMap, refreshTaskMap, addTask, editTask, deleteTask, tasks } from './tasks.js';
     import { saveToLocalStorage, markAsModified } from './storage.js';
     
     /**
      * Render all tasks in their respective columns.
      */
     export function renderTasks() {
       refreshTaskMap();
     
       const statuses = ['todo', 'doing', 'done'];
     
       statuses.forEach((status) => {
         const container = document.querySelector(`.column-div[data-status="${status}"] .tasks-container`);
         container.innerHTML = ''; // Clear existing
         const filtered = tasks.filter(task => task.status === status);
         filtered.forEach(task => {
           const div = document.createElement('div');
           div.className = 'task-div';
           div.textContent = task.title;
           div.dataset.taskId = task.id;
           div.addEventListener('click', () => openModal(task.id));
           container.appendChild(div);
         });
     
         // Update column header count
         const header = document.querySelector(`#${status}Text`);
         if (header) header.textContent = `${status.toUpperCase()} (${filtered.length})`;
       });
     }
     
     /**
      * Get or create the modal element and attach event listeners.
      * @returns {HTMLElement} The modal element.
      */
     export function getOrCreateModal() {
         let modal = document.querySelector('.modal');
       
         if (!modal) {
           modal = document.createElement('div');
           modal.className = 'modal hidden';
           modal.innerHTML = `
             <div class="modal-content">
               <div class="modal-header">
                 <h2 id="modal-mode-title">Task</h2>
                 <span class="close-btn">&times;</span>
               </div>
       
               <div class="modal-body">
                 <div class="form-group">
                   <label for="modal-title"><strong>Title</strong></label>
                   <input type="text" id="modal-title" placeholder="Enter task title..." />
                 </div>
       
                 <div class="form-group">
                   <label for="modal-description"><strong>Description</strong></label>
                   <textarea id="modal-description" rows="4" placeholder="Enter task description..."></textarea>
                 </div>
       
                 <div class="form-group">
                   <label for="modal-status"><strong>Current Status</strong></label>
                   <select id="modal-status">
                     <option value="todo">To Do</option>
                     <option value="doing">Doing</option>
                     <option value="done">Done</option>
                   </select>
                 </div>
               </div>
       
               <div class="modal-buttons">
                 <button class="save-btn">Save Changes</button>
                 <button class="delete-btn">Delete Task</button>
               </div>
             </div>
           `;
           document.body.appendChild(modal);
         }
       
         const closeBtn = modal.querySelector('.close-btn');
         const saveBtn = modal.querySelector('.save-btn');
         const deleteBtn = modal.querySelector('.delete-btn');
       
         closeBtn.onclick = closeModal;
       
         saveBtn.onclick = () => {
           const taskId = modal.dataset.taskId;
           if (taskId) {
             saveChanges();
           } else {
             addNewTask();
           }
         };
     
         deleteBtn.onclick = deleteTaskHandler;
       
         // Set button text based on modal mode
         if (modal.dataset.taskId) {
           saveBtn.textContent = 'Save Changes';
           deleteBtn.style.display = 'inline-block';
         } else {
           saveBtn.textContent = 'Create Task';
           deleteBtn.style.display = 'none';
         }
       
         return modal;
       }
       
     
     /**
      * Open the modal for a specific task or for adding new task.
      * @param {number | undefined} taskId
      */
     export function openModal(taskId) {
         const modal = getOrCreateModal();
         modal.classList.remove('hidden');
       
         const titleInput = modal.querySelector('#modal-title');
         const descriptionInput = modal.querySelector('#modal-description');
         const statusSelect = modal.querySelector('#modal-status');
         const deleteBtn = modal.querySelector('.delete-btn');
         const header = modal.querySelector('#modal-mode-title');
         const saveBtn = modal.querySelector('.save-btn');
       
         if (taskId) {
           const task = taskMap[taskId];
           if (!task) return;
       
           titleInput.value = task.title;
           descriptionInput.value = task.description;
           statusSelect.value = task.status;
           modal.dataset.taskId = taskId;
           deleteBtn.style.display = 'inline-block';
           header.textContent = 'Edit Task';
           saveBtn.textContent = 'Save Changes';
         } else {
           titleInput.value = '';
           descriptionInput.value = '';
           statusSelect.value = 'todo';
           delete modal.dataset.taskId;
           deleteBtn.style.display = 'none';
           header.textContent = 'Add New Task';
           saveBtn.textContent = 'Create Task';
         }
     
         // Focus on title input for better UX
         setTimeout(() => {
           titleInput.focus();
         }, 100);
     
         // Add keyboard event listeners
         const handleKeyDown = (e) => {
           if (e.key === 'Escape') {
             closeModal();
           } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
             e.preventDefault();
             if (taskId) {
               saveChanges();
             } else {
               addNewTask();
             }
           }
         };
     
         modal.addEventListener('keydown', handleKeyDown);
         
         // Store the event listener for cleanup
         modal._keydownHandler = handleKeyDown;
       }
     
     
     /**
      * Close the modal.
      */
     export function closeModal() {
       const modal = document.querySelector('.modal');
       if (modal) {
         modal.classList.add('hidden');
         
         // Clean up keyboard event listener
         const keydownHandler = modal._keydownHandler;
         if (keydownHandler) {
           modal.removeEventListener('keydown', keydownHandler);
           delete modal._keydownHandler;
         }
       }
     }
     
     /**
      * Save changes made in modal for existing task.
      */
     async function saveChanges() {
       const modal = document.querySelector('.modal');
       const taskId = Number(modal.dataset.taskId);
       const title = modal.querySelector('#modal-title').value.trim();
       const description = modal.querySelector('#modal-description').value.trim();
       const status = modal.querySelector('#modal-status').value;
     
       if (!title) {
         alert("Title is required.");
         return;
       }
     
       try {
         const updated = await editTask(taskId, { title, description, status });
         if (updated) {
           saveToLocalStorage();
           renderTasks();
           closeModal();
         }
       } catch (error) {
         alert(`Error updating task: ${error.message}`);
       }
     }
     
     /**
      * Add a new task from modal input values.
      */
     async function addNewTask() {
       const modal = document.querySelector('.modal');
       const title = modal.querySelector('#modal-title').value.trim();
       const description = modal.querySelector('#modal-description').value.trim();
       const status = modal.querySelector('#modal-status').value;
     
       if (!title) {
         alert("Please enter a title.");
         return;
       }
     
       try {
         await addTask({ title, description, status });
         saveToLocalStorage();
         renderTasks();
         closeModal();
       } catch (error) {
         alert(`Error creating task: ${error.message}`);
       }
     }
     
     /**
      * Show custom confirmation dialog
      */
     function showConfirmationDialog(message, onConfirm, onCancel) {
       const confirmationModal = document.createElement('div');
       confirmationModal.className = 'modal confirmation-modal';
       confirmationModal.innerHTML = `
         <div class="modal-content confirmation-content">
           <div class="modal-header">
             <h2>⚠️ Confirm Action</h2>
             <span class="close-btn confirmation-close">&times;</span>
           </div>
           <div class="modal-body">
             <p>${message}</p>
           </div>
           <div class="modal-buttons">
             <button class="cancel-btn">Cancel</button>
             <button class="confirm-btn">Delete</button>
           </div>
         </div>
       `;
       
       document.body.appendChild(confirmationModal);
       
       // Event listeners
       const closeBtn = confirmationModal.querySelector('.confirmation-close');
       const cancelBtn = confirmationModal.querySelector('.cancel-btn');
       const confirmBtn = confirmationModal.querySelector('.confirm-btn');
       
       const closeConfirmation = () => {
         document.body.removeChild(confirmationModal);
         if (onCancel) onCancel();
       };
       
       closeBtn.onclick = closeConfirmation;
       cancelBtn.onclick = closeConfirmation;
       confirmBtn.onclick = () => {
         document.body.removeChild(confirmationModal);
         if (onConfirm) onConfirm();
       };
       
       // Close on escape
       const handleKeyDown = (e) => {
         if (e.key === 'Escape') {
           closeConfirmation();
         }
       };
       
       confirmationModal.addEventListener('keydown', handleKeyDown);
       
       // Focus on confirm button
       setTimeout(() => {
         confirmBtn.focus();
       }, 100);
     }
     
     /**
      * Delete task from modal with confirmation.
      */
     async function deleteTaskHandler() {
       const modal = document.querySelector('.modal');
       const taskId = Number(modal.dataset.taskId);
       if (!taskId) return;
     
       const task = taskMap[taskId];
       if (!task) return;
     
       // Show custom confirmation dialog
       showConfirmationDialog(
         `Are you sure you want to delete "${task.title}"?<br><br>This action cannot be undone.`,
         async () => {
           try {
             const deleted = await deleteTask(taskId);
             if (deleted) {
               saveToLocalStorage();
               renderTasks();
               closeModal();
             }
           } catch (error) {
             alert(`Error deleting task: ${error.message}`);
           }
         }
       );
     }
];