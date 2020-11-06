const catalogURL = "json/products.json";
const productsPage = document.getElementById("products_page");

Array.prototype.clean = function (deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};
class Products {
	render() {
		fetch(catalogURL)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				let productsHTML = "";
				data.forEach((product) => {
					productsHTML += this.createPruductCard(product);
				});
				productsPage.innerHTML = productsHTML;
				this.addSteppers();
				this.choosePrice();
				this.recountPrice();
			});
	}

	createPruductCard(product) {
		const createProductsTags = (assocProducts) => {
			let toArray = assocProducts.split(/;\n|;/).clean("");
			let htmlTags = "";

			toArray.forEach((assoc) => {
				htmlTags += `<a href="#" class="url--link">${assoc},</a>`;
			});
			return htmlTags;
		};
		const createProductsUnits = (product) => {
			let unitFull = "";
			let unitFullAlt = "";
			switch (product.unitFull) {
				case "упаковка":
					unitFull = "упаковку";
					unitFullAlt = product.unitAlt;
					break;
				case "штука":
					unitFull = "штуку";
					unitFullAlt = product.unitAlt;
					break;
				case "метр погонный":
					unitFull = "метр погонный";
					unitFullAlt = product.unitAlt;
					break;
				case "комплект":
					unitFull = "комплект";
					unitFullAlt = product.unitFullAlt;
					break;
			}
			if (unitFullAlt == "штука") {
				unitFullAlt = "штуку";
			}
			if (product.unitFull === product.unitFullAlt || product.unitFullAlt === "") {
				return {
					unit: `<div class="product_units">
							<div class="unit--wrapper">
								<div class="unit--select unit--active">
									<p class="ng-binding">За ${unitFull}</p>
								</div>
							</div>
						</div>
      `,
					unitInfo: createProductsUnitInfo(product),
				};
			} else {
				return {
					unit: `
      <div class="product_units">
							<div class="unit--wrapper">
								<div class="unit--select unit--active">
									<p class="ng-binding">За ${unitFull}</p>
								</div>
								<div class="unit--select">
									<p class="ng-binding">За ${unitFullAlt}</p>
								</div>
							</div>
						</div>
      `,
					unitInfo: null,
				};
			}
		};
		const createProductsPrice = (product) => {
			return `
      <p class="product_price_club_card">
							<span class="product_price_club_card_text">По карте<br />клуба</span>
							<span class="goldPrice" altPrice="${+product.priceGold.toFixed(
								2,
							)}">${+product.priceGoldAlt.toFixed(2)}</span>
							<span class="rouble__i black__i">
								<svg
									version="1.0"
									id="rouble__b"
									xmlns="http://www.w3.org/2000/svg"
									x="0"
									y="0"
									width="30px"
									height="22px"
									viewBox="0 0 50 50"
									enable-background="new 0 0 50 50"
									xml:space="preserve"
								>
									<use
										xmlns:xlink="http://www.w3.org/1999/xlink"
										xlink:href="#rouble_black"
									></use>
								</svg>
							</span>
						</p>
						<p class="product_price_default">
							<span class="retailPrice" altPrice="${+product.priceRetail.toFixed(
								2,
							)}">${+product.priceRetailAlt.toFixed(2)}</span>
							<span class="rouble__i black__i">
								<svg
									version="1.0"
									id="rouble__g"
									xmlns="http://www.w3.org/2000/svg"
									x="0"
									y="0"
									width="30px"
									height="22px"
									viewBox="0 0 50 50"
									enable-background="new 0 0 50 50"
									xml:space="preserve"
								>
									<use
										xmlns:xlink="http://www.w3.org/1999/xlink"
										xlink:href="#rouble_gray"
									></use>
								</svg>
							</span>
						</p>
						<div class="product_price_points">
							<p class="ng-binding">Можно купить за ${product.bonusAmount} балла</p>
						</div>
      `;
		};
		const createProductsUnitInfo = (product) => {
			let unitInfo = "";
			switch (product.unit) {
				case "м/п":
					unitInfo = "Продается метрами погонными:";
					break;
				case "упак.":
					unitInfo = "Продается упаковками:";
					break;
				case "шт.":
					unitInfo = "Продается штучно:";
					break;
				case "компл":
					unitInfo = "Продается комплектом:";
					break;
			}
			return `<div class="list--unit-desc">
        <div class="unit--info">
								<div class="unit--desc-i"></div>
								<div class="unit--desc-t">
									<p>
										<span class="ng-binding">${unitInfo}</span>
										<span class="unit--infoInn">${product.unitRatio} ${
				product.unit
			} = ${product.unitRatioAlt.toFixed(2)} ${product.unitAlt} </span>
									</p>
								</div>
							</div></div>
      `;
		};
		const createProductHtml = (product) => {
			let productHtml = `
        <div class="product product_horizontal">
						<span class="product_code">Код: ${+product.code}</span>
						<div class="product_status_tooltip_container">
							<span class="product_status">Наличие</span>
						</div>
						<div class="product_photo">
							<a href="#" class="url--link product__link">
								<img src="${product.primaryImageUrl.replace(".jpg", "_220x220_1.jpg")}" />
							</a>
						</div>
						<div class="product_description">
							<a href="#" class="product__link"
								>${product.title}</a
							>
						</div>
						<div class="product_tags hidden-sm">
							<p>Могут понадобиться:</p>
							${createProductsTags(product.assocProducts)}
						</div>
						${createProductsUnits(product).unit}
						${createProductsPrice(product)}
            <div class="list--unit-padd"></div>
            
						${
							createProductsUnits(product).unitInfo
								? createProductsUnits(product).unitInfo
								: ""
						}
						<div class="product__wrapper">
							<div class="product_count_wrapper">
								<div class="stepper">
									<input class="product__count stepper-input" type="text" value="1" />
									<span class="stepper-arrow up"></span>
									<span class="stepper-arrow down"></span>
								</div>
							</div>
							<span
								class="btn btn_cart"
								data-url="/cart/"
								data-product-id="${product.productId}"
							>
								<svg class="ic ic_cart">
									<use
										xmlns:xlink="http://www.w3.org/1999/xlink"
										xlink:href="#cart"
									></use>
								</svg>
								<span class="ng-binding">В корзину</span>
							</span>
						</div>
					</div>
      `;
			return productHtml;
		};
		return createProductHtml(product);
	}

	addSteppers() {
		const stepperUp = document.querySelectorAll(".up");
		const stepperDown = document.querySelectorAll(".down");
		let input = "";
		stepperUp.forEach((up) => {
			up.addEventListener("click", () => {
				input = up.closest(".stepper").querySelector("input");
				input.value++;
				input.dispatchEvent(new Event("change"));
			});
		});
		stepperDown.forEach((down) => {
			down.addEventListener("click", () => {
				input = down.closest(".stepper").querySelector("input");
				input.value--;
				input.dispatchEvent(new Event("change"));
				if (input.value < 1) {
					input.value = 1;
				}
			});
		});
	}

	choosePrice() {
		const unitSelect = document.querySelectorAll(".unit--select");
		unitSelect.forEach((select) => {
			select.addEventListener("click", () => {
				let wrapper = "";
				let newPrice = "";
				let oldPrice = "";
				let goldPrice = "";
				let retailPrice = "";
				const change = (price) => {
					newPrice = price.getAttribute("altPrice");
					oldPrice = price.innerHTML;
					price.setAttribute("altPrice", oldPrice);
					price.innerHTML = newPrice;
				};
				if (!select.classList.contains("unit--active")) {
					wrapper = select.parentElement;
					wrapper.querySelector(".unit--active").classList.remove("unit--active");
					select.classList.add("unit--active");
					goldPrice = wrapper.closest(".product").querySelector(".goldPrice");
					change(goldPrice);
					retailPrice = wrapper.closest(".product").querySelector(".retailPrice");
					change(retailPrice);
				}
			});
		});
	}

	recountPrice() {
		const watchCount = document.querySelectorAll(".stepper-input");
		watchCount.forEach((input) => {
			let goldPrice = "";
			let retailPrice = "";
			input.addEventListener("change", () => {
				goldPrice = input.closest(".product").querySelector(".goldPrice");
				retailPrice = input.closest(".product").querySelector(".retailPrice");
			});
		});
	}
}

const productPage = new Products();
productPage.render();