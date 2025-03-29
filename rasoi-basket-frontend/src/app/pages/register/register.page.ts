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
        area: [''] // Will be converted to array when submitting
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
      
      // Initialize seller values if needed
      const currentStoreAddress = sellerInfoGroup?.get('storeAddress')?.value;
      if (currentStoreAddress) {
        // If there's already a value, make sure it passes validation
        sellerInfoGroup?.get('storeAddress')?.updateValueAndValidity();
        if (currentStoreAddress.trim() !== '') {
          sellerInfoGroup?.get('storeAddress')?.setErrors(null);
        }
      }
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

  // Handle store address input changes
  updateStoreAddress(event: any) {
    console.log('Store address updated:', event.detail.value);
    const value = event.detail.value;
    
    if (value && value.trim()) {
      this.sellerInfo.get('storeAddress')?.setValue(value.trim(), { emitEvent: false });
      this.sellerInfo.get('storeAddress')?.updateValueAndValidity();
      this.sellerInfo.get('storeAddress')?.setErrors(null);
      
      // Force form validity update
      this.registerForm.updateValueAndValidity();
    }
  }
  
  // Handle delivery areas input changes
  updateDeliveryAreas(event: any) {
    console.log('Delivery areas updated:', event.detail.value);
    const value = event.detail.value;
    
    if (value && value.trim()) {
      this.deliveryInfo.get('area')?.setValue(value.trim(), { emitEvent: false });
      this.deliveryInfo.get('area')?.updateValueAndValidity();
      this.deliveryInfo.get('area')?.setErrors(null);
      
      // Force form validity update
      this.registerForm.updateValueAndValidity();
    }
  }

  async onSubmit() {
    this.isSubmitted = true;
    this.registerError = null;

    // Log the form values and errors for debugging
    console.log('Form values:', this.registerForm.value);
    console.log('Form errors:', this.getFormValidationErrors());
    
    // Special handling for seller form validation
    if (this.role === 'seller') {
      // Get address from DOM element as a failsafe
      try {
        const textareaElement = document.querySelector('ion-textarea[formControlName="storeAddress"]') as any;
        const actualValue = textareaElement?.value;
        console.log('Direct DOM address value:', actualValue);
        
        if (actualValue && actualValue.trim() && !this.sellerInfo.get('storeAddress')?.value) {
          console.log('Fixing missing address value from DOM');
          this.sellerInfo.get('storeAddress')?.setValue(actualValue.trim());
          this.sellerInfo.get('storeAddress')?.updateValueAndValidity();
          this.sellerInfo.get('storeAddress')?.setErrors(null);
        }
      } catch (e) {
        console.error('Error accessing DOM element:', e);
      }
      
      console.log('Seller info validation: ', {
        storeName: this.sellerInfo.get('storeName')?.value,
        storeNameValid: this.sellerInfo.get('storeName')?.valid,
        storeAddress: this.sellerInfo.get('storeAddress')?.value,
        storeAddressValid: this.sellerInfo.get('storeAddress')?.valid,
        businessRegNumber: this.sellerInfo.get('businessRegNumber')?.value,
        businessRegNumberValid: this.sellerInfo.get('businessRegNumber')?.valid,
      });
      
      // Force update seller info validation if all required fields actually have data
      const storeName = this.sellerInfo.get('storeName')?.value?.trim();
      const storeAddress = this.sellerInfo.get('storeAddress')?.value?.trim();
      const businessRegNumber = this.sellerInfo.get('businessRegNumber')?.value?.trim();
      
      // Check fields individually and fix each one
      if (storeName) {
        this.sellerInfo.get('storeName')?.setErrors(null);
      }
      
      if (storeAddress) {
        this.sellerInfo.get('storeAddress')?.setErrors(null);
      } else {
        // Try getting the value from the form object directly
        const formStoreAddress = this.registerForm.value.sellerInfo?.storeAddress;
        if (formStoreAddress && formStoreAddress.trim()) {
          this.sellerInfo.get('storeAddress')?.setValue(formStoreAddress.trim());
          this.sellerInfo.get('storeAddress')?.setErrors(null);
        }
      }
      
      if (businessRegNumber) {
        this.sellerInfo.get('businessRegNumber')?.setErrors(null);
      }
      
      if (storeName && storeAddress && businessRegNumber) {
        // Manually override validation if the data is actually present
        this.sellerInfo.setErrors(null);
        
        // Check if this fixes the form validity
        console.log('Form valid after force validation:', this.registerForm.valid);
      }
    }

    // Special handling for delivery partner validation
    if (this.role === 'delivery') {
      // Get delivery areas from DOM element as a failsafe
      try {
        const textareaElement = document.querySelector('ion-textarea[formControlName="area"]') as any;
        const actualValue = textareaElement?.value;
        console.log('Direct DOM delivery areas value:', actualValue);
        
        if (actualValue && actualValue.trim() && !this.deliveryInfo.get('area')?.value) {
          console.log('Fixing missing delivery areas value from DOM');
          this.deliveryInfo.get('area')?.setValue(actualValue.trim());
          this.deliveryInfo.get('area')?.updateValueAndValidity();
          this.deliveryInfo.get('area')?.setErrors(null);
        }
      } catch (e) {
        console.error('Error accessing DOM element:', e);
      }
      
      console.log('Delivery info validation: ', {
        vehicleType: this.deliveryInfo.get('vehicleType')?.value,
        vehicleTypeValid: this.deliveryInfo.get('vehicleType')?.valid,
        licenseNumber: this.deliveryInfo.get('licenseNumber')?.value,
        licenseNumberValid: this.deliveryInfo.get('licenseNumber')?.valid,
        area: this.deliveryInfo.get('area')?.value,
        areaValid: this.deliveryInfo.get('area')?.valid,
      });
      
      // Force update delivery info validation if all required fields actually have data
      const vehicleType = this.deliveryInfo.get('vehicleType')?.value;
      const licenseNumber = this.deliveryInfo.get('licenseNumber')?.value?.trim();
      const area = this.deliveryInfo.get('area')?.value?.trim();
      
      // Check fields individually and fix each one
      if (vehicleType) {
        this.deliveryInfo.get('vehicleType')?.setErrors(null);
      }
      
      if (licenseNumber) {
        this.deliveryInfo.get('licenseNumber')?.setErrors(null);
      }
      
      if (area) {
        this.deliveryInfo.get('area')?.setErrors(null);
      } else {
        // Try getting the value from the form object directly
        const formArea = this.registerForm.value.deliveryInfo?.area;
        if (formArea && typeof formArea === 'string' && formArea.trim()) {
          this.deliveryInfo.get('area')?.setValue(formArea.trim());
          this.deliveryInfo.get('area')?.setErrors(null);
        }
      }
      
      if (vehicleType && licenseNumber && area) {
        // Manually override validation if the data is actually present
        this.deliveryInfo.setErrors(null);
        
        // Check if this fixes the form validity
        console.log('Form valid after force validation:', this.registerForm.valid);
      }
    }

    // Proceed with form submission either if valid naturally or made valid through our fixes
    if (this.registerForm.valid || 
        (this.role === 'seller' && 
         this.sellerInfo.get('storeName')?.value?.trim() && 
         this.sellerInfo.get('storeAddress')?.value?.trim() && 
         this.sellerInfo.get('businessRegNumber')?.value?.trim()) ||
        (this.role === 'delivery' && 
         this.deliveryInfo.get('vehicleType')?.value && 
         this.deliveryInfo.get('licenseNumber')?.value?.trim() && 
         this.deliveryInfo.get('area')?.value?.trim())) {
      
      this.isLoading = true;
      
      const formValue = this.registerForm.value;
      const userData: RegisterUserData = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        password: formValue.password,
        role: formValue.role,
        // Set approval status based on role
        isApproved: formValue.role === 'user', // Only customers (users) are auto-approved
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
        // Convert comma-separated area string to array
        const areaArray = formValue.deliveryInfo.area && typeof formValue.deliveryInfo.area === 'string' 
          ? formValue.deliveryInfo.area.split(',').map((item: string) => item.trim())
          : [];
        
        userData.deliveryInfo = {
          vehicleType: formValue.deliveryInfo.vehicleType,
          licenseNumber: formValue.deliveryInfo.licenseNumber,
          area: areaArray
        };
      }

      console.log('Sending registration data:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);
          
          // For auto-approved users (customers only), redirect to home page
          if (response.isApproved) {
            this.presentToast('Registration successful. Welcome to Rasoi Basket!');
            this.router.navigate(['/tabs/home']);
          } else {
            // For pending approval users (sellers, delivery), redirect to confirmation page
            this.router.navigate(['/registration-success'], { 
              state: { 
                role: formValue.role,
                email: formValue.email 
              }
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.registerError = error.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      // Highlight all invalid fields
      this.markFormGroupTouched(this.registerForm);
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

  // Force registration for when validation fails but data is present
  forceRegister() {
    console.log('Force registering with data:', this.registerForm.value);
    
    // Get values directly from form
    const formValue = this.registerForm.value;
    
    // Get store address from DOM if not in form
    let storeAddress = formValue.sellerInfo?.storeAddress;
    if (!storeAddress || !storeAddress.trim()) {
      try {
        const textareaElement = document.querySelector('ion-textarea[formControlName="storeAddress"]') as any;
        storeAddress = textareaElement?.value;
        console.log('Using DOM address value:', storeAddress);
      } catch (e) {
        console.error('Error accessing DOM element:', e);
      }
    }
    
    // Prepare user data
    const userData: RegisterUserData = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: formValue.role,
      isApproved: formValue.role === 'user',  // Only customers are auto-approved
      status: formValue.role === 'user' ? 'active' : 'pending'
    };
    
    // Add seller info if applicable
    if (formValue.role === 'seller') {
      userData.sellerInfo = {
        storeName: formValue.sellerInfo?.storeName || '',
        storeAddress: storeAddress || '',
        businessRegNumber: formValue.sellerInfo?.businessRegNumber || ''
      };
    }
    
    console.log('Force sending registration data:', userData);
    this.isLoading = true;
    
    // Register the user
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        
        // For auto-approved users (customers only), redirect to home page
        if (response.isApproved) {
          this.presentToast('Registration successful. Welcome to Rasoi Basket!');
          this.router.navigate(['/tabs/home']);
        } else {
          // For pending approval users (sellers, delivery), redirect to confirmation page
          this.router.navigate(['/registration-success'], { 
            state: { 
              role: formValue.role,
              email: formValue.email 
            }
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
  
  // Force registration for delivery partners when validation fails but data is present
  forceDeliveryRegister() {
    console.log('Force registering delivery partner with data:', this.registerForm.value);
    
    // Get values directly from form
    const formValue = this.registerForm.value;
    
    // Get delivery areas from DOM if not in form
    let deliveryAreas = formValue.deliveryInfo?.area;
    if (!deliveryAreas || (typeof deliveryAreas === 'string' && !deliveryAreas.trim())) {
      try {
        const textareaElement = document.querySelector('ion-textarea[formControlName="area"]') as any;
        deliveryAreas = textareaElement?.value;
        console.log('Using DOM delivery areas value:', deliveryAreas);
      } catch (e) {
        console.error('Error accessing DOM element:', e);
      }
    }
    
    // Convert delivery areas to array if it's a string
    const areaArray = deliveryAreas && typeof deliveryAreas === 'string' 
      ? deliveryAreas.split(',').map((item: string) => item.trim())
      : [];
    
    // Prepare user data
    const userData: RegisterUserData = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: 'delivery',
      isApproved: false,  // Delivery partners need approval
      status: 'pending'
    };
    
    // Add delivery info
    userData.deliveryInfo = {
      vehicleType: formValue.deliveryInfo?.vehicleType || '',
      licenseNumber: formValue.deliveryInfo?.licenseNumber || '',
      area: areaArray
    };
    
    console.log('Force sending delivery registration data:', userData);
    this.isLoading = true;
    
    // Register the user
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        
        // Redirect to confirmation page (delivery partners always need approval)
        this.router.navigate(['/registration-success'], { 
          state: { 
            role: 'delivery',
            email: formValue.email 
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
