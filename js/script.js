document.addEventListener('DOMContentLoaded', function() {
    // DOM elementleri
    const jsonContent = document.getElementById('json-content');
    const lineNumbers = document.getElementById('line-numbers');
    const errorMessage = document.getElementById('error-message');

    // Örnek JSON verisi
    const sampleJson = `{
        "status": "success",
        "data": {
            "user": {
                "id": 12345,
                "name": "John Doe",
                "email": "john.doe@example.com",
                "active": true,
                "roles": ["admin", "user"],
                "preferences": {
                    "theme": "dark",
                    "notifications": {
                        "email": true,
                        "push": false
                    }
                },
                "metadata": null
            },
            "products": [
                {
                    "id": 1,
                    "name": "Laptop",
                    "price": 999.99,
                    "inStock": true,
                    "features": ["16GB RAM", "512GB SSD", "Intel i7"]
                },
                {
                    "id": 2,
                    "name": "Smartphone",
                    "price": 699.99,
                    "inStock": false,
                    "features": ["6.5\\" Display", "128GB Storage", "5G"]
                }
            ],
            "stats": {
                "totalUsers": 42,
                "activeUsers": 37,
                "inactiveUsers": 5
            }
        },
        "timestamp": "2023-05-15T12:34:56Z",
        "version": "1.0.0"
    }`;

    // JSON'u parse etme ve render etme fonksiyonu
    function parseAndRenderJson(jsonString) {
        try {
            // Hata mesajını gizle
            errorMessage.style.display = 'none';
            
            // JSON'u parse et
            const jsonData = JSON.parse(jsonString);
            
            // Render et
            renderJson(jsonData);
        } catch (error) {
            // Hata durumunda hata mesajını göster
            showJsonError(jsonString, error);
        }
    }

    // JSON'u render etme fonksiyonu
    function renderJson(jsonData) {
        jsonContent.innerHTML = '';
        const lines = formatJson(jsonData);
        jsonContent.appendChild(lines);
        updateLineNumbers();
        addCollapseListeners();
    }

    // JSON hatasını gösterme fonksiyonu
    function showJsonError(jsonString, error) {
        // Hata mesajını göster
        errorMessage.textContent = `JSON Parse Error: ${error.message}`;
        errorMessage.style.display = 'block';
        
        // JSON içeriğini temizle
        jsonContent.innerHTML = '';
        
        // JSON'u ham olarak göster
        const pre = document.createElement('pre');
        pre.textContent = jsonString;
        jsonContent.appendChild(pre);
        
        // Hata satırını bul ve vurgula
        const match = error.message.match(/at position (\d+)/);
        if (match) {
            const errorPosition = parseInt(match[1]);
            const text = jsonString.substring(0, errorPosition);
            const lineNumber = text.split('\n').length;
            
            // Satır numaralarını oluştur
            const totalLines = jsonString.split('\n').length;
            let lineNumbersHtml = '';
            for (let i = 1; i <= totalLines; i++) {
                if (i === lineNumber) {
                    lineNumbersHtml += `<div class="error-line">${i}</div>`;
                } else {
                    lineNumbersHtml += `<div>${i}</div>`;
                }
            }
            lineNumbers.innerHTML = lineNumbersHtml;
            
            // Hata satırını vurgula
            const lines = pre.textContent.split('\n');
            pre.innerHTML = '';
            lines.forEach((line, index) => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'json-line';
                if (index + 1 === lineNumber) {
                    lineDiv.classList.add('error-line');
                }
                lineDiv.textContent = line;
                pre.appendChild(lineDiv);
            });
        } else {
            // Hata pozisyonu bulunamazsa tüm satır numaralarını göster
            const totalLines = jsonString.split('\n').length;
            lineNumbers.innerHTML = Array(totalLines).fill().map((_, i) => `<div>${i + 1}</div>`).join('');
        }
    }

    // JSON'u formatlama fonksiyonu
    function formatJson(obj, indent = 0, isLast = true, parentLine = null) {
        const fragment = document.createDocumentFragment();
        let currentLine = addLine(fragment, indent);
        
        if (typeof obj !== 'object' || obj === null) {
            currentLine.innerHTML = ' '.repeat(indent) + syntaxHighlight(JSON.stringify(obj));
            return fragment;
        }

        if (Array.isArray(obj)) {
            if (obj.length === 0) {
                currentLine.innerHTML = ' '.repeat(indent) + '<span class="bracket">[ ]</span>';
                return fragment;
            }
            
            currentLine.innerHTML = ' '.repeat(indent) + '<span class="bracket">[</span><span class="collapsible"></span>';
            
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children';
            
            obj.forEach((item, i) => {
                const childLines = formatJson(item, indent + 2, i === obj.length - 1, currentLine);
                childrenContainer.appendChild(childLines);
                if (i < obj.length - 1) {
                    const commaLine = addLine(childrenContainer, indent + 2);
                    commaLine.textContent = ' '.repeat(indent + 2) + ',';
                }
            });
            
            const closingLine = addLine(fragment, indent);
            closingLine.innerHTML = ' '.repeat(indent) + '<span class="bracket">]</span>';
            
            currentLine.appendChild(childrenContainer);
            return fragment;
        } else {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                currentLine.innerHTML = ' '.repeat(indent) + '<span class="bracket">{ }</span>';
                return fragment;
            }
            
            currentLine.innerHTML = ' '.repeat(indent) + '<span class="bracket">{</span><span class="collapsible"></span>';
            
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children';
            
            keys.forEach((key, i) => {
                const keyLine = addLine(childrenContainer, indent + 2);
                keyLine.innerHTML = ' '.repeat(indent + 2) + `<span class="key">"${key}"</span>: `;
                
                const valueLines = formatJson(obj[key], indent + 2, i === keys.length - 1, keyLine);
                childrenContainer.appendChild(valueLines);
                
                if (i < keys.length - 1) {
                    const commaLine = addLine(childrenContainer, indent + 2);
                    commaLine.textContent = ' '.repeat(indent + 2) + ',';
                }
            });
            
            const closingLine = addLine(fragment, indent);
            closingLine.innerHTML = ' '.repeat(indent) + '<span class="bracket">}</span>';
            
            currentLine.appendChild(childrenContainer);
            return fragment;
        }
    }

    // Yeni satır ekleme fonksiyonu
    function addLine(container, indent) {
        const line = document.createElement('div');
        line.className = 'json-line';
        container.appendChild(line);
        return line;
    }

    // Syntax highlighting fonksiyonu
    function syntaxHighlight(json) {
        if (typeof json !== 'string') json = JSON.stringify(json);
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                cls = 'string';
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Satır numaralarını güncelleme
    function updateLineNumbers() {
        const lines = jsonContent.querySelectorAll('.json-line');
        let lineNumbersHtml = '';
        
        lines.forEach((line, index) => {
            // Gizli satırları atla (display:none olanlar)
            if (line.offsetParent !== null) {
                lineNumbersHtml += `<div>${index + 1}</div>`;
            } else {
                lineNumbersHtml += `<div></div>`;
            }
        });
        
        lineNumbers.innerHTML = lineNumbersHtml;
        
        // Satır numaraları ile içerik yüksekliğini eşitle
        lineNumbers.style.height = jsonContent.scrollHeight + 'px';
    }

    // Collapse/Expand işlevselliği ekleme
    function addCollapseListeners() {
        const collapsibles = jsonContent.querySelectorAll('.collapsible');
        collapsibles.forEach(el => {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                const parent = this.parentElement;
                parent.classList.toggle('collapsed');
                updateLineNumbers();
            });
        });
    }

    // Satır numaralarını yeniden hesaplama için MutationObserver
    const observer = new MutationObserver(updateLineNumbers);
    observer.observe(jsonContent, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['class']
    });

    // Başlangıçta JSON'u parse et ve render et
    parseAndRenderJson(sampleJson);
});
