import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from '../../services/departments.service';
import { Employee } from '../../interfaces/employee';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Observable, switchMap, tap } from 'rxjs';
import { CommonModule, NgIf, NgFor, TitleCasePipe } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatError,
  ],
})
export class TimesheetComponent implements OnInit {
  $departments: Observable<Department[]> | undefined;
  departments: Department[] | undefined;
  department: Department | undefined;
  employeeNameFC = new FormControl('', this.nameValidator());
  employees: Employee[] = [];
  employeeId = 0;
  weekdays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentsService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.$departments = this.departmentService.getDepartments();

    this.$departments
      .pipe(
        switchMap((departments) => {
          this.department = departments.find(
            (dept) => dept.id === this.route.snapshot.params['id']
          );
          return this.employeeService.getEmployeeHoursByDepartment(
            this.department?.id || ''
          );
        }),
        tap((employees) => {
          this.employees = employees;
        })
      )
      .subscribe();
  }

  addEmployee(): void {
    if (this.employeeNameFC.value) {
      this.employeeId++;

      this.employees.push({
        departmentId: this.department?.id,
        name: this.employeeNameFC.value,
        payRate: Math.floor(Math.random() * 50) + 50,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      });

      this.employeeNameFC.setValue('');
    }
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let error = null;
      if (this.employees && this.employees.length) {
        for (const employee of this.employees) {
          if (employee.name.toLowerCase() === control.value.toLowerCase()) {
            error = { duplicate: true };
            break;
          }
        }
      }
      return error;
    };
  }

  getTotalHours(employee: Employee): number {
    return (
      employee.monday +
      employee.tuesday +
      employee.wednesday +
      employee.thursday +
      employee.friday +
      employee.saturday +
      employee.sunday
    );
  }

  deleteEmployee(employee: Employee, index: number): void {
    if (employee.id) {
      this.employeeService.deleteEmployeeHours(employee);
    }
    this.employees.splice(index, 1);
  }

  submit(): void {
    this.employees.forEach((employee) => {
      if (employee.id) {
        this.employeeService.updateEmployeeHours(employee);
      } else {
        this.employeeService.saveEmployeeHours(employee);
      }
    });

    this.router.navigate(['./departments']);
  }
}
