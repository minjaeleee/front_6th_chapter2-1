// 상수 import
import {
  PRODUCT_IDS,
  DISCOUNT_RATES,
  POINT_RATES,
  STOCK_THRESHOLDS,
  TIME_INTERVALS,
  DAYS_OF_WEEK,
} from './constants.js';

// 유틸리티 함수 import
import { updateProductSelectOptions } from './utils/productUtils.js';
import { calculateCart } from './utils/cartUtils.js';

// 컴포넌트 import
import { createApp } from './components/App.js';
import { createCartItem } from './components/CartDisplay.js';

// 전역 변수들
let prodList;
let lastSel;
let sel;
let addBtn;
let cartDisp;

function main() {
  let lightningDelay;
  lastSel = null;
  prodList = [
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: '버그 없애는 키보드',
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: '생산성 폭발 마우스',
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: '거북목 탈출 모니터암',
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.LAPTOP_CASE,
      name: '에러 방지 노트북 파우치',
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
  const app = createApp();
  sel = app.productSelector.select;
  addBtn = app.productSelector.addButton;
  cartDisp = app.cartDisplay;

  updateProductSelectOptions(prodList, sel);
  calculateCart(prodList, cartDisp);
  lightningDelay = Math.random() * TIME_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY;
  setTimeout(() => {
    setInterval(function () {
      var luckyIdx = Math.floor(Math.random() * prodList.length);
      var luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        luckyItem.val = Math.round(luckyItem.originalVal * (1 - DISCOUNT_RATES.LIGHTNING_SALE_DISCOUNT));
        luckyItem.onSale = true;
        alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductSelectOptions(prodList, sel);
        doUpdatePricesInCart();
      }
    }, TIME_INTERVALS.LIGHTNING_SALE_DELAY);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (cartDisp.children.length === 0) {
      }
      if (lastSel) {
        var suggest = null;
        for (var k = 0; k < prodList.length; k++) {
          if (prodList[k].id !== lastSel) {
            if (prodList[k].q > 0) {
              if (!prodList[k].suggestSale) {
                suggest = prodList[k];
                break;
              }
            }
          }
        }
        if (suggest) {
          alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * (1 - DISCOUNT_RATES.SUGGESTION_DISCOUNT));
          suggest.suggestSale = true;
          updateProductSelectOptions(prodList, sel);
          doUpdatePricesInCart();
        }
      }
    }, TIME_INTERVALS.SUGGESTION_DELAY);
  }, Math.random() * TIME_INTERVALS.LIGHTNING_SALE_INITIAL_DELAY);
}

function doUpdatePricesInCart() {
  let j = 0;
  let cartItems;
  cartItems = cartDisp.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  calculateCart(prodList, cartDisp);
}

main();

addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  let hasItem = false;
  for (let idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }
  let itemToAdd = null;
  for (let j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = createCartItem(itemToAdd, 1);
      cartDisp.appendChild(newItem);
      itemToAdd.q--;
    }
    calculateCart(prodList, cartDisp);
    lastSel = selItem;
  }
});

cartDisp.addEventListener('click', function (event) {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;
    for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      itemElem.remove();
    }
    if (prod && prod.q < 5) {
    }
    calculateCart(prodList, cartDisp);
    updateProductSelectOptions(prodList, sel);
  }
});
