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
  editingTaskIndex: number | null = null;

  task = {
    title: '',
    assignedTo: '',
    status: 'Medium',
    estimate: 0,
    timeSpent: 0,
  };

  taskSearchTerm: string = '';

  errorMessage: string = '';   
  successMessage: string = ''; 
  filterTitle: string = '';
  filterAssignedTo: string = '';
  filterStatus: string = '';
  filterEstimate: number | null = null;
  filterTimeSpent: number | null = null;

  sortAscending: boolean = true; 

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
    this.sortTasks();
  }

  get uniqueUsers() {
    return [...new Set(this.tasks.map(task => task.assignedTo))];
  }

 

  sortTasks() {
    this.tasks.sort((a, b) => {
      return this.sortAscending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
  }

  toggleSortOrder() {
    this.sortAscending = !this.sortAscending;
    this.sortTasks();
  }

  toggleTaskForm() {
    this.showTaskForm = !this.showTaskForm;
    this.editingTaskIndex = null;
  }
// Create Task
  createTask() {
    if (!this.task.title.trim() || !this.task.assignedTo.trim()) {
      this.errorMessage = 'Task Title and Assigned To fields are required.';
      this.clearMessagesAfterDelay(); 
      return;
    }
  
    const storedTasks = localStorage.getItem('tasks');
    let allTasks = storedTasks ? JSON.parse(storedTasks) : [];
  
    if (this.editingTaskIndex !== null && (this.task as any).id) {
     
      const taskIndex = allTasks.findIndex((t: any) => t.id === (this.task as any).id);
      if (taskIndex !== -1) {
        allTasks[taskIndex] = { ...this.task, project: this.projectTitle };
        this.successMessage = 'Task Updated Successfully!';
      }
    } else {
      const newTask = {
        ...this.task,
        id: Date.now(), 
        project: this.projectTitle,
      };
      allTasks.push(newTask);
      this.successMessage = 'Task Created Successfully!';
    }
  
    
    localStorage.setItem('tasks', JSON.stringify(allTasks));
  
  
    this.tasks = allTasks.filter((task: any) => task.project === this.projectTitle);
    this.sortTasks();
  
  
    this.task = {
      title: '',
      assignedTo: '',
      status: 'Medium',
      estimate: 0,
      timeSpent: 0,
    };
    this.editingTaskIndex = null;
    this.showTaskForm = false;
    this.clearMessagesAfterDelay();
  }  
// Edit Task
  editTask(index: number) {
    this.task = { ...this.tasks[index] }; 
    this.editingTaskIndex = index;
    this.showTaskForm = true;
  }
  // Delete
  deleteTask(index: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      const storedTasks = localStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
  
      const taskId = this.tasks[index].id;
      const taskIndex = tasks.findIndex((t: any) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  
      this.tasks.splice(index, 1);
      this.successMessage = 'Task Deleted Successfully!';
      this.clearMessagesAfterDelay();
    }
  }
  // Go To Home
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
  // Filter Tasks
  filteredTasks() {
    return this.tasks
        .filter(task => 
            (!this.filterStatus || task.status === this.filterStatus) &&
            (task.title.toLowerCase().includes(this.taskSearchTerm.toLowerCase()) || 
             task.assignedTo.toLowerCase().includes(this.taskSearchTerm.toLowerCase()))
        );
}  
  getFilteredTasks() {
    return this.tasks.filter(task =>
        task.title.toLowerCase().includes(this.taskSearchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(this.taskSearchTerm.toLowerCase())
    );
}
}

                                                           