/**
 * FloatBox - A fullscreen floating box for displaying multi-line text
 * 
 * @example
 * // Basic usage
 * FloatBox.setText("Hello World\nThis is line 2\nThis is line 3");
 * FloatBox.open();
 * 
 * @example
 * // Close the floatbox
 * FloatBox.close();
 * 
 * @example
 * // Toggle visibility
 * FloatBox.toggle();
 * 
 * @example
 * // Set text and open in one chain
 * FloatBox.setText("Some important message");
 * FloatBox.open();
 * 
 * @example
 * // Check if floatbox is currently open
 * if (FloatBox.isOpenState()) {
 *     console.log('FloatBox is visible');
 * }
 * 
 * @example
 * // Get current text content
 * const currentText = FloatBox.getText();
 * console.log(currentText);
 * 
 * @example
 * // Update text while open
 * FloatBox.setText("Updated content");
 * 
 * @example
 * // Long multi-line text example
 * const longText = `
 * Line 1: Introduction
 * Line 2: Details here
 * Line 3: More information
 * Line 4: Conclusion
 * `.trim();
 * FloatBox.setText(longText);
 * FloatBox.open();
 * 
 * @example
 * // Set hyperlinks with string array
 * FloatBox.setLinks([
 *     "https://www.google.com",
 *     "https://github.com",
 *     "https://stackoverflow.com"
 * ]);
 * FloatBox.open();
 * 
 * @example
 * // Set hyperlinks with object array - tries url, src, href in order
 * FloatBox.setLinks([
 *     { url: "https://www.google.com" },
 *     { src: "https://github.com" },
 *     { href: "https://stackoverflow.com" }
 * ]);
 * FloatBox.open();
 * 
 * @example
 * // Mixed array with target attribute
 * FloatBox.setLinks([
 *     { url: "https://example.com", target: "_blank" },
 *     { href: "https://example.org", target: "_self" }
 * ]);
 * FloatBox.open();
 * 
 * @example
 * // Manually select all content
 * FloatBox.setText("Some text to select");
 * FloatBox.open();
 * // Content is automatically selected, but you can also call:
 * FloatBox.selectAll();
 * 
 * Note: Press ESC key or click outside the box to close
 */
(function() {
    'use strict';

    class FloatBox {
        constructor() {
            this.container = null;
            this.contentElement = null;
            this.closeButton = null;
            this.isOpen = false;
            this.init();
        }

        /**
         * Initialize the floatbox DOM elements
         */
        init() {
            // Create container
            this.container = document.createElement('div');
            this.container.id = 'floatbox-container';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.85);
                z-index: 999999;
                display: none;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            `;

            // Create content wrapper
            const contentWrapper = document.createElement('div');
            contentWrapper.style.cssText = `
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                max-width: 80%;
                max-height: 80%;
                overflow: auto;
                position: relative;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            `;

            // Create close button
            this.closeButton = document.createElement('button');
            this.closeButton.innerHTML = '&times;';
            this.closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #333;
                line-height: 1;
                padding: 5px 10px;
                border-radius: 4px;
                transition: background-color 0.2s;
            `;
            this.closeButton.onmouseover = () => {
                this.closeButton.style.backgroundColor = '#f0f0f0';
            };
            this.closeButton.onmouseout = () => {
                this.closeButton.style.backgroundColor = 'transparent';
            };
            this.closeButton.onclick = () => this.close();

            // Create content element
            this.contentElement = document.createElement('div');
            this.contentElement.id = 'floatbox-content';
            this.contentElement.style.cssText = `
                white-space: pre-wrap;
                word-wrap: break-word;
                line-height: 1.6;
                color: #333;
                font-size: 14px;
                margin-top: 10px;
                min-width: 300px;
                min-height: 100px;
            `;

            // Assemble the structure
            contentWrapper.appendChild(this.closeButton);
            contentWrapper.appendChild(this.contentElement);
            this.container.appendChild(contentWrapper);

            // Add click outside to close
            this.container.onclick = (e) => {
                if (e.target === this.container) {
                    this.close();
                }
            };

            // Add keyboard support (ESC to close)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Append to body
            document.body.appendChild(this.container);
        }

        /**
         * Open the floatbox
         */
        open() {
            this.container.style.display = 'flex';
            this.isOpen = true;
            // Auto select all content after opening
            setTimeout(() => {
                this.selectAll();
            }, 0);
        }

        /**
         * Close the floatbox
         */
        close() {
            this.container.style.display = 'none';
            this.isOpen = false;
        }

        /**
         * Set the text content of the floatbox
         * @param {string} text - The text to display
         */
        setText(text) {
            if (typeof text === 'string') {
                this.contentElement.textContent = text;
            } else {
                console.warn('FloatBox: setText requires a string parameter');
            }
        }

        /**
         * Set hyperlinks in the floatbox, each line becomes a clickable link
         * Accepts either an array of strings (URLs) or an array of objects
         * For objects, tries url, src, href properties in order
         * Link text is always the same as the URL
         * @param {Array<string|{url?: string, src?: string, href?: string, target?: string}>} links - Array of link strings or objects
         * 
         * @example
         * // String array
         * FloatBox.setLinks([
         *     "https://www.google.com",
         *     "https://github.com"
         * ]);
         * 
         * @example
         * // Object array - tries url, src, href in order
         * FloatBox.setLinks([
         *     { url: "https://google.com" },
         *     { src: "https://github.com" },
         *     { href: "https://stackoverflow.com" }
         * ]);
         */
        setLinks(links) {
            if (!Array.isArray(links)) {
                console.warn('FloatBox: setLinks requires an array parameter');
                return;
            }

            // Clear existing content
            this.contentElement.innerHTML = '';

            // Create link elements
            links.forEach((link, index) => {
                let href, target;

                // Handle string arrays
                if (typeof link === 'string') {
                    href = link;
                    target = '_blank';
                }
                // Handle object arrays - try url, src, href in order
                else if (typeof link === 'object' && link !== null) {
                    href = link.url || link.src || link.href;
                    
                    if (!href) {
                        console.warn(`FloatBox: Link at index ${index} has no url, src, or href property`);
                        return;
                    }
                    
                    target = link.target || '_blank';
                } else {
                    console.warn(`FloatBox: Invalid link at index ${index}`);
                    return;
                }

                const linkElement = document.createElement('a');
                linkElement.href = href;
                linkElement.textContent = href; // Display text is the same as the URL
                linkElement.target = target;
                linkElement.style.cssText = `
                    display: block;
                    color: #0066cc;
                    text-decoration: none;
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 4px;
                    transition: all 0.2s;
                    font-size: 14px;
                    line-height: 1.6;
                `;

                // Hover effects
                linkElement.onmouseover = () => {
                    linkElement.style.backgroundColor = '#f0f7ff';
                    linkElement.style.color = '#0052a3';
                    linkElement.style.paddingLeft = '16px';
                };
                linkElement.onmouseout = () => {
                    linkElement.style.backgroundColor = 'transparent';
                    linkElement.style.color = '#0066cc';
                    linkElement.style.paddingLeft = '12px';
                };

                this.contentElement.appendChild(linkElement);
            });
        }

        /**
         * Get the current text content
         * @returns {string} The current text content
         */
        getText() {
            return this.contentElement.textContent || '';
        }

        /**
         * Select all content in the floatbox
         * Works for both text content and links
         */
        selectAll() {
            const selection = window.getSelection();
            const range = document.createRange();
            
            // Select all content in the content element
            range.selectNodeContents(this.contentElement);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        /**
         * Toggle the floatbox visibility
         */
        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        /**
         * Check if the floatbox is currently open
         * @returns {boolean} True if open, false otherwise
         */
        isOpenState() {
            return this.isOpen;
        }
    }

    // Create global instance
    window.FloatBox = new FloatBox();

    // Export as module if available
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = FloatBox;
    }
})();
