import { AbstractControl, ValidationErrors } from '@angular/forms';
import { validationMessage } from './constants';

export function valueConstraints(controls: AbstractControl): ValidationErrors | null {
    let controlValue: string = controls.value;
    let result = null;
    if (controlValue.length >= 6 && controlValue.length <= 8) {
        result = checkValue(controlValue);
    }
    return result;
}

function checkValue(value: string): ValidationErrors | null {
    let matchValue = null;
    let error: ValidationErrors = {};
    // check for digit
    matchValue = value.match(/\d+/);
    if (!matchValue) {
        error['containdigit'] = validationMessage.containdigit;
        return error;
    }
    // check for uppercase letter
    matchValue = value.match(/[A-Z]+/);
    if (!matchValue) {
        error['containuppercase'] = validationMessage.containuppercase;
        return error;
    }
    // check for lowecase letter
    matchValue = value.match(/[a-z]+/);
    if (!matchValue) {
        error['containlowercase'] = validationMessage.containlowercase;
        return error;
    }
    // check for not word character
    matchValue = value.match(/\W+/);
    if (!matchValue) {
        error['notword'] = validationMessage.notword;
        return error;
    }
    return null;
}