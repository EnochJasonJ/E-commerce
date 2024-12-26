document.addEventListener('DOMContentLoaded', () => {
    const tshirtImg = document.querySelector('.im img');
    const uploadButton = document.querySelector('.imb');
    const textButton = document.getElementById('text');
    const colorButton = document.getElementById('color');
    const shareButton = document.querySelector('.pi-share-alt');
    const downloadButton = document.querySelector('.pi-download');
    let uploadedImage = null;
    let customText = null;
    let isDragging = false;
    let startX;
    let rotationDegree = 0;

    // Image Upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    uploadButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (uploadedImage) uploadedImage.remove();
            uploadedImage = new Image();
            uploadedImage.src = event.target.result;
            uploadedImage.style.cssText = `
                position: absolute;
                width: 150px;
                cursor: move;
                pointer-events: auto;
            `;
            
            const container = tshirtImg.parentElement;
            container.style.position = 'relative';
            container.appendChild(uploadedImage);
            
            makeDraggable(uploadedImage);
        };
        reader.readAsDataURL(file);
    });

    // Text Overlay
    textButton.parentElement.addEventListener('click', () => {
        const text = prompt('Enter your text:');
        if (!text) return;

        if (customText) customText.remove();
        customText = document.createElement('div');
        customText.textContent = text;
        customText.style.cssText = `
            position: absolute;
            cursor: move;
            font-size: 24px;
            color: #000;
            background: transparent;
            padding: 5px;
        `;

        const container = tshirtImg.parentElement;
        container.appendChild(customText);
        makeDraggable(customText);
    });

    // Color Change
    colorButton.parentElement.addEventListener('click', () => {
        const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'];
        const colorPicker = document.createElement('div');
        colorPicker.style.cssText = `
            position: absolute;
            display: flex;
            gap: 10px;
            background: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
        `;
      
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.style.cssText = `
                width: 30px;
                height: 30px;
                background: ${color};
                cursor: pointer;
                border: 1px solid black;
            `;
            colorDiv.addEventListener('click', () => {
                if (customText) customText.style.color = color;
                colorPicker.remove(); 
            });
            colorPicker.appendChild(colorDiv);
        });
      
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        `;
        closeButton.addEventListener('click', () => {
          colorPicker.remove(); 
        });
        colorPicker.appendChild(closeButton); 
      
        // Append colorPicker to the document body instead
        document.body.appendChild(colorPicker); 
      });

    // Share Functionality
    shareButton.addEventListener('click', () => {
        const shareData = {
            title: 'My Custom T-Shirt Design',
            text: 'Check out my custom t-shirt design!',
            url: window.location.href
        };
        try {
            navigator.share(shareData);
        } catch (err) {
            alert('Sharing is not supported on this browser');
        }
    });

    // Download Functionality
    downloadButton.addEventListener('click', () => {
        const container = tshirtImg.parentElement;
        html2canvas(container).then(canvas => {
            const link = document.createElement('a');
            link.download = 'custom-tshirt.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // Make elements draggable
    function makeDraggable(element) {
        let pos = { x: 0, y: 0 };
        
        element.addEventListener('mousedown', dragStart);
        
        function dragStart(e) {
            pos = {
                x: e.clientX - element.offsetLeft,
                y: e.clientY - element.offsetTop
            };
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }
        
        function drag(e) {
            element.style.left = (e.clientX - pos.x) + 'px';
            element.style.top = (e.clientY - pos.y) + 'px';
        }
        
        function dragEnd() {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
    }

    // T-shirt Rotation
    tshirtImg.style.transformOrigin = 'center center';
    tshirtImg.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        rotationDegree += deltaX / 5; // Adjust sensitivity
        tshirtImg.style.transform = `rotateY(${rotationDegree}deg)`;
        startX = e.clientX;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
