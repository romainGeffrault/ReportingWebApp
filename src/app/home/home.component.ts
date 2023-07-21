import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEFAULT_REPORTING_LIST } from '../shared/mock/reporting-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule
  ]
})
export class HomeComponent {

  listData = DEFAULT_REPORTING_LIST;
  putSchema = {
    author: {
    first_name: "string",
    last_name: "string",
    birth_date: "string",
    sexe: "string",
    email: "string"
    },
    description: "string",
    observations: [1, 2]
    };

  emailAlreadyExists = {
    "author": {
    "email": ['This value already exist']
    }
    };

  observationList = [
    {
    "id": 1,
    "name": "Observation 1"
    },
    {
    "id": 2,
    "name": "Observation 2"
    },
    {
    "id": 3,
    "name": "Observation 3"
    }
    ];

}
