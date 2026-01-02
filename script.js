"use strict";

/**
 * =====================================================
 * ARREGLOS Y SENTENCIAS ITERATIVAS
 * =====================================================
 */

// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

    // REFERENCIAS A ELEMENTOS DEL HTML (DOM)
    const btnNombres = document.getElementById('btnNombres');
    const display = document.getElementById('resultado');
    const btnReiniciar = document.getElementById('btnReiniciar');

    // ASIGNACIÓN DE EVENTOS (LISTENERS)
    btnNombres.addEventListener('click', procesarNombres);

    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', reiniciarNombres);
    }

    // FUNCIÓN PRINCIPAL
    async function procesarNombres() {

        // PASO 1: Pedir los nombres como un solo string
        const inputString = await pedirDatos();

        // Si el usuario cancela, salimos
        if (!inputString) return;

        // PASO 2: Procesar el string
        // Convertimos el string en un arreglo de caracteres
        // Usamos spread operator para manejar correctamente caracteres
        const caracteres = [...inputString];

        // Encontramos las posiciones de las comas
        const indicesComas = [];
        caracteres.forEach((char, index) => {
            if (char === ',') {
                indicesComas.push(index);
            }
        });

        // PASO 3: Mostrar Resultados
        mostrarResultados(caracteres, indicesComas);
    }

    // Muestra un formulario para ingresar los nombres.
    async function pedirDatos() {
        const { value: textoIngresado } = await Swal.fire({
            title: 'Ingrese 3 nombres',
            html: `
                <div class="swal-note-input-row">
                    <label style="flex: 0 0 auto;">Nombres:</label>
                    <input id="swal-input-nombres" type="text" class="swal2-input" style="margin:0" placeholder="Ej: María,Pedro,Rodrigo">
                </div>
                <p style="font-size: 0.9em; color: #212121; margin-top: 10px;">
                    * Solo se permiten letras y comas.<br>
                    * Sin espacios ni números.
                </p>
            `,
            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Analizar',
            cancelButtonText: 'Cancelar',

            didOpen: () => {
                const input = document.getElementById('swal-input-nombres');

                // Validación en tiempo real (Input Masking)
                // Solo se permiten letras, comas y apóstrofes.
                // Reemplazamos cualquier cosa que NO sea eso con string vacío.
                input.addEventListener('input', (e) => {
                    const valorOriginal = e.target.value;
                    // Regex: Negación de (Letras a-z, acentos, ñ, coma, apóstrofe)
                    // Si encuentra algo que coincide con la negación, lo borra.
                    const valorValidado = valorOriginal.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ',]/g, '');

                    if (valorOriginal !== valorValidado) {
                        e.target.value = valorValidado;
                    }
                });
            },
            // Alerta de validación de datos
            preConfirm: () => {
                const input = document.getElementById('swal-input-nombres').value;

                if (!input) {
                    Swal.showValidationMessage('No haz ingresado ningún nombre.');
                    return false;
                }

                // Validamos que sean exactamente 3 nombres
                const partes = input.split(',');
                // Filtramos partes vacías por si acaso el usuario pone "Juan,,Pedro"
                const partesNoVacias = partes.filter(p => p.length > 0);

                if (partesNoVacias.length !== 3) {
                    Swal.showValidationMessage('Por favor, ingrese 3 nombres separados por coma (Ej: Ana,Marta,Juan).');
                    return false;
                }

                return input;
            }
        });

        return textoIngresado;
    }

    // Muestra el resultado visual de los caracteres y las comas
    function mostrarResultados(caracteres, indicesComas) {
        let claseCSS = 'resultado-final';

        // HTML para la grilla de caracteres
        let gridHtml = '<div class="char-grid">';

        caracteres.forEach((char, index) => {
            const isComma = char === ',';
            const boxClass = isComma ? 'char-box comma' : 'char-box';

            gridHtml += `
                <div class="${boxClass}">
                    <span class="char">${char}</span>
                    <span class="index">${index}</span>
                </div>
            `;
        });

        gridHtml += '</div>';

        const htmlContent = `
            <div class="${claseCSS}">
                <h3 style="margin-bottom: .7rem;">Análisis de Cadena</h3>
                
                ${gridHtml}
                
                <hr style="margin: 15px 0; opacity: 0.5;">
                <p><strong>Ubicación de las comas:</strong> ${indicesComas.join(', ')}</p>
            </div>
        `;

        // Alerta final con SweetAlert2
        Swal.fire({
            icon: 'success',
            title: '¡Procesado!',
            text: 'Se ha analizado tu cadena de nombres correctamente.',
            confirmButtonText: 'Ver Resultado'
        });

        // Renderizar en el DOM
        if (display) {
            display.style.display = 'block';
            display.innerHTML = htmlContent;
            display.scrollIntoView({ behavior: 'smooth' });
        }

        // Mostrar botón reiniciar y ocultar botón ingresar
        if (btnReiniciar) btnReiniciar.classList.remove('visually-hidden');
        if (btnNombres) btnNombres.style.display = 'none';
    }

    function reiniciarNombres() {
        if (display) {
            display.style.display = 'none';
            display.innerHTML = '';
        }
        if (btnReiniciar) {
            btnReiniciar.classList.add('visually-hidden');
        }
        if (btnNombres) {
            btnNombres.style.display = 'inline-block';
        }
    }
});