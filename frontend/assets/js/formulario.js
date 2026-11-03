/**
 * ==========================================================================
 * VALIDACIÓN Y GESTIÓN DE FORMULARIO DE CONTACTO Y MODAL DE SOLICITUD WHATSAPP
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
  if (!inputEl) return;
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
  if (!formEl) return;
  formEl.querySelectorAll(".form-group").forEach(group => {
    group.classList.remove("has-error");
  });
  formEl.querySelectorAll("[aria-invalid]").forEach(el => {
    el.removeAttribute("aria-invalid");
  });
}

/**
 * Infiere el valor del selector "Tipo de servicio o consulta" según el texto o contexto
 * @param {string} texto
 * @returns {string}
 */
function inferirTipoSolicitud(texto = "") {
  const t = String(texto || "").toLowerCase();
  if (!t) return "";
  if (t.includes("producto") || t.includes("catálogo") || t.includes("catalogo") || t.includes("disponibilidad") || t.includes("precio de referencia") || t.includes("comprar")) {
    return "producto";
  }
  if (t.includes("mantenimiento") || t.includes("limpieza") || t.includes("pasta térmica") || t.includes("calienta") || t.includes("ventilador")) {
    return "mantenimiento";
  }
  if (t.includes("ssd") || t.includes("ram") || t.includes("actualización") || t.includes("actualizacion") || t.includes("upgrade") || t.includes("lento")) {
    return "upgrade";
  }
  if (t.includes("no enciende") || t.includes("pantalla azul") || t.includes("bsod") || t.includes("diagnóstico") || t.includes("diagnostico") || t.includes("correctivo")) {
    return "no-enciende";
  }
  if (t.includes("portátil") || t.includes("portatil") || t.includes("laptop") || t.includes("bisagra") || t.includes("pantalla") || t.includes("teclado") || t.includes("carga")) {
    return "reparacion-laptop";
  }
  if (t.includes("sistema") || t.includes("windows") || t.includes("linux") || t.includes("formateo") || t.includes("virus") || t.includes("malware") || t.includes("programa")) {
    return "sistema";
  }
  if (t.includes("remoto") || t.includes("anydesk") || t.includes("teamviewer")) {
    return "remoto";
  }
  return "otro";
}

/**
 * Envía el registro de la solicitud al backend (/api/contacto) para que quede
 * almacenado en la Bandeja de Cotizaciones y Contacto de la consola administrativa.
 * @param {Object} payload - { nombre, telefono, email, tipo_solicitud, mensaje }
 */
async function registrarSolicitudEnBackend(payload) {
  try {
    const isDifferentDevPort = window.location.hostname === "localhost" && window.location.port !== "3000" && window.location.port !== "";
    const apiBase = window.JECTECH_API_URL || (isDifferentDevPort ? "http://localhost:3000/api" : "/api");

    const response = await fetch(`${apiBase}/contacto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    });

    if (response.ok) {
      // Notificar en tiempo real a la consola administrativa si está abierta en otra pestaña
      try {
        localStorage.setItem("tecnofix_contacto_updated", Date.now().toString());
        if (typeof window.BroadcastChannel === "function") {
          const canal = new BroadcastChannel("tecnofix_catalog_channel");
          canal.postMessage({ type: "contacto", timestamp: Date.now() });
          canal.close();
        }
      } catch (e) {}
    }
  } catch (err) {
    // Continuar con la apertura de WhatsApp aunque el servidor esté temporalmente sin conexión
  }
}

/**
 * Vincula la validación en tiempo real y el procesamiento de envío a un formulario de solicitud
 * (tanto el de la pestaña Contacto como el del Modal flotante de WhatsApp).
 * @param {HTMLFormElement} formEl
 * @param {Object} [Ids] - Mapa de selectores de campos dentro de formEl
 * @param {boolean} [esModal=false] - Si el formulario está dentro del modal flotante
 */
function vincularValidacionYEnvioFormulario(formEl, Ids, esModal = false) {
  if (!formEl) return;

  const inputs = formEl.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", () => setCampoError(input, ""));
    input.addEventListener("change", () => setCampoError(input, ""));
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErroresFormulario(formEl);

    // 0. CAPA DE SEGURIDAD 1: Verificación de Campo Trampa Honeypot (Anti-Bot)
    const hpField = formEl.querySelector(Ids.hp);
    if (hpField && hpField.value.trim() !== "") {
      console.warn("[Seguridad] Envío bloqueado por activación de trampa honeypot anti-spam.");
      formEl.reset();
      if (esModal && typeof window.cerrarModal === "function") window.cerrarModal();
      return;
    }

    // 0. CAPA DE SEGURIDAD 2: Control de Frecuencia / Rate Limiting (10 segundos de enfriamiento)
    if (window.Security && typeof window.Security.checkRateLimit === "function") {
      if (!window.Security.checkRateLimit("contacto_formulario", 10)) {
        const remaining = window.Security.getRemainingCooldown("contacto_formulario", 10);
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
    const nombreInput = formEl.querySelector(Ids.nombre);
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
    const telInput = formEl.querySelector(Ids.telefono);
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
    const emailInput = formEl.querySelector(Ids.email);
    if (emailInput && emailInput.value.trim() !== "") {
      const emailVal = emailInput.value.trim();
      if (emailVal.length > 100 || !validarEmail(emailVal)) {
        setCampoError(emailInput, "El formato de correo electrónico no es válido.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = emailInput;
      }
    }

    // 4. Tipo de solicitud (Obligatorio)
    const tipoSelect = formEl.querySelector(Ids.tipo);
    if (tipoSelect) {
      if (!tipoSelect.value || tipoSelect.value === "") {
        setCampoError(tipoSelect, "Por favor selecciona el tipo de servicio o consulta.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = tipoSelect;
      }
    }

    // 5. Descripción detallada (Obligatorio, 10 - 2000 caracteres)
    const descTextarea = formEl.querySelector(Ids.mensaje);
    if (descTextarea) {
      const descVal = descTextarea.value.trim();
      if (!descVal) {
        setCampoError(descTextarea, "Por favor cuéntanos qué problema o requerimiento tienes.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = descTextarea;
      } else if (descVal.length < 10) {
        setCampoError(descTextarea, "La descripción debe tener al menos 10 caracteres.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = descTextarea;
      } else if (descVal.length > 2000) {
        setCampoError(descTextarea, "La descripción no puede exceder los 2000 caracteres.");
        esValido = false;
        if (!primerElementoInvalido) primerElementoInvalido = descTextarea;
      }
    }

    // 6. Aceptación de política de privacidad (Obligatorio)
    const privacyCheck = formEl.querySelector(Ids.privacidad);
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

    // CAPA DE SEGURIDAD 3: Sanitización de entradas
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
    const mensajeDesc = sanitizar(descTextarea.value, 2000);

    const mensajeWhatsApp =
      `Hola ${window.WHATSAPP_CONFIG?.businessName || "JecTech Soluciones"}, deseo radicar la siguiente consulta desde la web:\n\n` +
      `*Cliente:* ${nombre}\n` +
      `*Teléfono:* ${tel}\n` +
      `*Correo:* ${email}\n` +
      `*Tipo de solicitud:* ${tipo}\n\n` +
      `*Detalle de tu computador o requerimiento:*\n${mensajeDesc}\n\n` +
      `Agradezco su pronta respuesta y cotización.`;

    // 1. Registrar inmediatamente en la Bandeja de Cotizaciones y Contacto del Backend
    registrarSolicitudEnBackend({
      nombre,
      telefono: tel,
      email: email !== "No especificado" ? email : "",
      tipo_solicitud: tipo,
      mensaje: mensajeDesc,
    });

    // 2. Si estamos en el modal flotante (o enviando directamente), abrir WhatsApp y cerrar el modal
    if (esModal) {
      if (typeof window.abrirWhatsAppDirecto === "function") {
        window.abrirWhatsAppDirecto(mensajeWhatsApp);
      }
      if (typeof window.cerrarModal === "function") {
        window.cerrarModal();
      }
      if (typeof window.mostrarToast === "function") {
        window.mostrarToast("✅ ¡Solicitud registrada! Abriendo conversación en WhatsApp...", "success");
      }
      formEl.reset();
      return;
    }

    // 3. Si es el formulario estático de la pestaña Contacto (contacto.html)
    const modalConfirmacionBody = `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background-color: var(--color-success-light); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
          <svg style="width: 32px; height: 32px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 style="margin-bottom: 0.75rem;">¡Solicitud registrada y lista para enviar!</h3>
        <p style="font-size: 0.95rem; margin-bottom: 1.25rem;">
          Tu requerimiento ha quedado registrado en nuestra bandeja de atención. Ahora se abrirá <strong>WhatsApp</strong> con tu mensaje estructurado para que nuestro equipo técnico te atienda de inmediato.
        </p>
      </div>
    `;

    const modalConfirmacionFooter = `
      <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
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
          if (typeof window.abrirWhatsAppDirecto === "function") {
            window.abrirWhatsAppDirecto(mensajeWhatsApp);
          }
          if (typeof window.cerrarModal === "function") {
            window.cerrarModal();
          }
          formEl.reset();
        });
      }
    } else {
      if (typeof window.abrirWhatsAppDirecto === "function") {
        window.abrirWhatsAppDirecto(mensajeWhatsApp);
      }
      formEl.reset();
    }
  });
}

/**
 * Abre la ventana modal flotante (con overlay/backdrop idéntico a "Ver detalles")
 * con el Formulario de Solicitud de la pestaña de contacto y precarga el mensaje
 * automático de WhatsApp del botón pulsado en "Detalles de tu computador o requerimiento".
 * @param {string} [mensajeAutomatico] - Mensaje automático del botón de WhatsApp
 * @param {string} [tipoSugerido] - Valor sugerido para el selector de tipo de servicio
 */
function abrirModalSolicitudWhatsApp(mensajeAutomatico = "", tipoSugerido = "") {
  if (typeof window.abrirModal !== "function") {
    if (typeof window.abrirWhatsAppDirecto === "function") {
      window.abrirWhatsAppDirecto(mensajeAutomatico);
    }
    return;
  }

  const businessName = window.WHATSAPP_CONFIG?.businessName || "JecTech Soluciones";
  const mensajeInicial = (mensajeAutomatico && String(mensajeAutomatico).trim())
    ? String(mensajeAutomatico).replace(/\*/g, "").trim()
    : `Hola ${businessName}, deseo solicitar información sobre sus servicios técnicos y catálogo.`;

  const tipoSeleccionado = tipoSugerido || inferirTipoSolicitud(mensajeInicial);

  const bodyHtml = `
    <div class="whatsapp-request-modal-wrap">
      <p class="text-sm text-muted" style="margin-bottom: var(--spacing-5); line-height: 1.5;">
        Completa los siguientes campos para registrar tu solicitud y continuar la atención inmediata por <strong>WhatsApp</strong> con nuestro equipo técnico.
      </p>

      <form id="modal-contacto-form" novalidate aria-label="Formulario de solicitud para WhatsApp">
        
        <!-- Campo Trampa Anti-Spam / Anti-Bot (Honeypot) -->
        <div style="opacity:0;position:absolute;top:0;left:0;height:0;width:0;z-index:-1;overflow:hidden;" aria-hidden="true">
          <label for="modal-contacto-hp-field">Si eres humano, deja este campo vacío</label>
          <input type="text" id="modal-contacto-hp-field" name="_hp_security_check" tabindex="-1" autocomplete="off">
        </div>

        <div class="grid-2" style="gap: var(--spacing-4);">
          <!-- 1. Nombre Completo (Obligatorio) -->
          <div class="form-group" style="margin-bottom: var(--spacing-4);">
            <label for="modal-contacto-nombre" class="form-label">
              <span>Nombre completo</span>
              <span class="form-required" aria-hidden="true">*</span>
            </label>
            <input type="text" id="modal-contacto-nombre" class="form-input" placeholder="Ej. Juan Pérez" autocomplete="name" maxlength="80" required>
            <span class="form-error-msg" role="alert"></span>
          </div>

          <!-- 2. Teléfono / Celular (Obligatorio) -->
          <div class="form-group" style="margin-bottom: var(--spacing-4);">
            <label for="modal-contacto-telefono" class="form-label">
              <span>Teléfono o WhatsApp de contacto</span>
              <span class="form-required" aria-hidden="true">*</span>
            </label>
            <input type="tel" id="modal-contacto-telefono" class="form-input" placeholder="Ej. 300 123 4567" autocomplete="tel" maxlength="20" required>
            <span class="form-error-msg" role="alert"></span>
          </div>
        </div>

        <div class="grid-2" style="gap: var(--spacing-4);">
          <!-- 3. Correo Electrónico (Opcional) -->
          <div class="form-group" style="margin-bottom: var(--spacing-4);">
            <label for="modal-contacto-email" class="form-label">
              <span>Correo electrónico</span>
              <span class="text-xs text-muted">(Opcional)</span>
            </label>
            <input type="email" id="modal-contacto-email" class="form-input" placeholder="ejemplo@correo.com" autocomplete="email" maxlength="100">
            <span class="form-error-msg" role="alert"></span>
          </div>

          <!-- 4. Tipo de Solicitud (Obligatorio) -->
          <div class="form-group" style="margin-bottom: var(--spacing-4);">
            <label for="modal-contacto-tipo" class="form-label">
              <span>Tipo de servicio o consulta</span>
              <span class="form-required" aria-hidden="true">*</span>
            </label>
            <select id="modal-contacto-tipo" class="form-select" required>
              <option value="" disabled ${!tipoSeleccionado ? "selected" : ""}>Selecciona una opción...</option>
              <option value="mantenimiento" ${tipoSeleccionado === "mantenimiento" ? "selected" : ""}>Mantenimiento preventivo (Limpieza y pasta térmica)</option>
              <option value="reparacion-laptop" ${tipoSeleccionado === "reparacion-laptop" ? "selected" : ""}>Reparación de portátil (Pantalla, bisagra, teclado, carga)</option>
              <option value="no-enciende" ${tipoSeleccionado === "no-enciende" ? "selected" : ""}>Diagnóstico de equipo que no enciende o da pantalla azul</option>
              <option value="upgrade" ${tipoSeleccionado === "upgrade" ? "selected" : ""}>Actualización de Hardware (Instalación de SSD / RAM)</option>
              <option value="sistema" ${tipoSeleccionado === "sistema" ? "selected" : ""}>Formateo, instalación de Windows o desinfección de virus</option>
              <option value="producto" ${tipoSeleccionado === "producto" ? "selected" : ""}>Consulta de disponibilidad o compra de producto de catálogo</option>
              <option value="remoto" ${tipoSeleccionado === "remoto" ? "selected" : ""}>Soporte técnico remoto asistido</option>
              <option value="otro" ${tipoSeleccionado === "otro" ? "selected" : ""}>Otro requerimiento técnico</option>
            </select>
            <span class="form-error-msg" role="alert"></span>
          </div>
        </div>

        <!-- 5. Detalle de tu computador o requerimiento (Obligatorio, precargado con mensaje automático) -->
        <div class="form-group" style="margin-bottom: var(--spacing-4);">
          <label for="modal-contacto-mensaje" class="form-label">
            <span>Detalles de tu computador o requerimiento</span>
            <span class="form-required" aria-hidden="true">*</span>
          </label>
          <textarea id="modal-contacto-mensaje" class="form-textarea" placeholder="Indica marca, modelo aproximado y qué síntomas presenta el equipo..." maxlength="2000" style="min-height: 110px;" required></textarea>
          <span class="form-error-msg" role="alert"></span>
        </div>

        <!-- 6. Aceptación de Política de Privacidad (Obligatorio) -->
        <div class="form-group" style="margin-bottom: 0;">
          <label class="checkbox-label">
            <input type="checkbox" id="modal-contacto-privacidad" class="checkbox-input" required>
            <span>
              Autorizo el tratamiento de mis datos personales para la atención de esta solicitud técnica conforme a la Ley 1581 de 2012 de Colombia.
            </span>
          </label>
          <span class="form-error-msg" role="alert"></span>
        </div>

      </form>
    </div>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" onclick="cerrarModal()">Cancelar</button>
    <button type="submit" form="modal-contacto-form" class="btn btn-whatsapp" id="btn-submit-modal-wa">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
      Preparar solicitud para WhatsApp
    </button>
  `;

  window.abrirModal("Formulario de Solicitud", bodyHtml, footerHtml);

  const modalForm = document.getElementById("modal-contacto-form");
  const textareaMensaje = document.getElementById("modal-contacto-mensaje");
  if (textareaMensaje) {
    textareaMensaje.value = mensajeInicial;
  }

  vincularValidacionYEnvioFormulario(
    modalForm,
    {
      hp: "#modal-contacto-hp-field",
      nombre: "#modal-contacto-nombre",
      telefono: "#modal-contacto-telefono",
      email: "#modal-contacto-email",
      tipo: "#modal-contacto-tipo",
      mensaje: "#modal-contacto-mensaje",
      privacidad: "#modal-contacto-privacidad",
    },
    true
  );
}

/**
 * Inicializa la validación del formulario estático en la página de contacto (contacto.html)
 */
function inicializarFormularioContacto() {
  const formEl = document.getElementById("contacto-form");
  if (!formEl) return;

  vincularValidacionYEnvioFormulario(
    formEl,
    {
      hp: "#contacto-hp-field",
      nombre: "#contacto-nombre",
      telefono: "#contacto-telefono",
      email: "#contacto-email",
      tipo: "#contacto-tipo",
      mensaje: "#contacto-mensaje",
      privacidad: "#contacto-privacidad",
    },
    false
  );
}

// Exponer en el objeto global
window.validarEmail = validarEmail;
window.validarTelefono = validarTelefono;
window.setCampoError = setCampoError;
window.limpiarErroresFormulario = limpiarErroresFormulario;
window.inferirTipoSolicitud = inferirTipoSolicitud;
window.registrarSolicitudEnBackend = registrarSolicitudEnBackend;
window.abrirModalSolicitudWhatsApp = abrirModalSolicitudWhatsApp;
window.inicializarFormularioContacto = inicializarFormularioContacto;
