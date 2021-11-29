import { css, html, LitElement } from 'lit';

/**
 * @element custom-button
 * @fires click
 * @slot - the default slot accepts the text to display within the button
 * @property backgroundColor - supply a custom background color to the button
 * @property size {'small'|'medium'|'large'} - display size for the button
 * @property variant {'primary'|'secondary'} - display variant for the button
 */
export class CustomButton extends LitElement {
    static get styles() {
        return [
            css`
                :host button {
                    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    font-weight: 700;
                    border: 0;
                    border-radius: 3em;
                    cursor: pointer;
                    display: inline-block;
                    line-height: 1;
                }
                :host([variant=primary]) button {
                    color: white;
                    background-color: #1ea7fd;
                }
                :host([variant=secondary]) button {
                    color: #333;
                    background-color: transparent;
                    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
                }
                :host([size=small]) button {
                    font-size: 12px;
                    padding: 10px 16px;
                }
                :host([size=medium]) button {
                    font-size: 14px;
                    padding: 11px 20px;
                }
                :host([size=large]) button {
                    font-size: 16px;
                    padding: 12px 24px;
                }
            `
        ];
    }

    static get properties() {
        return {
            variant: { type: String, reflect: true },
            size: { type: String, reflect: true },
            backgroundColor: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        this.variant = 'secondary';
        this.size = 'medium';
        this.backgroundColor = '';
    }

    handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent(new Event('click', {
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        return html`
            <button
                type="button"
                style=${this.backgroundColor && `background-color: ${this.backgroundColor}`}
                @click=${this.handleClick}
            >
                <slot></slot>
            </button>
        `;
    }
}
