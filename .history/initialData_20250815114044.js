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
      
    },
    {
      id: 4,
      title: "Learn Data Structures and Algorithms 📚",
      description:
        "Study fundamental data structures and algorithms to solve coding problems efficiently",
      status: "todo",
    },
    {
      id: 5,
      title: "Contribute to Open Source Projects 🌐",
      description:
        "Gain practical experience and collaborate with others in the software development community",
      status: "done",
    },
    {
      id: 6,
      title: "Build Portfolio Projects 🛠️",
      description:
        "Create a portfolio showcasing your skills and projects to potential employers",
      status: "done",
    },
];