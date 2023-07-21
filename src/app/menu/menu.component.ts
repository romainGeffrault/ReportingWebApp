import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, MatToolbarModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

}
