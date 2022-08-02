import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const takenUsernames: string[] = [
    'hello',
    'world',
    'username'
    // ...
];

export class UsernameValidator {
    static createValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return checkIfUsernameExists(control.value).pipe(
                map(res => {
                    // if res is true, username exists, return true
                    return res ? { usernameExists: true } : null;
                    // NB: Return null if there is no error
                })
            );
        };
    }

}

function usernameExists(username: string): Observable<boolean> {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'https://data.mongodb-api.com/app/data-mwwux/endpoint/username_exists?username=' + username, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText)["exists"];
}

function checkIfUsernameExists(username: string): Observable<boolean> {
    return of(takenUsernames.includes(username)).pipe(delay(1000));
}
