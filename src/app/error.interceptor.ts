import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthService } from './services/auth.service'
import { UiService } from './services/ui.service'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private ui: UiService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.error.status == 401) {
          this.authService.login()
        }
        this.ui.createSnackbar(errorResponse.error.message, 'x', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'snack-alert',
        })
        return throwError(errorResponse)
      }),
    )
  }
}
