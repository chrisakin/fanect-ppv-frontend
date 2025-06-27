import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

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