import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.sass']
})
export class BienvenidaComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
