import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  user: any = null;

  ngOnInit() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  logout() {
    localStorage.removeItem('loggedInUser'); // Clear user data
    window.location.href = '/login'; // Redirect to login page
  }
}
