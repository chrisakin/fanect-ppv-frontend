import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

/**
 * Barcode component interface
 * @interface BarcodeProps
 * @property {string} value - Barcode value to encode
 * @property {number} [width] - Bar width in pixels (default: 2)
 * @property {number} [height] - Barcode height in pixels (default: 40)
 * @property {boolean} [displayValue] - Show text below barcode (default: true)
 * @property {number} [fontSize] - Font size for text (default: 12)
 * @property {string} [textColor] - Text color hex (default: #ffffff)
 * @property {string} [lineColor] - Bar color hex (default: #ffffff)
 */
interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  textColor?: string;
  lineColor?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({
  value,
  width = 2,
  height = 40,
  displayValue = true,
  fontSize = 12,
  textColor = '#ffffff',
  lineColor = '#ffffff'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Generate CODE128 barcode on canvas using JsBarcode library
   * Called on mount and value changes
   */
  useEffect(() => {
    if (canvasRef.current) {
      try {
        JsBarcode(canvasRef.current, value, {
          format: "CODE128",
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          font: textColor,
          lineColor: lineColor,
          background: "transparent",
          margin: 0
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [value, width, height, displayValue, fontSize, textColor, lineColor]);

  return <canvas ref={canvasRef} className="max-w-full" />;
};