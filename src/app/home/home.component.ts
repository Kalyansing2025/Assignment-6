import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../logout/logout.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule, CommonModule, LogoutComponent],
})
export class HomeComponent {
  showModal = false;
  showLogoutModal = false;
  projects: any[] = [];
  user: any = null;
  editingIndex: number | null = null;
  
  today: string = '';
  maxDate: string = '';

  project = {
    id: '',
    title: '',
    description: '',
    createdBy: '',
    projectManager: '',
    startDate: '',
    endDate: '',
    teamMembers: 0,
    dueDays: 0,
  };

  successMessage: string = '';
  errorMessage: string = '';

  titleError = false;
  descriptionError = false;
  createdByError = false;
  projectManagerError = false;
  dateError = false;
  duplicateError = false;
  teamError = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loadProjects();
    } else {
      this.user = null;
      this.projects = [];
    }

    const todayDate = new Date();
    this.today = this.formatDate(todayDate);
    const maxDateValue = new Date();
    maxDateValue.setFullYear(todayDate.getFullYear() + 5);  
    this.maxDate = this.formatDate(maxDateValue);
  }

  navigateToTaskCreate(project: any) {
    this.router.navigate(['/create-task', project.id], { 
      queryParams: { project: project.title } 
    });
  }
  

  loadUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  openProjectModal() {
    this.showModal = true;
  }

  closeProjectModal() {
    this.resetProjectForm();
    this.showModal = false;
    this.editingIndex = null;
  }

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  clearValidationErrors() {
    setTimeout(() => {
      this.titleError = false;
      this.descriptionError = false;
      this.createdByError = false;
      this.projectManagerError = false;
      this.dateError = false;
      this.duplicateError = false;
      this.teamError = false;
    }, 3000);
  }

  createProject() {
    this.project.title = this.project.title.trim();
    this.project.createdBy = this.project.createdBy.trim();
    this.project.projectManager = this.project.projectManager.trim();

    const validTextPattern = /^(?!.*(.)\1{4,})[A-Za-z\s\-']{3,}$/;
    this.titleError = !validTextPattern.test(this.project.title);
    this.descriptionError = !validTextPattern.test(this.project.description);
    this.createdByError = !validTextPattern.test(this.project.createdBy);
    this.projectManagerError = !validTextPattern.test(this.project.projectManager);
    this.teamError = this.project.teamMembers <= 0;

    this.duplicateError = this.projects.some(
      (proj) =>
        proj.title.toLowerCase() === this.project.title.toLowerCase() ||
        proj.createdBy.toLowerCase() === this.project.createdBy.toLowerCase() ||
        proj.projectManager.toLowerCase() === this.project.projectManager.toLowerCase()
    );

    if (this.duplicateError) {
      this.clearValidationErrors();
      return;
    }

    if (this.editingIndex !== null) {
      this.projects[this.editingIndex] = { ...this.project };
      this.successMessage = 'Project Updated Successfully!';
    } else {
      this.project.id = this.generateUniqueId();
      const newProject = { ...this.project, userEmail: this.user.email };
      let storedProjects = localStorage.getItem('projects');
      let allProjects = storedProjects ? JSON.parse(storedProjects) : [];
      allProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(allProjects));
      this.successMessage = 'Project Created Successfully!';
    }
                                                  
    this.errorMessage = '';
    setTimeout(() => (this.successMessage = ''), 2000);
    this.resetProjectForm();
    this.loadProjects();
    this.closeProjectModal();
  }
    
  resetProjectForm() {
    this.project = {
      id: '',
      title: '',
      description: '',
      createdBy: '',
      projectManager: '',
      startDate: '',
      endDate: '',
      teamMembers: 0,
      dueDays: 0,
    };
  }

  editProject(index: number) {
    this.project = { ...this.projects[index] };
    this.editingIndex = index;
    this.showModal = true;
    this.calculateDueDays();
  }

  saveProject() {
    if (this.editingIndex !== null) {
      this.calculateDueDays();
      this.projects[this.editingIndex] = { ...this.project };
      this.successMessage = 'Project Updated Successfully!';
      localStorage.setItem('projects', JSON.stringify(this.projects));
      setTimeout(() => (this.successMessage = ''), 3000);
      this.closeProjectModal();
      this.editingIndex = null;
    }
  }

  calculateDueDays() {
    if (this.project.startDate && this.project.endDate) {
      const start = new Date(this.project.startDate);
      const end = new Date(this.project.endDate);
      this.project.dueDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    }
  }

  deleteProject(index: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projects.splice(index, 1);
      this.saveProjects();
      this.errorMessage = 'Project Deleted Successfully!';
      this.successMessage = '';
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }

  saveProjects() {
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  loadProjects() {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects && this.user) {
      const allProjects = JSON.parse(storedProjects);
      this.projects = allProjects.filter((proj: any) => proj.userEmail === this.user.email);
    } else {
      this.projects = [];
    }
  }

  generateUniqueId(): string {
    return 'P' + Math.random().toString(36).substr(2, 9);
  }
}
