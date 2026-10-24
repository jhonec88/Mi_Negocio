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
  if (!tel || typeof tel !== "string") return false;
  let soloDigitos = tel.replace(/\D/g, "");
  // Si incluye indicativo 57 de Colombia (ej: +57 300 123 4567 o 573001234567)
  if (soloDigitos.startsWith("57") && soloDigitos.length === 12) {
    soloDigitos = soloDigitos.slice(2);
  }
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

    // 0. CAPA DE SEGURIDAD 1: Verificación de Campo Trampa Honeypot (Anti-Bot)
    const hpField = formEl.querySelector("#contacto-hp-field");
    if (hpField && hpField.value.trim() !== "") {
      console.warn("[Seguridad] Envío bloqueado por activación de trampa honeypot anti-spam.");
      // Fallo silencioso: desorienta al bot automatizado sin notificarle
      formEl.reset();
      return;
    }

    // 0. CAPA DE SEGURIDAD 2: Control de Frecuencia / Rate Limiting (15 segundos de enfriamiento)
    if (window.Security && typeof window.Security.checkRateLimit === "function") {
      if (!window.Security.checkRateLimit("contacto_formulario", 15)) {
        const remaining = window.Security.getRemainingCooldown("contacto_formulario", 15);
        if (typeof window.mostrarToast === "function") {
          window.mostrarToast(`Por favor espera ${remaining} segundos antes de enviar una nueva solicitud.`, "info");
        } else {
          alert(`Por favor espera ${remaining} segundos antes de enviar una nueva solicitud.`);
        }
        return;
      }
    }

    let esValido = true;
    let primerElementoInvalido = null;

    // 1. Campo Nombre completo (Obligatorio, max 80 chars)
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
      } else if (nombreVal.length > 80) {
        setCampoError(nombreInput, "El nombre no puede superar los 80 caracteres.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = nombreInput;
      }
    }

    // 2. Campo Teléfono (Obligatorio, max 20 chars)
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

    // 3. Campo Correo electrónico (Opcional, max 100 chars)
    const emailInput = formEl.querySelector("#contacto-email");
    if (emailInput && emailInput.value.trim() !== "") {
      const emailVal = emailInput.value.trim();
      if (emailVal.length > 100 || !validarEmail(emailVal)) {
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

    // 5. Descripción detallada (Obligatorio, 10 - 1000 caracteres)
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
      } else if (descVal.length > 1000) {
        setCampoError(descTextarea, "La descripción no puede exceder los 1000 caracteres.");
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

    // CAPA DE SEGURIDAD 3: Sanitización profunda de entradas contra inyecciones y caracteres de control
    const sanitizar = (str, max) => {
      if (window.Security && typeof window.Security.sanitizeText === "function") {
        return window.Security.sanitizeText(str, max);
      }
      return String(str || "").replace(/[<>]/g, "").trim().slice(0, max);
    };

    const nombre = sanitizar(nombreInput.value, 80);
    const tel = sanitizar(telInput.value, 20);
    const email = emailInput && emailInput.value.trim() ? sanitizar(emailInput.value, 100) : "No especificado";
    const tipo = tipoSelect ? sanitizar(tipoSelect.options[tipoSelect.selectedIndex].text, 100) : "Servicio General";
    const mensajeDesc = sanitizar(descTextarea.value, 1000);

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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
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
window.validarEmail = validarEmail;
window.validarTelefono = validarTelefono;
window.setCampoError = setCampoError;
window.limpiarErroresFormulario = limpiarErroresFormulario;
window.inicializarFormularioContacto = inicializarFormularioContacto;
