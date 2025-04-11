import { Component, Input, OnInit } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { TitleCasePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  templateUrl: './analytics-table.component.html',
  styleUrl: './analytics-table.component.scss',
  imports: [CommonModule, NgFor, TitleCasePipe, CurrencyPipe, DecimalPipe],
})
export class AnalyticsTableComponent implements OnInit {
  @Input()
  departmentId: string | undefined;

  weekdays: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService
      .getEmployeeHoursByDepartment(this.departmentId)
      .subscribe((employees: Employee[]) => {
        this.employees = employees;
      });
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
}
