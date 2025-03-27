import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Department } from '../../interfaces/department';
import { DepartmentService } from '../../services/departments.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent implements OnInit {
  departments: Department[] | undefined;
  dpartment: Department | undefined;
  department: Department;

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService
  ) {}
  ngOnInit(): void {
    this.departments = this.departmentService.departments;
    this.department = this.departments.find(
      (department) => department.id === this.route.snapshot.params['id']
    );
  }
}
