// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  activePage: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.highlightActivePage(event.url);
      });
  }

  highlightActivePage(url: string) {
    // Extract the active page from the URL (you may need a more complex logic based on your routes)
    const activePage = url.split('/').pop();

    // Set the activePage property for highlighting in the template
    this.activePage = activePage;
  }
}
