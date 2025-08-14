/**
 * @file script.js
 * @description Main entry point, initializes the board and event listeners.
 */

import { loadFromLocalStorage, hasUnsavedChanges, saveToLocalStorage } from './storage.js';
import { renderTasks, openModal } from './ui.js';
import { loadTasksFromAPI } from './tasks.js';

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
  const themeSwitch = document.getElementById('theme-switch');
  const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
  const body = document.body;
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeSwitch.checked = true;
    if (mobileThemeSwitch) mobileThemeSwitch.checked = true;
  }
  
  // Function to update theme
  function updateTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
    
    // Sync both switches
    themeSwitch.checked = isDark;
    if (mobileThemeSwitch) mobileThemeSwitch.checked = isDark;
  }
  
  // Desktop theme toggle event listener
  themeSwitch.addEventListener('change', () => {
    updateTheme(themeSwitch.checked);
  });
  
  // Mobile theme toggle event listener
  if (mobileThemeSwitch) {
    mobileThemeSwitch.addEventListener('change', () => {
      updateTheme(mobileThemeSwitch.checked);
    });
  }
}

/**
 * Initialize sidebar toggle functionality
 */
function initializeSidebarToggle() {
  const sidebar = document.getElementById('side-bar-div');
  const hideSidebarBtn = document.querySelector('.hide-sidebar-btn');
  const showSidebarBtn = document.getElementById('show-sidebar-btn');
  
  // Load sidebar state from localStorage
  const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
  if (sidebarHidden) {
    sidebar.classList.add('hidden');
    showSidebarBtn.classList.add('visible');
  }
  
  // Hide sidebar
  hideSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('hidden');
    showSidebarBtn.classList.add('visible');
    localStorage.setItem('sidebarHidden', 'true');
  });
  
  // Show sidebar
  showSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('hidden');
    showSidebarBtn.classList.remove('visible');
    localStorage.setItem('sidebarHidden', 'false');
  });
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const closeMobileMenu = document.getElementById('close-mobile-menu');
  const mobileAddTaskBtn = document.getElementById('mobile-add-task-btn');
  
  // Open mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('show');
  });
  
  // Close mobile menu
  closeMobileMenu.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('show');
  });
  
  // Close mobile menu when clicking outside
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('show');
    }
  });
  
  // Mobile add task button
  if (mobileAddTaskBtn) {
    mobileAddTaskBtn.addEventListener('click', () => {
      mobileMenuOverlay.classList.remove('show');
      openModal();
    });
  }
}

/**
 * Update data status indicator
 */
function updateDataStatus(status, text) {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  // Remove all status classes
  statusIndicator.classList.remove('loading', 'local', 'api', 'error');
  
  // Add new status class
  statusIndicator.classList.add(status);
  statusText.textContent = text;
}

/**
 * Show loading state
 */
function showLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  const errorMessage = document.getElementById('error-message');
  
  loadingOverlay.style.display = 'flex';
  errorMessage.classList.add('hidden');
  updateDataStatus('loading', 'Loading from API...');
}

/**
 * Hide loading state
 */
function hideLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  loadingOverlay.style.display = 'none';
}

/**
 * Show error state
 */
function showError(message) {
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  errorText.textContent = message;
  errorMessage.classList.remove('hidden');
  loadingOverlay.style.display = 'none';
}

/**
 * Hide error state
 */
function hideError() {
  const errorMessage = document.getElementById('error-message');
  errorMessage.classList.add('hidden');
}

/**
 * Initialize retry functionality
 */
function initializeRetry() {
  const retryBtn = document.getElementById('retry-btn');
  retryBtn.addEventListener('click', async () => {
    hideError();
    await loadTasks();
  });
}

/**
 * Auto-save data periodically
 */
function initializeAutoSave() {
  setInterval(() => {
    if (hasUnsavedChanges()) {
      saveToLocalStorage();
      updateDataStatus('local', 'Auto-saved to local storage');
      console.log('Auto-saved data to localStorage');
    }
  }, 30000); // Auto-save every 30 seconds if there are changes
}

/**
 * Load tasks with smart persistence strategy
 */
async function loadTasks() {
  // First, try to load from localStorage for immediate display
  const hasLocalData = loadFromLocalStorage();
  
  if (hasLocalData) {
    // Render tasks immediately from localStorage
    renderTasks();
    updateDataStatus('local', 'Loaded from local storage');
    
    // Check if there are unsaved local changes
    if (hasUnsavedChanges()) {
      console.log('Local changes detected, keeping local data');
      updateDataStatus('local', 'Using local data (unsaved changes)');
      return; // Keep local changes, don't overwrite with API data
    }
  } else {
    updateDataStatus('loading', 'No local data, loading from API...');
  }
  
  // Show loading state for API fetch
  showLoading();
  
  try {
    // Fetch fresh data from API
    await loadTasksFromAPI();
    renderTasks();
    hideLoading();
    updateDataStatus('api', 'Synced with server');
  } catch (error) {
    console.error('Failed to load tasks from API:', error);
    
    if (!hasLocalData) {
      // If no local data and API failed, show error
      showError(error.message || 'Failed to load tasks from the server.');
      updateDataStatus('error', 'Failed to load data');
    } else {
      // If we have local data, just hide loading and keep local data
      hideLoading();
      console.log('Using local data due to API failure');
      updateDataStatus('local', 'Using local data (API unavailable)');
    }
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  initializeThemeToggle();
  initializeSidebarToggle();
  initializeMobileMenu();
  initializeRetry();
  initializeAutoSave();

  // Load tasks with smart persistence strategy
  await loadTasks();

  const addBtn = document.getElementById('add-task-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openModal());
  }
});