import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, UrlSerializer, UrlTree } from '@angular/router';

// Services
import { PersonService } from '../../person/services/person.service';

// Component environment
import { modulenv } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class EscortService {

  constructor(
    private router: Router,
    private serializer: UrlSerializer,
    private httpClient: HttpClient,
    private personService: PersonService) {

  }

  /***
   * Fetch classified
   */
  getClassifieds(): Observable<any> {
    return this.httpClient
      .get(modulenv.classifiedUrl)
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Submit media
   */
  postSubmitMedia(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();

    return this.httpClient
      .post(modulenv.mediaUrl, context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update options
   */
  postUpdateOption(context: any): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const uuid = context.uuid;

    return this.httpClient
      .put(modulenv.optionUrl + uuid + '/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Get all options based on person roles
   */
  getOptions(context: any): Observable<any> {
    const url = (context.identifiers ? modulenv.optionUrl + '?identifiers=' + context.identifiers : modulenv.optionUrl);

    return this.httpClient
      .get(url)
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Load next media
   */
  getMedias(context: any): Observable<any> {
    let fetchUrl = modulenv.mediaUrl;
    let nextUrl = context.nextUrl;
    let term = context.term;
    let match = context.match;

    // If url not same is load next page
    // 'url': next page url
    if (nextUrl && nextUrl != fetchUrl) {
      fetchUrl = nextUrl;
    }

    const params = {
      term: (term ? term : ''),
      match: (match ? match : ''),
    }

    return this.httpClient
      .get(fetchUrl, { params: params })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Get single media
   */
  getMedia(uuid: string): Observable<any> {
    const headers = this.personService.initAuthHeaders();
    const params = {}

    return this.httpClient
      .get(modulenv.mediaUrl + uuid + '/', { params: params, withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}
