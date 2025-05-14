import jsPDF from 'jspdf';
import 'jspdf-autotable';

import camionetaImg from '../assets/camioneta.jpg';
import combustibleImg from '../assets/combustible.jpg';
import LogoImg from '../assets/logo.png';

const agregarImagenes = (doc) => {
    doc.addImage(camionetaImg, 'JPEG', 20, 200, 80, 40);
    doc.addImage(combustibleImg, 'JPEG', 120, 200, 60, 40);
};

export const generarPDFEntrega = (entrega) => {
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Obtener el ancho de la página de forma dinámica
    const pageWidth = doc.internal.pageSize.getWidth
        ? doc.internal.pageSize.getWidth()
        : doc.internal.pageSize.width;

    // Logo
    doc.addImage(LogoImg, 'PNG', pageWidth / 2 - 25, 10, 50, 30);
    // Título
    doc.text(
        'REGISTRO DE ENTREGA Y RECEPCIÓN DE VEHÍCULO INSTITUCIONAL',
        pageWidth / 2,
        40,
        { align: 'center' }
    );

    // Crear tabla principal con tres columnas
    doc.autoTable({
        startY: 45,
        head: [
            [
                'CARACTERISTICAS GENERALES',
                'KILOMETRAJE',
                'LUGAR Y FECHA'
            ]
        ],
        body: [
            [
                `Marca: ${entrega.vehiculoData?.marca || ''}\nModelo: ${entrega.vehiculoData?.modelo || ''}\nTipo: ${entrega.vehiculoData?.tipo || ''}\nPlaca: ${entrega.vehiculoData?.patente || ''}`,
                `De entrega: ${entrega.kilometrajeEntrega || ''}\nDe devolución: ${entrega.kilometrajeDevolucion || ''}`,
                `De entrega: ${entrega.fechaEntrega || ''}\nDe devolución: `
            ],
            [
                `Funcionario que entrega: ${entrega.funcionarioEntrega || ''}\nD.N.I ${entrega.dniEntrega || ''}`,
                '',
                ''
            ],
            [
                `Funcionario que recibe: ${entrega.funcionarioRecibe || ''}\nD.N.I ${entrega.dniRecibe || ''}`,
                '',
                ''
            ]
        ],
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [84, 157, 183] },
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 60 },
            2: { cellWidth: 60 }
        }
    });

    // Título del inventario
    doc.setFontSize(10);
    doc.text(
        'INVENTARIO Y CONTROL DE CONDICIONES GENERALES DEL VEHICULO',
        pageWidth / 2,
        95,
        { align: 'center' }
    );

    // Datos de la tabla de inventario
    const inventarioHeaders = [
        [
            {
                content: 'EXTERIORES',
                colSpan: 3,
                styles: { halign: 'center', fillColor: [84, 157, 183] }
            },
            {
                content: 'INTERIORES',
                colSpan: 3,
                styles: { halign: 'center', fillColor: [84, 157, 183] }
            },
            {
                content: 'ACCESORIOS',
                colSpan: 3,
                styles: { halign: 'center', fillColor: [84, 157, 183] }
            }
        ],
        ['Item', 'Antes', 'Después', 'Item', 'Antes', 'Después', 'Item', 'Antes', 'Después']
    ];

    const convertirClave = (clave) => {
        const mapeo = {
            lucesPrincipales: 'Luces principales',
            luzMedia: 'Luz media',
            luzStop: 'Luz stop - guiñadores',
            antenaRadio: 'Antena de radio',
            limpiaParabrisas: 'Un par de limpia parabrisas',
            espejoIzquierdo: 'Espejo lateral izquierdo',
            espejoDerecho: 'Espejo lateral derecho',
            vidriosLaterales: 'Vidrios laterales',
            parabrisas: 'Parabrisas y ventana trasera',
            tapones: '4 tapones de llantas',
            taponGasolina: 'Tapón de gasolina',
            carroceria: 'Carrocería sin golpes',
            parachoqueDelantero: 'Parachoques delantero',
            parachoqueTrasero: 'Parachoques trasero',
            placas: 'Placas delantera y trasera',
            calefaccion: 'Calefacción',
            radioCd: 'Radio-CD',
            bocinas: 'Bocinas',
            encendedor: 'Encendedor',
            espejoRetrovisor: 'Espejo retrovisor',
            ceniceros: 'Ceniceros',
            cinturones: 'Cinturones',
            manijasVidrios: 'Manijas de vidrios',
            pisosGoma: 'Pisos de goma',
            tapetes: 'Tapetes',
            fundaAsientos: 'Funda de asientos',
            jaladorPuertas: 'Jalador de puertas',
            sujetadorManos: 'Sujetador de manos',
            gato: 'Gato',
            llaveRueda: 'Llave de rueda',
            estucheLlaves: 'Estuche de llaves',
            triangulo: 'Triangulo',
            llantaAuxilio: 'Llanta de auxilio',
            extintor: 'Extintor',
            botiquin: 'Botiquín',
            otros: 'OTROS',
            soat: 'SOAT',
            inspeccionTecnica: 'Inspección técnica'
        };
        return mapeo[clave] || clave;
    };


    const inventarioRows = [
        ['Luces principales', entrega.inventario?.lucesPrincipales ? 'X' : '', '', 'Calefacción', entrega.inventario?.calefaccion ? 'X' : '', '', 'Gato', entrega.inventario?.gato ? 'X' : '', ''],
        ['Luz media', entrega.inventario?.luzMedia ? 'X' : '', '', 'Radio-CD', entrega.inventario?.radioCd ? 'X' : '', '', 'Llave de rueda', entrega.inventario?.llaveRueda ? 'X' : '', ''],
        ['Luz stop - guiñadores', entrega.inventario?.luzStop ? 'X' : '', '', 'Bocinas', entrega.inventario?.bocinas ? 'X' : '', '', 'Estuche de llaves', entrega.inventario?.estucheLlaves ? 'X' : '', ''],
        ['Antena de radio', entrega.inventario?.antenaRadio ? 'X' : '', '', 'Encendedor', entrega.inventario?.encendedor ? 'X' : '', '', 'Triangulo', entrega.inventario?.triangulo ? 'X' : '', ''],
        ['Un par de limpia parabrisas', entrega.inventario?.limpiaParabrisas ? 'X' : '', '', 'Espejo retrovisor', entrega.inventario?.espejoRetrovisor ? 'X' : '', '', 'Llanta de auxilio', entrega.inventario?.llantaAuxilio ? 'X' : '', ''],
        ['Espejo lateral izquierdo', entrega.inventario?.espejoIzquierdo ? 'X' : '', '', 'Ceniceros', entrega.inventario?.ceniceros ? 'X' : '', '', 'Extintor', entrega.inventario?.extintor ? 'X' : '', ''],
        ['Espejo lateral derecho', entrega.inventario?.espejoDerecho ? 'X' : '', '', 'Cinturones', entrega.inventario?.cinturones ? 'X' : '', '', 'Botiquín', entrega.inventario?.botiquin ? 'X' : '', ''],
        ['Vidrios laterales', entrega.inventario?.vidriosLaterales ? 'X' : '', '', 'Manijas de vidrios', entrega.inventario?.manijasVidrios ? 'X' : '', '', 'OTROS', entrega.inventario?.otros ? 'X' : '', ''],
        ['Parabrisas y ventana trasera', entrega.inventario?.parabrisas ? 'X' : '', '', 'Pisos de goma', entrega.inventario?.pisosGoma ? 'X' : '', '', 'SOAT', entrega.inventario?.soat ? 'X' : '', ''],
        ['4 tapones de llantas', entrega.inventario?.tapones ? 'X' : '', '', 'Tapetes', entrega.inventario?.tapetes ? 'X' : '', '', 'Inspección técnica', entrega.inventario?.inspeccionTecnica ? 'X' : '', ''],
        ['Tapón de gasolina', entrega.inventario?.taponGasolina ? 'X' : '', '', 'Funda de asientos', entrega.inventario?.fundaAsientos ? 'X' : '', '', '', '', ''],
        ['Carrocería sin golpes', entrega.inventario?.carroceria ? 'X' : '', '', 'Jalador de puertas', entrega.inventario?.jaladorPuertas ? 'X' : '', '', '', '', ''],
        ['Parachoques delantero', entrega.inventario?.parachoqueDelantero ? 'X' : '', '', 'Sujetador de manos', entrega.inventario?.sujetadorManos ? 'X' : '', '', '', '', ''],
        ['Parachoques trasero', entrega.inventario?.parachoqueTrasero ? 'X' : '', '', '', '', '', '', '', ''],
        ['Placas delantera y trasera', entrega.inventario?.placas ? 'X' : '', '', '', '', '', '', '', '']
    ];

    /* 
      Para que la tabla de inventario no se salga de la hoja, se definen márgenes laterales
      y se calcula un factor de escala para ajustar los anchos originales de las columnas.
      Los anchos originales son:
        - Columnas 0, 3 y 6: 38 mm
        - Columnas 1, 2, 4, 5, 7 y 8: 15 mm
      El ancho total original de la tabla es: (38+15+15)*3 = 204 mm.
      Si se desean márgenes laterales de 15 mm en una hoja de 210 mm (A4), el ancho disponible es:
        210 - 15 - 15 = 180 mm.
    */
    const leftMargin = 15;
    const rightMargin = 15;
    const availableWidth = pageWidth - leftMargin - rightMargin; // Ej: 180 mm en A4
    const originalTableWidth = 38 + 15 + 15 + 38 + 15 + 15 + 38 + 15 + 15; // 204 mm
    const scaleFactor = availableWidth / originalTableWidth; // Ej: 180 / 204 ≈ 0.882

    // Calcular nuevas anchuras para cada columna
    const col0Width = 38 * scaleFactor;
    const col1Width = 15 * scaleFactor;
    const col2Width = 15 * scaleFactor;

    doc.autoTable({
        startY: 100,
        startX: leftMargin,
        head: inventarioHeaders, 
        body: inventarioRows,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1 },
        headStyles: {
            fillColor: [84, 157, 183],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: col0Width },
            1: { cellWidth: col1Width },
            2: { cellWidth: col2Width },
            3: { cellWidth: col0Width },
            4: { cellWidth: col1Width },
            5: { cellWidth: col2Width },
            6: { cellWidth: col0Width },
            7: { cellWidth: col1Width },
            8: { cellWidth: col2Width }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Agregar imágenes
    agregarImagenes(doc);

    // Observaciones y notas finales
    doc.setFontSize(8);
    doc.text('Observaciones:', 20, 250);
    doc.text(
        entrega.observaciones || 'UTILIZAR GAS OIL PREMIUM- INFINIA DIESEL – QUANTIUM',
        20,
        255
    );
    doc.text(
        'DIESEL – SHELL BI POWER - / PROHIBIDO FUMAR DENTRO DEL VEHÍCULO',
        20,
        260
    );
    doc.text('Se entrega tarjeta Verde', 20, 265);

    // Firmas (ajustadas más abajo)
    doc.line(40, 280, 80, 280); // Línea izquierda
    doc.line(120, 280, 160, 280); // Línea derecha
    doc.text('ENTREGUÉ CONFORME', 45, 285);
    doc.text('RECIBÍ CONFORME', 125, 285);

    return doc;
};

export default generarPDFEntrega;
