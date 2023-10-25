//* get inputs
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

//* global handlers
let mode = "create";
let updateProductbyI;

//* get final price

function getFinalPrice() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.textContent = result;
    total.style.background = "#208108fc";
  } else {
    total.textContent = "";
    total.style.background = "#f00";
  }
}

//* create product
let products;

if (localStorage.getItem("products") != null) {
  products = JSON.parse(localStorage.getItem("products"));
} else {
  products = [];
}

submit.addEventListener("click", () => {
  // if (
  //   title.value != "" &&
  //   price.value != "" &&
  //   taxes.value != "" &&
  //   ads.value != "" &&
  //   count.value != "" &&
  //   category.value != ""
  // ) {
  let newProduct = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    count: count.value,
    category: category.value,
    total: total.innerHTML,
  };

  if (mode === "create") {
    if (+newProduct.count > 1) {
      for (let prodCount = 1; prodCount <= +newProduct.count; prodCount++) {
        products.push(newProduct);
      }
    } else {
      products.push(newProduct);
    }
  } else {
    products[updateProductbyI] = newProduct;
    submit.textContent = "create";
    mode = "create";
    count.style.display = "block";
  }

  //* save it to local storage
  localStorage.setItem("products", JSON.stringify(products));
  clearForm();
  showProd();
  // }
});
//* clear form
function clearForm() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  total.innerHTML = "";
  category.value = "";
}
//* display it to the user
function showProd(filterrods) {
  getFinalPrice();
  let tableContent = "";

  for (let i = 1; i <= products.length; i++) {
    tableContent += `
        <tr>
            <td>${i}</td>
            <td>${products[i - 1].title}</td>
            <td>${products[i - 1].price}</td>
            <td>${products[i - 1].taxes}</td>
            <td>${products[i - 1].ads}</td>
            <td>${products[i - 1].discount || 0}</td>
            <td>${products[i - 1].total}</td>
            <td>${products[i - 1].category}</td>
            <td><button onclick='updateProd(${
              i - 1
            })' id="update">update</button></td>
            <td><button onclick='DelProd(${
              i - 1
            })' id="delete">delete</button></td>
        </tr>
            `;
  }
  document.getElementById("products").innerHTML = tableContent;
  let delAllContainer = document.querySelector("#delAllHolder");
  if (products.length > 1) {
    delAllContainer.innerHTML = `
      <button onclick='delAll()' id="delAll">delete all (${products.length})</button>
    `;
  } else {
    delAllContainer.innerHTML = ``;
  }
}
//* run the function all the time to see the data added by the user
showProd();
//* update displayed product in page and local storage at the same time
function updateProd(wantedprod) {
  console.log(wantedprod);
  title.value = products[wantedprod].title;
  price.value = products[wantedprod].price;
  taxes.value = products[wantedprod].taxes;
  ads.value = products[wantedprod].ads;
  discount.value = products[wantedprod].discount;
  getFinalPrice();
  count.style.display = "none";
  submit.textContent = "update";
  category.value = products[wantedprod].category;
  mode = "update";
  updateProductbyI = wantedprod;
  scroll({
    top: 0,
  });
}
//* delete displayed product in page and local storage at the same time
function DelProd(id) {
  products.splice(id, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showProd();
}
//* searching methods
let searchMode = "by Title";
let searchInput = document.getElementById("search");
function detectMode(mode) {
  if (mode === "searchByTitle") {
    searchMode = "by Title";
    searchInput.placeholder = `search ${searchMode}`;
  } else if (mode === "searchByPrice") {
    searchMode = "by Price";
    searchInput.placeholder = `search ${searchMode}`;
  } else {
    searchMode = "by Category";
    searchInput.placeholder = `search ${searchMode}`;
  }
  searchInput.focus();
}
function search(val) {
  let tableContent = ``;
  let SearchVal = val.toLowerCase();
  let found = false;
  if (searchMode === "by Title") {
    for (let i = 1; i <= products.length; i++) {
      if (products[i - 1].title.toLowerCase().includes(SearchVal)) {
        tableContent += `
          <tr>
              <td>${i}</td>
              <td>${products[i - 1].title}</td>
              <td>${products[i - 1].price}</td>
              <td>${products[i - 1].taxes}</td>
              <td>${products[i - 1].ads}</td>
              <td>${products[i - 1].discount || 0}</td>
              <td>${products[i - 1].total}</td>
              <td>${products[i - 1].category}</td>
              <td><button onclick='updateProd(${
                i - 1
              })' id="update">update</button></td>
              <td><button onclick='DelProd(${
                i - 1
              })' id="delete">delete</button></td>
          </tr>
              `;
        found = true;
      }
    }
  } else if (searchMode === "by Price") {
    let searchNumed = +SearchVal;
    for (let i = 1; i <= products.length; i++) {
      if (+products[i - 1].price >= searchNumed) {
        tableContent += `
          <tr>
              <td>${i}</td>
              <td>${products[i - 1].title}</td>
              <td>${products[i - 1].price}</td>
              <td>${products[i - 1].taxes}</td>
              <td>${products[i - 1].ads}</td>
              <td>${products[i - 1].discount || 0}</td>
              <td>${products[i - 1].total}</td>
              <td>${products[i - 1].category}</td>
              <td><button onclick='updateProd(${
                i - 1
              })' id="update">update</button></td>
              <td><button onclick='DelProd(${
                i - 1
              })' id="delete">delete</button></td>
          </tr>
              `;
        found = true;
      }
    }
  } else {
    for (let i = 1; i <= products.length; i++) {
      if (products[i - 1].category.toLowerCase().includes(SearchVal)) {
        tableContent += `
          <tr>
              <td>${i}</td>
              <td>${products[i - 1].title}</td>
              <td>${products[i - 1].price}</td>
              <td>${products[i - 1].taxes}</td>
              <td>${products[i - 1].ads}</td>
              <td>${products[i - 1].discount || 0}</td>
              <td>${products[i - 1].total}</td>
              <td>${products[i - 1].category}</td>
              <td><button onclick='updateProd(${
                i - 1
              })' id="update">update</button></td>
              <td><button onclick='DelProd(${
                i - 1
              })' id="delete">delete</button></td>
          </tr>
              `;
        found = true;
      }
    }
  }

  if (!found) {
    tableContent += `
      <tr>
        <td colspan="12" class="notFound">No products found</td>
      </tr>
    `;
  }

  document.getElementById("products").innerHTML = tableContent;
}
//* delete all displayed product in page and local storage at the same time
function delAll() {
  localStorage.clear();
  products.splice(0);
  showProd();
  if (submit.textContent === "update") {
    clearForm();
  }
  searchInput.value = "";
}
