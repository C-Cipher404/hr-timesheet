import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/departments.service';
import { Department } from '../../interfaces/department';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  departments: Department[];

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.departments = this.departmentService.departments;
  }
  goToDepartment(departmentId: string): void {
    this.router.navigate(['./timesheet', { id: departmentId }]);
  }
}
