import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-component-detail-media',
  templateUrl: './detail-media.component.html',
  styleUrls: ['./detail-media.component.scss'],
})
export class DetailMediaComponent implements OnInit {

  @Input('mediaData') mediaData: any;

  ratingsLoop: Array<number> = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
    if (this.mediaData) {
      console.log(this.mediaData);
    }
  }

}
