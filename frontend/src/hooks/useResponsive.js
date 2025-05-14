// src/hooks/useResponsive.js
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar diseño responsive
 * 
 * @param {number} mobileBreakpoint - Punto de quiebre para móviles (px)
 * @param {number} tabletBreakpoint - Punto de quiebre para tablets (px)
 * @returns {Object} Estado de responsive (isMobile, isTablet, isDesktop)
 */
export const useResponsive = (mobileBreakpoint = 768, tabletBreakpoint = 992) => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        // Función para actualizar el tamaño de la ventana
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Verificar si estamos en el navegador
        if (typeof window !== 'undefined') {
            // Agregar listener para el evento resize
            window.addEventListener('resize', handleResize);

            // Remover el listener cuando el componente se desmonte
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return {
        isMobile: windowSize.width < mobileBreakpoint,
        isTablet: windowSize.width >= mobileBreakpoint && windowSize.width < tabletBreakpoint,
        isDesktop: windowSize.width >= tabletBreakpoint,
        windowSize,
    };
};

/**
 * Hook para manejar el estado de la barra lateral en diseño responsive
 * 
 * @param {boolean} initialState - Estado inicial de la barra lateral
 * @param {number} breakpoint - Punto de quiebre para cambiar estado
 * @returns {Array} Estado y función para cambiar el estado
 */
export const useSidebarResponsive = (initialState = true, breakpoint = 992) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(initialState);
    const { windowSize } = useResponsive();

    useEffect(() => {
        // Si la pantalla es menor que el breakpoint, cerrar la barra lateral
        if (windowSize.width < breakpoint) {
            setIsSidebarOpen(false);
        } else {
            // Si la pantalla es mayor que el breakpoint, abrir la barra lateral
            setIsSidebarOpen(true);
        }
    }, [windowSize.width, breakpoint]);

    return [isSidebarOpen, setIsSidebarOpen];
};

export default useResponsive;