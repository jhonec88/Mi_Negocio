/**
 * ==========================================================================
 * VALIDACIÓN Y GESTIÓN DE FORMULARIO DE CONTACTO
 * Especificación Técnica Frontend: Servicio Técnico y Tienda Tecnológica
 * ==========================================================================
 */

/**
 * Valida un correo electrónico mediante expresión regular estándar
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida un número telefónico (número móvil en Colombia de 10 dígitos o fijo de 7-10)
 * @param {string} tel
 * @returns {boolean}
 */
function validarTelefono(tel) {
  const soloDigitos = tel.replace(/\D/g, "");
  return soloDigitos.length >= 7 && soloDigitos.length <= 10;
}

/**
 * Muestra u oculta error en un campo del formulario
 * @param {HTMLElement} inputEl - Elemento input/select/textarea
 * @param {string} [mensajeError] - Mensaje de error, vacío para limpiar
 */
function setCampoError(inputEl, mensajeError = "") {
  const formGroup = inputEl.closest(".form-group");
  if (!formGroup) return;

  const errorEl = formGroup.querySelector(".form-error-msg");

  if (mensajeError) {
    formGroup.classList.add("has-error");
    inputEl.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = mensajeError;
  } else {
    formGroup.classList.remove("has-error");
    inputEl.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }
}

/**
 * Limpia todos los errores del formulario
 * @param {HTMLFormElement} formEl
 */
function limpiarErroresFormulario(formEl) {
  formEl.querySelectorAll(".form-group").forEach(group => {
    group.classList.remove("has-error");
  });
  formEl.querySelectorAll("[aria-invalid]").forEach(el => {
    el.removeAttribute("aria-invalid");
  });
}

/**
 * Inicializa la validación del formulario de contacto
 */
function inicializarFormularioContacto() {
  const formEl = document.getElementById("contacto-form");
  if (!formEl) return;

  // Validación en tiempo real al escribir
  const inputs = formEl.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      setCampoError(input, "");
    });
    input.addEventListener("change", () => {
      setCampoError(input, "");
    });
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErroresFormulario(formEl);

    let esValido = true;
    let primerElementoInvalido = null;

    // 1. Campo Nombre completo (Obligatorio)
    const nombreInput = formEl.querySelector("#contacto-nombre");
    if (nombreInput) {
      const nombreVal = nombreInput.value.trim();
      if (!nombreVal) {
        setCampoError(nombreInput, "Por favor ingresa tu nombre completo.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = nombreInput;
      } else if (nombreVal.length < 3) {
        setCampoError(nombreInput, "El nombre debe tener al menos 3 caracteres.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = nombreInput;
      }
    }

    // 2. Campo Teléfono (Obligatorio)
    const telInput = formEl.querySelector("#contacto-telefono");
    if (telInput) {
      const telVal = telInput.value.trim();
      if (!telVal) {
        setCampoError(telInput, "Por favor ingresa un número de teléfono o celular.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = telInput;
      } else if (!validarTelefono(telVal)) {
        setCampoError(telInput, "Ingresa un número telefónico válido (ej. 300 123 4567).");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = telInput;
      }
    }

    // 3. Campo Correo electrónico (Opcional)
    const emailInput = formEl.querySelector("#contacto-email");
    if (emailInput && emailInput.value.trim() !== "") {
      if (!validarEmail(emailInput.value.trim())) {
        setCampoError(emailInput, "El formato de correo electrónico no es válido.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = emailInput;
      }
    }

    // 4. Tipo de solicitud (Obligatorio)
    const tipoSelect = formEl.querySelector("#contacto-tipo");
    if (tipoSelect) {
      if (!tipoSelect.value || tipoSelect.value === "") {
        setCampoError(tipoSelect, "Por favor selecciona el tipo de servicio o consulta.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = tipoSelect;
      }
    }

    // 5. Descripción detallada (Obligatorio, min 10 caracteres)
    const descTextarea = formEl.querySelector("#contacto-mensaje");
    if (descTextarea) {
      const descVal = descTextarea.value.trim();
      if (!descVal) {
        setCampoError(descTextarea, "Por favor cuéntanos brevemente qué problema o requerimiento tienes.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = descTextarea;
      } else if (descVal.length < 10) {
        setCampoError(descTextarea, "La descripción debe tener al menos 10 caracteres.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = descTextarea;
      }
    }

    // 6. Aceptación de política de privacidad (Obligatorio)
    const privacyCheck = formEl.querySelector("#contacto-privacidad");
    if (privacyCheck && !privacyCheck.checked) {
      setCampoError(privacyCheck, "Debes aceptar la autorización de tratamiento de datos personales.");
      esValido = false;
      if (!primerElementoInvalido) primerElementoInvalido = privacyCheck;
    }

    // Si hay errores, enfocar el primer campo con error
    if (!esValido) {
      if (primerElementoInvalido) primerElementoInvalido.focus();
      return;
    }

    // Si los datos son válidos, estructurar el mensaje para WhatsApp
    const nombre = nombreInput.value.trim();
    const tel = telInput.value.trim();
    const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : "No especificado";
    const tipo = tipoSelect.options[tipoSelect.selectedIndex].text;
    const mensajeDesc = descTextarea.value.trim();

    const mensajeWhatsApp = 
      `Hola ${window.WHATSAPP_CONFIG?.businessName || "TecnoFix Colombia"}, deseo radicar la siguiente consulta desde la web:\n\n` +
      `*Cliente:* ${nombre}\n` +
      `*Teléfono:* ${tel}\n` +
      `*Correo:* ${email}\n` +
      `*Tipo de solicitud:* ${tipo}\n\n` +
      `*Descripción del caso:*\n${mensajeDesc}\n\n` +
      `Agradezco su pronta respuesta y cotización.`;

    // Modal informativo transparente que aclara que se abrirá WhatsApp (Requisito Sección 9 y 20)
    const modalConfirmacionBody = `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background-color: var(--color-success-light); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <svg style="width: 32px; height: 32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 style="margin-bottom: 0.75rem;">¡Información lista para enviar!</h3>
        <p style="font-size: 0.95rem; margin-bottom: 1.25rem;">
          Los datos ingresados han sido validados correctamente. Para brindarte atención directa e inmediata, se abrirá <strong>WhatsApp</strong> con tu mensaje preparado para ser enviado a nuestro equipo técnico.
        </p>
        <p class="text-xs text-muted" style="margin-bottom: 0;">
          * Nota de transparencia: Este sitio web no almacena tus datos en base de datos; la comunicación se establece de forma directa y segura a través de WhatsApp.
        </p>
      </div>
    `;

    const modalConfirmacionFooter = `
      <button type="button" class="btn btn-outline" onclick="cerrarModal()">Regresar</button>
      <button type="button" class="btn btn-whatsapp" id="btn-confirmar-whatsapp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        Abrir WhatsApp ahora
      </button>
    `;

    if (typeof window.abrirModal === "function") {
      window.abrirModal("Confirmación de Solicitud", modalConfirmacionBody, modalConfirmacionFooter);
      
      const btnConfirmar = document.getElementById("btn-confirmar-whatsapp");
      if (btnConfirmar) {
        btnConfirmar.addEventListener("click", () => {
          if (typeof window.contactarWhatsApp === "function") {
            window.contactarWhatsApp(mensajeWhatsApp);
          }
          if (typeof window.cerrarModal === "function") {
            window.cerrarModal();
          }
          formEl.reset();
        });
      }
    } else {
      // Alternativa si el modal no estuviera activo
      window.contactarWhatsApp(mensajeWhatsApp);
      formEl.reset();
    }
  });
}

// Exponer en el objeto global
window.inicializarFormularioContacto = inicializarFormularioContacto;
