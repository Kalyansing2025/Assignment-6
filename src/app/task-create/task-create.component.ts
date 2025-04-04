import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-create',
  standalone: true,
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
  imports: [FormsModule, CommonModule],
})


export class TaskCreateComponent implements OnInit {
  projectTitle: string = '';
  tasks: any[] = [];
  showTaskForm: boolean = false;
  editingTaskIndex: number | null = null; // 👈 Track editing task index

  task = {
    title: '',
    assignedTo: '',
    status: 'Medium',
    estimate: 0,
    timeSpent: 0,
  };

  errorMessage: string = '';   
  successMessage: string = ''; 

  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectTitle = params['projectId'] || 'Unknown Project';
      this.route.queryParams.subscribe(queryParams => {
        this.projectTitle = queryParams['project'] || 'Unknown Project';
        this.loadTasks();
      });
    });
  }

  loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    const allTasks = storedTasks ? JSON.parse(storedTasks) : [];
    this.tasks = allTasks.filter((task: any) => task.project === this.projectTitle);
  }

  toggleTaskForm() {
    this.showTaskForm = !this.showTaskForm;
    this.editingTaskIndex = null; // Reset editing mode when opening form
  }

  createTask() {
    if (!this.task.title.trim() || !this.task.assignedTo.trim()) {
      this.errorMessage = 'Task Title and Assigned To fields are required.';
      this.clearMessagesAfterDelay(); 
      return;
    }

    const storedTasks = localStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];

    if (this.editingTaskIndex !== null) {
      // Update existing task
      const taskIndex = this.tasks.findIndex(t => t.title === this.tasks[this.editingTaskIndex!].title);
      tasks[taskIndex] = { ...this.task, project: this.projectTitle };
      this.tasks[this.editingTaskIndex] = { ...this.task, project: this.projectTitle };
      this.successMessage = 'Task Updated Successfully!';
    } else {
      // Create new task
      const newTask = { ...this.task, project: this.projectTitle };
      tasks.push(newTask);
      this.tasks.push(newTask);
      this.successMessage = 'Task Created Successfully!';
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    this.task = { title: '', assignedTo: '', status: 'Medium', estimate: 0, timeSpent: 0 };
    this.editingTaskIndex = null; // Reset editing index
    this.showTaskForm = false;
    this.clearMessagesAfterDelay();
  }

  editTask(index: number) {
    this.task = { ...this.tasks[index] }; // Populate form with task data
    this.editingTaskIndex = index;
    this.showTaskForm = true;
  }

  deleteTask(index: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      const storedTasks = localStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Find the task index in localStorage
     const taskIndex = tasks.findIndex((t: { title: string }) => 
  t.title === this.tasks[index].title
);

      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }

      this.tasks.splice(index, 1);
      this.successMessage = 'Task Deleted Successfully!';
      this.clearMessagesAfterDelay();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
  

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'High':
        return 'status-high';
      case 'Medium':
        return 'status-medium';
      case 'Low':
        return 'status-low';
      default:
        return '';
    }
  }
  
}


