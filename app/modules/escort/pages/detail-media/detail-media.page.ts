import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

// Services
import { EscortService } from '../../services/escort.service';

@Component({
  selector: 'app-detail-media',
  templateUrl: './detail-media.page.html',
  styleUrls: ['./detail-media.page.scss'],
})
export class DetailMediaPage implements OnInit {

  uuid: string;
  mediaData: any;
  isLoading: boolean = false;

  constructor(
    public route: ActivatedRoute,
    private escortService: EscortService
  ) { }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.getMedia();
  }

  getMedia(): any {
    this.isLoading = true;
    this.escortService.getMedia(this.uuid)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        response => {
          console.log(response);
          this.mediaData = response;
        },
        failure => {
          // Error
        }
      );
  }

}
