import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DeeButton, DeeInput, DeeTile } from '@org/shared-ui';

@Component({
  imports: [RouterModule, DeeTile, DeeButton, DeeInput, ReactiveFormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'dee-auth';
  private readonly destroyRef = inject(DestroyRef);
  // public readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  // private readonly overlay = inject(DeeOverlayService);

  public form = new FormGroup({
    email: new FormControl({ value: 'john_doe', disabled: false }, [
      Validators.required
    ]),
    password: new FormControl({ value: 'password', disabled: false }, [
      Validators.required,
      Validators.minLength(2)
    ])
  });
  public submitted = signal(false);

  public ngOnInit(): void {
    console.log('init');
    // this.authFacade.loginSuccess$
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value) => {
    //     setTimeout(() => {
    //       if (value) {
    //         this.router.navigate(['reviews']);
    //       }
    //       this.overlay.hide();
    //     }, 1000);
    //   });
  }

  public submit() {
    this.submitted.set(true);
    if (this.form.valid) {
      // this.overlay.show(true);
      // this.authFacade.login({
      //   username: String(this.form.get('email')?.value),
      //   password: String(this.form.get('password')?.value)
      // });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
