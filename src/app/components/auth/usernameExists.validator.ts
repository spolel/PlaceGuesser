import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';
// ...

@Injectable({
    providedIn: 'root'
})
export class UsernameExistsValidator implements AsyncValidator {

    constructor(private backend: BackendService) { }

    validate = (control: AbstractControl) => {
        if(!control.value) {
            return null
        }

        return this.backend.usernameExists(control.value).pipe(map((result: any) =>
            result.length > 0 ? { usernameAlreadyExists: true } : null
        ));
    }

}