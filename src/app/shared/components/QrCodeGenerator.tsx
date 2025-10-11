// QrCodeGenerator.tsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeGeneratorProps {
    val: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ val }) => {
    // Если uuid пустой или не передан, мы не будем ничего отображать.
    if (!val) {
        return <p>Val не предоставлен.</p>;
    }

    return (

        <QRCodeSVG
            value={val}
            size={80} // Можно настроить размер
            level={'M'} // Уровень коррекции ошибок. "H" (High) обеспечивает лучшую надёжность.
        />

        // <div style={{ padding: '10px', border: '1px solid #ddd', display: 'inline-block' }}>
        //     {/* <QRCodeSVG /> - это компонент из библиотеки, который создает QR-код в виде SVG.
        //         `value` - это самый важный пропс, он содержит строку, которую мы хотим закодировать.
        //         `size` - это размер QR-кода в пикселях.
        //     */}
        //     <QRCodeSVG
        //         value={uuid}
        //         size={80} // Можно настроить размер
        //         level={'M'} // Уровень коррекции ошибок. "H" (High) обеспечивает лучшую надёжность.
        //     />
        //     {/* Дополнительный текст, чтобы показать, какой UUID был использован */}
        //     {/*<p style={{ marginTop: '10px', fontSize: '12px', wordBreak: 'break-all' }}>*/}
        //     {/*    UUID: {uuid}*/}
        //     {/*</p>*/}
        // </div>
    );
};

export default QrCodeGenerator;