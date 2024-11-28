import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {routes} from "./app.routes";
import {MenubarComponent} from "./menubar/menubar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, RouterOutlet, MenubarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'datalabPortal';
}
