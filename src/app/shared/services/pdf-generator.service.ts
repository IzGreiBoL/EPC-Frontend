import { Injectable } from '@angular/core';
import { APP_SETTINGS } from '../../core/config/app-settings.config';

export interface QuoteData {
    quoteNo: string;
    date: string;
    clientName: string;
    modelOfHouse: string;
    pricePerSqft: number;
    sqftTotal: number;
    total: number;
    stampImageUrl?: string;
    modelSelectionsRows: string;
    customerEmail: string;
    customerPhone?: string;
    customerMessage?: string;
    formattedSelections?: { category: string; subcategories: string[] }[];
}

@Injectable({
    providedIn: 'root'
})
export class PdfGeneratorService {

    constructor() { }

    /**
     * Genera un PDF de la cotización usando el template HTML con lazy loading
     */
    async generateQuotePDF(quoteData: QuoteData): Promise<Blob> {
        let pdfContainer: HTMLElement | null = null;
        
        try {
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas')
            ]);

            pdfContainer = this.createPDFTemplate(quoteData);
            
            document.body.appendChild(pdfContainer);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            });
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pageWidth = 210; // A4 width en mm
            const pageHeight = 297; // A4 height en mm
            
            const imgWidth = pageWidth;
            const imgHeightMM = (canvas.height * pageWidth) / canvas.width;
            
            if (imgHeightMM <= pageHeight) {
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeightMM);
            } else {
                let yOffset = 0;
                
                while (yOffset < imgHeightMM) {
                    if (yOffset > 0) {
                        pdf.addPage();
                    }
                    
                    const sourceY = (yOffset / imgHeightMM) * canvas.height;
                    const sourceHeight = Math.min(
                        (pageHeight / imgHeightMM) * canvas.height,
                        canvas.height - sourceY
                    );
                    
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = sourceHeight;
                    
                    const pageContext = pageCanvas.getContext('2d');
                    if (pageContext) {
                        pageContext.drawImage(
                            canvas,
                            0, sourceY, canvas.width, sourceHeight,
                            0, 0, canvas.width, sourceHeight
                        );
                        
                        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
                        const pageImgHeight = (sourceHeight * pageWidth) / canvas.width;
                        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight);
                    }
                    
                    yOffset += pageHeight;
                }
            }
            
            const blob = pdf.output('blob');
            return blob;
            
        } finally {
            if (pdfContainer && document.body.contains(pdfContainer)) {
                document.body.removeChild(pdfContainer);
            }
        }
    }

    /**
     * Crea el template HTML para el PDF basado en quote-template-pdf.html
     */
    private createPDFTemplate(data: QuoteData): HTMLElement {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = '816px';
        
        container.innerHTML = `
            <div style="
                width: 816px;
                padding: 96px;
                box-sizing: border-box;
                color: #365b6d;
                font-family: 'Montserrat', Arial, sans-serif;
                background: white;
            ">
                <div style="
                    display: grid;
                    grid-template-columns: 1fr 190px;
                    gap: 0 40px;
                    align-items: flex-start;
                ">
                    <!-- Columna izquierda -->
                    <div style="
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                    ">
                        <div style="align-self: center; margin-bottom: 24px;">
                            <img src="/images/mail-images/quote.png" alt="Quote" style="width: 240px; height: auto;" />
                        </div>
                        
                        <div style="font-size: 20px; letter-spacing: 2px; margin: 24px 0 18px 0;">
                            QUOTE NO. <span style="font-weight: normal;">${data.quoteNo}</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; gap: 24px; margin-bottom: 18px;">
                            <span style="font-size: 16px;">Quote from</span>
                            <span>
                                <span style="font-size: 16px; font-weight: bold; letter-spacing: 1px;">${APP_SETTINGS.company.name}</span><br />
                                <span style="font-size: 13px; letter-spacing: 2px; margin-top: 2px;">${APP_SETTINGS.company.tagline}</span>
                            </span>
                        </div>
                        
                        <div style="margin-bottom: 18px;">
                            <div style="font-weight: bold; font-size: 18px; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase;">
                                Model Selections
                            </div>
                            <div style="font-size: 15px;">
                                ${data.modelSelectionsRows}
                            </div>
                        </div>
                        
                        <table style="
                            width: 100%;
                            margin-top: 18px;
                            border-collapse: collapse;
                            font-size: 16px;
                            border-radius: 4px;
                            overflow: hidden;
                        ">
                            <tr style="background: #1d4355;">
                                <th style="color: #f7f7f7; font-weight: 600; padding: 8px 18px; text-align: left; letter-spacing: 1px;">
                                    Price Per sqft
                                </th>
                                <td style="color: #f7f7f7; padding: 8px 18px; text-align: right;">
                                    $${data.pricePerSqft.toFixed(2)}
                                </td>
                            </tr>
                            <tr style="background: #1d4355;">
                                <th style="color: #f7f7f7; font-weight: 600; padding: 8px 18px; text-align: left; letter-spacing: 1px;">
                                    Sqft Total
                                </th>
                                <td style="color: #f7f7f7; padding: 8px 18px; text-align: right;">
                                    ${data.sqftTotal.toLocaleString()}
                                </td>
                            </tr>
                            <tr style="background: #f2f1ec;">
                                <td style="color: #365b6d; font-size: 20px; font-weight: bold; padding: 8px 18px; text-align: left; border-top: 2px solid #22313f;">
                                    Total:
                                </td>
                                <td style="color: #365b6d; font-size: 22px; font-weight: bold; padding: 8px 18px; text-align: right; border-top: 2px solid #22313f;">
                                    $${data.total.toLocaleString()}
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Columna derecha -->
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-top: 0;
                    ">
                        <img style="width: 80px; margin-bottom: 12px;" src="/images/mail-images/epc-logo.png" alt="EPC Logo" />
                        
                        <div style="
                            background: #fff;
                            border: 1.5px solid #e6d7c1;
                            padding: 0 10px 10px 10px;
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        ">
                            <div style="font-weight: bold; font-size: 17px; letter-spacing: 1px; margin: 12px 0 18px 0; text-transform: uppercase;">
                                ${data.date}
                            </div>
                            
                            <div style="
                                width: 120px;
                                height: 150px;
                                margin: 0 auto 18px auto;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                                background: #dedad4;
                                border-radius: 4px;
                            ">
                                <img src="${data.stampImageUrl || '/images/custom/house1.jpg'}" alt="Stamp" style="
                                    width: 100px;
                                    height: 130px;
                                    object-fit: cover;
                                    border-radius: 8px;
                                    margin: 10px;
                                " />
                            </div>
                            
                            <div style="margin-top: 10px; font-size: 15px; text-align: left; width: 100%;">
                                <strong style="display: block; margin-bottom: 2px; font-size: 15px;">Quote to:</strong>
                                <div style="font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
                                    ${data.clientName}
                                </div>
                                <div style="font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
                                    ${data.modelOfHouse}
                                </div>
                            </div>
                            
                            <div style="margin: 14px 0 56px 0; font-size: 13px; text-align: left; width: 100%;">
                                *This quote will expire
                                <strong style="display: block; font-size: 15px; margin-top: 4px; text-transform: uppercase;">
                                    ${APP_SETTINGS.business.quoteValidityDays} DAYS AFTER THE DAY IT WAS MADE
                                </strong>
                            </div>
                            
                            <div style="border-top: 1px solid #22313f; align-self: center;">
                                <img src="/images/mail-images/thank-you.png" alt="Thank You" style="width: 180px; height: auto;" />
                            </div>
                        </div>
                    </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid #22313f; margin: 24px 0 12px 0;" />
                
                <div style="font-size: 14px; display: flex; justify-content: space-around; gap: 60px; margin-bottom: 12px;">
                    <div>
                        <strong style="display: block; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px;">EMAIL</strong>
                        <a href="mailto:${APP_SETTINGS.company.email}" style="color: #365b6d; text-decoration: none;">${APP_SETTINGS.company.email}</a>
                    </div>
                    <div>
                        <strong style="display: block; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px;">MOBILE</strong>
                        ${APP_SETTINGS.company.phone.business}
                    </div>
                    <div>
                        <strong style="display: block; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px;">WEBSITE</strong>
                        <a href="${APP_SETTINGS.company.website.url}" style="color: #365b6d; text-decoration: none;">${APP_SETTINGS.company.website.display}</a>
                    </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid #22313f; margin: 12px 0;" />
                
                <div style="font-size: 12px; text-align: center; letter-spacing: 0.5px;">
                    <span style="font-weight: bold; font-size: 13px; display: block; text-transform: uppercase;">
                        *THIS QUOTE IS VALID FOR ${APP_SETTINGS.business.quoteValidityDays} DAYS FROM THE DATE OF ISSUE.
                    </span>
                    <div style="font-size: 10px; margin-top: 8px; text-align: left;">
                        THIS QUOTE IS AN ESTIMATE ONLY AND DOES NOT CONSTITUTE A CONTRACT.
                        PRICES, MATERIALS, AND TIMELINES ARE SUBJECT TO CHANGE BASED ON FINAL
                        SELECTIONS, SITE CONDITIONS, AND PERMITTING. FINAL TERMS WILL BE
                        CONFIRMED IN A SIGNED CONSTRUCTION AGREEMENT.
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    /**
     * Convierte un Blob a base64 para enviar al PHP
     */
    blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}
