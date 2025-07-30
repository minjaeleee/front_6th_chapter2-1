import { STOCK_THRESHOLDS } from '../constants.js';

// 상품 선택 옵션 업데이트
export function updateProductSelectOptions(productList, productSelect) {
  let totalStock = 0;

  productSelect.innerHTML = '';

  // 총 재고 계산
  for (let idx = 0; idx < productList.length; idx++) {
    const _p = productList[idx];
    totalStock = totalStock + _p.q;
  }

  // 상품 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const opt = document.createElement('option');
    opt.value = item.id;
    let discountText = '';

    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.q === 0) {
      opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent = '⚡💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        opt.textContent = '💝' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
      }
    }
    productSelect.appendChild(opt);
  }

  // 재고 부족 시 경고 표시
  if (totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_WARNING) {
    productSelect.style.borderColor = 'orange';
  } else {
    productSelect.style.borderColor = '';
  }
}
