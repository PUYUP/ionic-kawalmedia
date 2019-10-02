import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// LOCAL ENV.
import { modulenv } from '../environment';

const credentialsKey = 'credentialsKey';
const tokenKey = 'tokenKey';

// REGISTER CONTEXT
interface RegisterContext {
  username?: string;
  email?: string;
  telephone?: number;
  password?: string;
}

// VALIDATION CONTEXT
interface ValidateContext {
  secure_code?: string;
  action?: string;
}

interface ValidationContext {
  secure_code?: string;
  action?: string;
  csrfmiddlewaretoken?: string;
}

// LOGIN CONTEXT
interface LoginContext {
  username?: string;
  password?: string;
}

// RESET PASSWORD CONTEXT
interface RecoveryPasswordContext {
  secure_code?: string;
  password1?: string;
  password2?: string;
}

interface RequestPasswordContext {
  email?: string;
  secure_code?: string;
  action?: string;
}

// OPTION CONTEXT
interface optionContext {
  person_id?: number;
  identifiers?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private storageCredentials: any | null;
  private storageToken: string | null;

  constructor(
    private httpClient: HttpClient,
    private personService: PersonService) {

    const savedCredentials = localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this.storageCredentials = JSON.parse(savedCredentials);
    }

    const savedToken = localStorage.getItem(tokenKey);
    if (savedToken != null && savedToken !== 'undefined') {
      this.storageToken = JSON.parse(savedToken);
    }
  }

  /*** 
   * Login action
   */
  postLogin(context: LoginContext): Observable<any> {
    const headers = this.initCsrfHeaders();

    return this.httpClient
      .post(modulenv.loginUrl, {
        username: context.username,
        password: context.password
      }, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;

          this.setCredentials(result);
          this.setToken(result);
          return result;
        })
      );
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): any | null {
    return this.storageCredentials;
  }

  get token(): any | null {
    return this.storageToken;
  }

  /**
   * Sets the user credentials.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   */
  private setCredentials(credentials?: any) {
    this.storageCredentials = credentials || null;

    if (credentials) {
      const storage = localStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(credentialsKey);
    }
  }

  private setToken(token: any) {
    this.storageToken = token || null;

    if (token) {
      const storage = localStorage;
      storage.setItem(tokenKey, JSON.stringify(token));
    } else {
      localStorage.removeItem(tokenKey);
    }
  }

  getLocalToken(): any {
    const tokenObj = JSON.parse(localStorage.getItem(tokenKey));
    return tokenObj;
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfull
   */
  postLogout(): Observable<any> {
    const headers = this.initAuthHeaders();

    // Customize credentials invalidation here
    this.setCredentials();
    this.setToken(false);

    return this.httpClient
      .post(modulenv.userUrl + 'logout/', {}, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return {};
        })
      );
  }

  /**
   * Headers for auth token
   */
  initAuthHeaders(): HttpHeaders {
    let authCode = '1234567890';
    const csrftoken = this.getCookie('csrftoken');
    const data = this.getLocalToken();

    if (data) authCode = data.auth_code;

    return new HttpHeaders({
      'Authorization': authCode,
      'X-CSRFTOKEN': csrftoken
    });
  }

  /***
   * Save localStorage data 
   */
  setLocalData(key: string = '', data: any = ''): void {
    if (key && data) localStorage.setItem(key, JSON.stringify(data));
  }

  /***
   * Delete localStorage data
   */
  deleteLocalData(key: string = ''): void {
    if (key) localStorage.removeItem(key);
  }

  /*** 
   * Get localStorage data 
   */
  getLocalData(key: string = ''): any {
    return JSON.parse(localStorage.getItem(key));
  }

  /*** 
   * Get cookie 
   */
  getCookie(name: string) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }

    return cookieValue;
  }

  /**
   * Headers for validate csrftoken
   */
  initCsrfHeaders(): HttpHeaders {
    const csrftoken = this.getCookie('csrftoken');
    return new HttpHeaders({ 'X-CSRFTOKEN': csrftoken });
  }

  /***
   * Register action
   */
  postRegister(context: RegisterContext): Observable<any> {
    const headers = this.initCsrfHeaders();

    return this.httpClient
      .post(modulenv.userUrl, {
        username: context.username,
        email: context.email,
        telephone: context.telephone,
        password: context.password
      }, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Validate action
   */
  postValidation(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.userUrl + 'validation/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Send validation token
   */
  postSendValidation(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.userUrl + 'verification/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Request new password
   */
  postRequestPassord(context: RequestPasswordContext): Observable<any> {
    const headers = this.initCsrfHeaders();

    return this.httpClient
      .post(modulenv.userUrl + 'password-request/', {
        email: context.email,
        secure_code: context.secure_code,
        action: context.action,
      }, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Set new password
   */
  postPasswordRecovery(context: RecoveryPasswordContext): Observable<any> {
    const headers = this.initCsrfHeaders();

    return this.httpClient
      .post(modulenv.userUrl + 'password-recovery/', {
        secure_code: context.secure_code,
        password1: context.password1,
        password2: context.password2,
      }, { withCredentials: true, headers: headers })
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
    const headers = this.initAuthHeaders();
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
  getOptions(context: optionContext): Observable<any> {
    const headers = this.initAuthHeaders();
    const url = (context.identifiers ? modulenv.optionUrl + '?identifiers=' + context.identifiers : modulenv.optionUrl);

    return this.httpClient
      .get(url, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /*** 
   * Get basic options (username, email, password, ect) 
   */
  getBasicOptions(): Observable<any> {
    const headers = this.initAuthHeaders();
    const url = modulenv.optionUrl + '?securities=1';

    return this.httpClient
      .get(url, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /*** 
   * Request change option action 
   */
  requestChange(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.optionUrl + 'request-change/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /*** 
   * Check value change used or not 
   */
  changeCheck(context: any): Observable<any> {
    const headers = this.initAuthHeaders();

    return this.httpClient
      .post(modulenv.optionUrl + 'change-check/', context, { withCredentials: true, headers: headers })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

}
