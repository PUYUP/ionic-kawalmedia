import { environment } from '../../../environments/environment';

const baseUrl     = 'api';
const appUrl      = 'user';
const host        = environment.host;
const path        = host + '/' + baseUrl + '/' + appUrl;

export const modulenv = {
    loginUrl: path + '/token/',
    userUrl: path + '/persons/',
    optionUrl: path + '/person-options/',
};
