class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.inputs = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('nameError'),
                validate: (value) => this.validateName(value)
            },
            phone: {
                element: document.getElementById('phone'),
                error: document.getElementById('phoneError'),
                validate: (value) => this.validatePhone(value)
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: (value) => this.validateEmail(value)
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('messageError'),
                validate: (value) => this.validateMessage(value)
            }
        };

        this.initializeForm();
    }

    initializeForm() {
        // Validación en tiempo real
        Object.values(this.inputs).forEach(input => {
            ['input', 'blur'].forEach(eventType => {
                input.element.addEventListener(eventType, () => {
                    this.validateField(input);
                });
            });
        });

        // Manejo del envío del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(input) {
        const value = input.element.value.trim();
        const { isValid, message } = input.validate(value);

        if (!isValid) {
            this.showError(input, message);
        } else {
            this.clearError(input);
        }

        return isValid;
    }

    validateName(value) {
        if (!value) {
            return { isValid: false, message: 'El nombre es requerido' };
        }
        if (value.length < 3) {
            return { isValid: false, message: 'El nombre debe tener al menos 3 caracteres' };
        }
        if (!/^[A-Za-zÀ-ÿ\s]{3,50}$/.test(value)) {
            return { isValid: false, message: 'El nombre solo puede contener letras' };
        }
        return { isValid: true, message: '' };
    }

    validatePhone(value) {
        if (!value) {
            return { isValid: false, message: 'El teléfono es requerido' };
        }
        if (!/^[0-9+]{9,}$/.test(value)) {
            return { isValid: false, message: 'Ingrese un número de teléfono válido' };
        }
        return { isValid: true, message: '' };
    }

    validateEmail(value) {
        if (!value) {
            return { isValid: false, message: 'El email es requerido' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Ingrese un email válido' };
        }
        return { isValid: true, message: '' };
    }

    validateMessage(value) {
        if (!value) {
            return { isValid: false, message: 'El mensaje es requerido' };
        }
        if (value.length < 10) {
            return { isValid: false, message: 'El mensaje debe tener al menos 10 caracteres' };
        }
        return { isValid: true, message: '' };
    }

    showError(input, message) {
        input.element.classList.add('contact__input--error');
        input.error.textContent = message;
    }

    clearError(input) {
        input.element.classList.remove('contact__input--error');
        input.error.textContent = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validar todos los campos
        const isValid = Object.values(this.inputs).every(input => 
            this.validateField(input)
        );

        if (!isValid) return;

        // Recopilar datos del formulario
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Aquí iría la lógica de envío del formulario
            console.log('Enviando datos:', data);
            
            // Simulación de envío
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Limpiar formulario después del envío exitoso
            this.form.reset();
            alert('Mensaje enviado con éxito');
            
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error al enviar el mensaje. Por favor, intente nuevamente.');
        }
    }
}

// Inicializar el formulario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});