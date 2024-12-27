class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.initializeAddToCartButtons();
    }

    initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productCard = button.closest('.card');
                const product = this.extractProductData(productCard);
                this.addItem(product);
                this.showNotification(`${product.title} added to cart!`);
            });
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="pi pi-check"></i>
                <span>${message}</span>
            </div>
        `;
        document.getElementById('notification-container').appendChild(notification);
        setTimeout(() => notification.classList.remove('translate-x-full'), 0);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    };
    
    // showNotification('Product added to cart!');

    extractProductData(productCard) {
        return {
            id: productCard.dataset.productId || productCard.querySelector('.product-title').innerText,
            title: productCard.querySelector('.product-title').innerText,
            price: parseFloat(productCard.querySelector('.product-price').innerText.replace('₹', '').replace(',', '')),
            image: productCard.querySelector('img').src
        };
    }

    addItem(product) {
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        this.saveCart();
        this.updateCartUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    async generateInvoice() {
        const invoiceDate = new Date().toLocaleDateString();
        const invoiceNumber = 'INV-' + Date.now().toString().slice(-6);

        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice #${invoiceNumber}</title>
                <style>
                    * {
                        padding: 10px;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background: #ffffff;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding-left: 40px;
                        background: #ffffff;
                    }
                    .invoice-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 40px;
                    }
                    .invoice-title {
                        font-size: 28px;
                        font-weight: bold;
                        color: #000000;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    th, td {
                        padding: 12px; /* Add space inside cells */
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                        padding: 10px;
                        margin: 10px;
                    }
                    .text-right {
                        text-align: right;
                    }
                    .totals {
                        width: 300px;
                        margin-left: auto;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                    }
                    .final-total {
                        font-weight: bold;
                        border-top: 2px solid #000;
                        padding-top: 8px;
                        margin-top: 8px;
                    }
                    hr {
                        background-color: black;
                        color: black;
                    }
                    @media print {
                        body { 
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>

            </head>
            <body>
                <div class="invoice-container">
                    <div class="invoice-header">
                        <div>
                            <div class="invoice-title">INVOICE</div>
                            <div>Invoice #: ${invoiceNumber}</div>
                            <div>Date: ${invoiceDate}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">Exclusive Store</div>
                            <div>123 Fashion Street</div>
                            <div>Fashion City, FC 12345</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="text-align: left;">Item</th>
                                <th style="text-align: center;">Quantity</th>
                                <th style="text-align: right;">Price</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${this.items.map(item => `
                            <tr>
                            <td style="text-align: left;">${item.title}</td>
                            <td style="text-align: center;">${item.quantity}</td>
                            <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                            <td style="text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                            `).join('')}
                            </tbody>
                            </table>
                            <hr>

                    <div class="totals">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>₹${this.getTotalPrice()}</span>
                        </div>
                        <div class="total-row">
                            <span>Tax (18%):</span>
                            <span>₹${(this.getTotalPrice() * 0.18).toFixed(2)}</span>
                        </div>
                        <div class="total-row final-total">
                            <span>Total:</span>
                            <span>₹${(this.getTotalPrice() * 1.18).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            const blob = new Blob([invoiceHTML], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            const printFrame = document.createElement('iframe');
            printFrame.style.display = 'none';
            document.body.appendChild(printFrame);
            printFrame.src = blobUrl;
            await new Promise(resolve => {
                printFrame.onload = () => {
                    const opt = {
                        margin: [0.2, 0.2, 0.2, 0.2],
                        padding: [2,2,2,2],
                        filename: `invoice-${invoiceNumber}.pdf`,
                        image: { type: 'jpeg', quality: 1 },
                        html2canvas: { 
                            scale: 2,
                            useCORS: true,
                            backgroundColor: '#ffffff'
                        },
                        jsPDF: { 
                            unit: 'in', 
                            format: 'a4', 
                            orientation: 'portrait'
                        }
                    };
                    html2pdf()
                        .from(printFrame.contentDocument.body)
                        .set(opt)
                        .save()
                        .then(() => {
                            URL.revokeObjectURL(blobUrl);
                            printFrame.remove();
                        });

                    resolve();
                };
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');
        }
    }
    

    updateCartUI() {
        const cartContainer = document.querySelector('.cart-container');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="e404 bg-gray-100 w-1/2 p-5">
                    <i class="pi pi-exclamation-triangle text-orange-400"></i>
                    <h1 class="text-center text-3xl mt-10 text-white">Your cart is empty</h1>
                </div>`;
            return;
        }

        const cartHTML = this.items.map(item => `
            <div class="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4">
                <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold">${item.title}</h3>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" class="px-2 py-1 bg-gray-200 rounded">-</button>
                        <span class="text-gray-600">Quantity: ${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" class="px-2 py-1 bg-gray-200 rounded">+</button>
                    </div>
                    <p class="text-lg font-bold mt-2">₹${item.price}</p>
                </div>
                <button onclick="cart.removeItem('${item.id}')" class="text-red-500 hover:text-red-700">
                    <i class="pi pi-trash"></i>
                </button>
            </div>
        `).join('');

        cartContainer.innerHTML = `
            <div class="max-w-4xl mx-auto p-4">
                ${cartHTML}
                <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
                    <p class="text-xl font-bold">Total: ₹${this.getTotalPrice()}</p>
                    <div class="flex gap-4 mt-4">
                        <button onclick="cart.generateInvoice()" class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                            Generate Invoice
                        </button>
                        <button onclick = "window.location.href='delivery.html'" class="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }
}
const cart = new ShoppingCart();
