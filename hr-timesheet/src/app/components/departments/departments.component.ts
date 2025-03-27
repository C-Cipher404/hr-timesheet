import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/departments.service';
import { Department } from '../../interfaces/department';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] | undefined;

  constructor(private departmentService: DepartmentService) {}
  ngOnInit(): void {
    this.departments = this.departmentService.departments;
  }
}
