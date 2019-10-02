import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-component-list-media',
  templateUrl: './list-media.component.html',
  styleUrls: ['./list-media.component.scss'],
})
export class ListMediaComponent implements OnInit {

  isLoadingSearch: boolean = false;
  isLoadingInit: boolean = false;
  medias: any;
  listMedias: any;
  currentPage: number = 0;
  nextUrl: string;
  nextPage: number = 0;
  searchTerm: string;

  constructor(
    private escortService: EscortService
  ) { }

  ngOnInit() { 
    this.getMedias({});
  }

  searchMediaInput(event: any): any {
    const term = event.target.value;
    this.searchTerm = term;
    this.getMedias({'action': 'search'});
  }

  getMedias(context: any): any {
    const nextUrl = context.nextUrl;
    const event = context.event;
    const action = context.action;

    if (this.searchTerm || action === 'search') {
      this.isLoadingSearch = true;
    } else {
      this.isLoadingInit = true;
    }

    this.escortService.getMedias({'term': this.searchTerm, 'match': '', 'nextUrl': nextUrl})
      .pipe(
        finalize(() => {
          this.isLoadingInit = false;
          this.isLoadingSearch = false;

          if (event) {
            event.target.disabled = true;
          }
        })
      )
      .subscribe(
        response => {
          this.medias = response;
          this.nextUrl = this.medias.navigate.next;
          const results = this.medias.results;

          if (event) {
            this.listMedias.push(...results);
          } else {
            this.listMedias = results;
          }
        },
        failure => {
          // Error
        }
      );
  }

  loadNextData(event: any): any {
    if (this.nextUrl) {
      this.getMedias({'nextUrl': this.nextUrl, 'event': event});
    }
  }

}
