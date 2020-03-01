import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nbUserTxt = ''

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getNbUser()
      .subscribe(
        res => {
          this.nbUserTxt = res['message'];
        }
      );
  }

}
