import { SelectedServices } from 'types';

export const message = (selectedServices: SelectedServices[], locale: string) =>
  selectedServices
    .map((service, index) => {
      const subOptionsText = service.subOptions?.length
        ? `<div style="margin-top: 4px;  font-size: 12px; padding-left: 10px;">
    <span>${
      locale === 'fi' ? 'Lisävalinnat' : 'Additional options'
    }:</span> ${service.subOptions
            .map((opt) => `${opt.key} (+${opt.price} €)`)
            .join(', ')}
  </div>`
        : '';

      const additionalInfoText = service.additionalInfo
        ? `<div style="margin-top: 4px; font-size: 12px; padding-left: 10px;">
    <span>${
      locale === 'fi' ? 'Lisätiedot' : 'Additional information'
    }:</span> ${service.additionalInfo}
  </div>`
        : '';

      const discountText = service.discount
        ? `<div style="margin-top: 4px; font-size: 12px; padding-left: 10px;">
    <span>${locale === 'fi' ? 'Alennus' : 'Discount'}:</span> ${
            service.discount
          }%
  </div>`
        : '';

      return `
<div>${index + 1}. ${service.name} - €${service.price}</div>
${subOptionsText}
${additionalInfoText}
${discountText}
</li>`;
    })
    .join('');

export const additionalInfoText = (additionalInfo: string, locale: string) =>
  additionalInfo
    ? `<p style="margin-top: 15px; margin-bottom: 15px;">${
        locale === 'fi' ? 'Lisätietoja' : 'Additional information'
      }: ${additionalInfo}</p>`
    : '';

export const deliveryFeeText = (deliveryFee: number, locale: string) =>
  `<p style="margin-top: 10px;">${
    locale === 'fi' ? 'Palvelu- ja toimitusmaksu' : 'Service and delivery fee'
  }: €${deliveryFee}</p>`;
