
 let carts = document.querySelectorAll('.add-cart');

let products = [ 
    {
        name: "Ultra Moisturising",
        tag: "ultramoisturising",
        price: 36.50,
        inCart: 0
    },
    {
        name: "Dian Dao Shui Gao",
        tag:  "diandaoshuigao",
        price: 117.50,
        inCart: 0
    },
     {
        name:  "Ultra MoisturisingL",
        tag:   "ultramoisturisingl",
        price: 117.50,
        inCart: 0
    },
    {
        name:  "Dian Dao Shui GaoL",
        tag:   "diandaoshuigaol",
        price:  36.50,
        inCart: 0
    },
   
];

for(let i=0; i< carts.length; i++) {
    carts[i].addEventListener('click', () => {
      cartQty(products[i]);
      totalCost(products[i]);
    });
}

function onLoadCartQty(){
 let productNumbers = localStorage.getItem('cartNumbers');
 if(productNumbers){
  document.querySelector('.cart span').textContent = productNumbers;
 }
}

function cartQty(product, action){
  
 let productNumbers = localStorage.getItem('cartNumbers');
 productNumbers = parseInt(productNumbers);

let cartItems = localStorage.getItem('productsIncart');
cartItems = JSON.parse(cartItems);

if(action == "decrease"){
  localStorage.setItem('cartNumbers', productNumbers - 1);
  document.querySelector('.cart span').textContent = productNumbers - 1;
} else if(productNumbers){
  localStorage.setItem('cartNumbers', productNumbers + 1);
  document.querySelector('.cart span').textContent = productNumbers + 1;
} else {
  localStorage.setItem('cartNumbers', 1);
  document.querySelector('.cart span').textContent = 1;
}

 setItems(product);
}

function setItems(product){

 let cartItems = localStorage.getItem('productsIncart')
 cartItems = JSON.parse(cartItems);

 if(cartItems != null){
  if(cartItems[product.tag] == undefined){
   cartItems = {
     ...cartItems,
     [product.tag]: product
   }
  }
   cartItems[product.tag].inCart += 1;
 } else {
  product.inCart = 1;
 cartItems = {
  [product.tag]: product
  }
 }
 localStorage.setItem('productsIncart', JSON.stringify(cartItems) );
}

function totalCost(product, action){

 let cartCost = localStorage.getItem('totalCost');
 
if( action == "decrease") {
        cartCost = parseFloat(cartCost);
        localStorage.setItem("totalCost", cartCost - product.price);
    } else if(cartCost != null) {   
        cartCost = parseFloat(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function showShippingCart(){

    let sc = document.getElementById('shopping-cart');
    sc.style.display = 'block';
    
    let md = document.getElementById('middle-secction');
    md.style.display = 'none';
    displayCart();
}
function showShippingPage(){

    let sc = document.getElementById('shopping-cart');
    sc.style.display = 'none';
    
    let md = document.getElementById('middle-secction');
    md.style.display = 'block';
}

function displayCart(){
   let cartItems = localStorage.getItem('productsIncart');
   cartItems = JSON.parse(cartItems);

  let cartCost = localStorage.getItem('totalCost');
  cartCost = parseFloat(cartCost);

     let productContainer = document.querySelector
     (".products");

   if(cartItems && productContainer){
     
    productContainer.innerHTML = '';
    Object.values(cartItems).map(item =>{
      productContainer.innerHTML +=
      `<div class="product"><i id="test" class="fas fa-times-circle fa-2x"></i><img src="./images/${item.tag}.jpg" />
                <span class="sm-hide">${item.name}</span>
            </div>
            <div class="price sm-hide">£${parseFloat(item.price)}</div>
            <div class="quantity">
                <i class="decrease fas fa-minus-circle fa-2x"></i> 
                    &nbsp;<span>${item.inCart}</span>&nbsp;
                    <i class="increase fas fa-plus-circle fa-2x"></i>    
            </div>
            <div class="total">£${parseFloat(item.inCart * item.price)}</div>`;
    });
    productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">Basket Total</h4>
                <h4 class="basketTotal">£${cartCost}</h4>
            `
   }
      removeProduct();
      manageQuantity();
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let cartItems = localStorage.getItem('productsIncart');
    cartItems = JSON.parse(cartItems);

    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement
            .querySelector('span').textContent;
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling
            .previousElementSibling.querySelector('span')
            .textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            
            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartQty(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsIncart', JSON.stringify(cartItems));
                displayCart();
            }
        }); 
    }
    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            currentProduct = increaseButtons[i].parentElement
            .previousElementSibling
            .previousElementSibling.querySelector('span')
            .textContent.toLocaleLowerCase().replace(/ /g,'').trim();
              
                cartItems[currentProduct].inCart += 1;
                cartQty(cartItems[currentProduct]);
                totalCost(cartItems[currentProduct]);
                localStorage.setItem('productsIncart', JSON.stringify(cartItems));
                displayCart(); 
        });
    }
}


function removeProduct() {
    let deleteButtons = document.querySelectorAll('.product i');
    let productName;
     let productNumbers = localStorage.getItem('cartNumbers');
     let cartItems = localStorage.getItem('productsIncart');
     cartItems = JSON.parse(cartItems);
     let cartCost = localStorage.getItem('totalCost');
     cartCost = parseFloat(cartCost);

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent
            .trim().toLocaleLowerCase().replace(/ /g,'');

          localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
          localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsIncart', JSON.stringify(cartItems));

             displayCart();
             onLoadCartQty();
        })
    }
}


displayCart();
onLoadCartQty();
  