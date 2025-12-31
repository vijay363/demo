import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../shared/common.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private commonService = inject(CommonService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  users = signal<any[]>([]);
  searchText = signal('');
  first = signal(0);
  rows = signal(10);

  filteredUsers = computed(() => {
    const text = this.searchText().toLowerCase();

    return this.users().filter(
      (u) =>
        u.name.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text) ||
        u.role.toLowerCase().includes(text)
    );
  });

  paginatedUsers = computed(() => {
    const start = this.first();
    const end = start + this.rows();
    return this.filteredUsers().slice(start, end);
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.commonService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.toastr.error('Failed to load users'),
    });
  }

  onSearchChange(value: string) {
    this.searchText.set(value);
    this.first.set(0);
  }

  resetFilter() {
    this.searchText.set('');
    this.first.set(0);
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 5);
  }

  editUser(id: number) {
    this.router.navigate(['/users/user-form', id]);
  }

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.commonService.deleteUser(id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => u.id !== id));
        this.toastr.success('User deleted successfully');
        this.commonService.clearCache();
      },
      error: () => this.toastr.error('Failed to delete user'),
    });
  }

  addUser() {
    this.router.navigate(['/users/user-form']);
  }
}
