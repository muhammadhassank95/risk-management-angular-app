import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terms',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  public loading = false;
  public isTerms: boolean;
  public term: string;
  public subscriptions = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.term = String(params['term']);
        if (this.term === 'privacy-policy') {
          this.isTerms = false;
        } else {
          this.isTerms = true;
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  goToCommunity() {
    this.router.navigateByUrl("/community")
  }

  onLoad() {
    this.loading = false;
  }

}
