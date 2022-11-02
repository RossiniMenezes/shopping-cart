const cartItems = document.querySelector('.cart__items');
const clearBtn = document.querySelector('.empty-cart');
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};
const createCustomElement = (element, className, innerText) => {
  const el = document.createElement(element);
  el.className = className;
  el.innerText = innerText;
  return el;
};
const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Add to cart!'));
  return section;
};
const createAllElements = async () => {
  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(createCustomElement('span', 'loading', 'loading...'));
  const { results } = await fetchProducts('computador');
  itemsSection.innerHTML = '';
  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const myItem = createProductItemElement({ sku, name, image });
    itemsSection.appendChild(myItem);
  });
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const calculatePrice = () => Array.from(cartItems.children)
.reduce((acc, { innerHTML }) => acc + Number(innerHTML.match(/[\d*.\d*]*$/)[0]), 0);

const showPrice = () => {
  const priceText = document.querySelector('.total-price');
  priceText.innerHTML = `TOTAL: $${calculatePrice()}`;
};

const cartItemClickListener = ({ target }) => {
  target.remove();
  saveCartItems(cartItems.innerHTML);
  showPrice();
};
const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `\n Name: ${name} \n SKU: ${sku} \n  Price: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};
const addItemOnCart = async ({ target: { parentNode } }) => {
  const itemId = getSkuFromProductItem(parentNode);
  const { id: sku, title: name, price: salePrice } = await fetchItem(itemId);
  cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
  saveCartItems(cartItems.innerHTML);
  showPrice();
};
const addItemListener = async () => {
  const myButtons = document.querySelectorAll('.item__add');
  myButtons.forEach((btn) => btn.addEventListener('click', addItemOnCart));
};

const getFromLocal = () => {
  if (localStorage.length === 0) cartItems.innerHTML = '';
  cartItems.innerHTML = getSavedCartItems();
  const myLis = document.querySelectorAll('.cart__item');
  myLis.forEach((li) => li.addEventListener('click', cartItemClickListener));
};
clearBtn.addEventListener('click', () => {
  cartItems.innerHTML = '';
  localStorage.clear();
  showPrice();
});
window.onload = async () => {
  await createAllElements();
  await addItemListener();
  getFromLocal();
  showPrice();
};