import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonCheckbox,
  IonList,
  IonListHeader,
  IonIcon,
  IonAlert,
  IonToast
} from '@ionic/angular/standalone';

// Define interface for registration data
interface RegisterUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isApproved: boolean;
  status: string;
  sellerInfo?: {
    storeName: string;
    storeAddress: string;
    businessRegNumber: string;
  };
  deliveryInfo?: {
    vehicleType: string;
    licenseNumber: string;
    area: string[];
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
    IonCheckbox,
    IonList,
    IonListHeader,
    IonIcon,
    IonAlert,
    IonToast
  ]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  registerError: string | null = null;
  availableRoles = [
    { value: 'user', label: 'Customer' },
    { value: 'seller', label: 'Restaurant Owner/Seller' },
    { value: 'delivery', label: 'Delivery Partner' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      role: ['user', Validators.required],
      // Seller specific fields
      sellerInfo: this.formBuilder.group({
        storeName: [''],
        storeAddress: [''],
        businessRegNumber: ['']
      }),
      // Delivery specific fields
      deliveryInfo: this.formBuilder.group({
        vehicleType: [''],
        licenseNumber: [''],
        area: ['']
      }),
      termsAccepted: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });

    // Listen for role changes to update validation
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.onRoleChange(role);
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  onRoleChange(role: string) {
    const sellerInfoGroup = this.registerForm.get('sellerInfo');
    const deliveryInfoGroup = this.registerForm.get('deliveryInfo');
    
    if (role === 'seller') {
      sellerInfoGroup?.get('storeName')?.setValidators([Validators.required]);
      sellerInfoGroup?.get('storeAddress')?.setValidators([Validators.required]);
      sellerInfoGroup?.get('businessRegNumber')?.setValidators([Validators.required]);
      
      // Clear delivery validators
      deliveryInfoGroup?.get('vehicleType')?.clearValidators();
      deliveryInfoGroup?.get('licenseNumber')?.clearValidators();
      deliveryInfoGroup?.get('area')?.clearValidators();
    } 
    else if (role === 'delivery') {
      deliveryInfoGroup?.get('vehicleType')?.setValidators([Validators.required]);
      deliveryInfoGroup?.get('licenseNumber')?.setValidators([Validators.required]);
      deliveryInfoGroup?.get('area')?.setValidators([Validators.required]);
      
      // Clear seller validators
      sellerInfoGroup?.get('storeName')?.clearValidators();
      sellerInfoGroup?.get('storeAddress')?.clearValidators();
      sellerInfoGroup?.get('businessRegNumber')?.clearValidators();
    } 
    else {
      // For user role, clear all validators
      sellerInfoGroup?.get('storeName')?.clearValidators();
      sellerInfoGroup?.get('storeAddress')?.clearValidators();
      sellerInfoGroup?.get('businessRegNumber')?.clearValidators();
      
      deliveryInfoGroup?.get('vehicleType')?.clearValidators();
      deliveryInfoGroup?.get('licenseNumber')?.clearValidators();
      deliveryInfoGroup?.get('area')?.clearValidators();
    }
    
    // Update validity
    sellerInfoGroup?.get('storeName')?.updateValueAndValidity();
    sellerInfoGroup?.get('storeAddress')?.updateValueAndValidity();
    sellerInfoGroup?.get('businessRegNumber')?.updateValueAndValidity();
    
    deliveryInfoGroup?.get('vehicleType')?.updateValueAndValidity();
    deliveryInfoGroup?.get('licenseNumber')?.updateValueAndValidity();
    deliveryInfoGroup?.get('area')?.updateValueAndValidity();
  }

  get form() {
    return this.registerForm.controls;
  }

  get role() {
    return this.registerForm.get('role')?.value;
  }

  get sellerInfo() {
    return this.registerForm.get('sellerInfo') as FormGroup;
  }

  get deliveryInfo() {
    return this.registerForm.get('deliveryInfo') as FormGroup;
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.registerError = null;

    // Log the form values and errors for debugging
    console.log('Form values:', this.registerForm.value);
    console.log('Form errors:', this.getFormValidationErrors());

    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const formValue = this.registerForm.value;
      const userData: RegisterUserData = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        password: formValue.password,
        role: formValue.role,
        // Set approval status based on role
        isApproved: formValue.role === 'user', // Only users are auto-approved
        status: formValue.role === 'user' ? 'active' : 'pending'
      };

      // Add seller info if applicable
      if (formValue.role === 'seller' && formValue.sellerInfo) {
        userData.sellerInfo = {
          storeName: formValue.sellerInfo.storeName,
          storeAddress: formValue.sellerInfo.storeAddress,
          businessRegNumber: formValue.sellerInfo.businessRegNumber
        };
      }

      // Add delivery info if applicable
      if (formValue.role === 'delivery' && formValue.deliveryInfo) {
        userData.deliveryInfo = {
          vehicleType: formValue.deliveryInfo.vehicleType,
          licenseNumber: formValue.deliveryInfo.licenseNumber,
          area: formValue.deliveryInfo.area
        };
      }

      console.log('Sending registration data:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);
          
          if (userData.isApproved) {
            // For regular users, redirect to home
            this.router.navigate(['/tabs/home']);
            this.presentToast('Registration successful! Welcome to Rasoi Basket.');
          } else {
            // For sellers and delivery partners, redirect to success page
            this.router.navigate(['/registration-success'], { 
              queryParams: { 
                role: userData.role,
                email: userData.email 
              }
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          this.registerError = error.error?.message || 'Registration failed. Please try again.';
          this.presentToast(this.registerError || 'Registration failed. Please try again.', 'danger');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registerForm);
      this.presentToast('Please fix the errors in the form.', 'warning');
    }
  }

  // Helper method to find all validation errors in the form
  getFormValidationErrors() {
    const result: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors = this.registerForm.get(key)?.errors;
      if (controlErrors) {
        result[key] = controlErrors;
      }
      
      // Check nested form groups
      if (key === 'sellerInfo' || key === 'deliveryInfo') {
        const nestedGroup = this.registerForm.get(key) as FormGroup;
        if (nestedGroup) {
          const nestedErrors: any = {};
          Object.keys(nestedGroup.controls).forEach(nestedKey => {
            const nestedControlErrors = nestedGroup.get(nestedKey)?.errors;
            if (nestedControlErrors) {
              nestedErrors[nestedKey] = nestedControlErrors;
            }
          });
          if (Object.keys(nestedErrors).length > 0) {
            result[key] = nestedErrors;
          }
        }
      }
    });
    return result;
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
