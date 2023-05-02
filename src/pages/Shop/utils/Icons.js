import React from "react"

export const IconDelete = (props) => {
    return(
        <svg 
            fill={props.fill}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z"/>
            <path d="M0 0h48v48H0z" fill="none"/>
        </svg>
    )
}

export const IconEdit = (props) => {
    return(
        <svg 
            fill={props.fill}
            data-name="Layer 1" 
            id="Layer_1" 
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <title/>
            <path d="M170,70.5a10,10,0,0,0-10,10V140a20.06,20.06,0,0,1-20,20H60a20.06,20.06,0,0,1-20-20V60A20.06,20.06,0,0,1,60,40h59.5a10,10,0,0,0,0-20H60A40.12,40.12,0,0,0,20,60v80a40.12,40.12,0,0,0,40,40h80a40.12,40.12,0,0,0,40-40V80.5A10,10,0,0,0,170,70.5Zm-77,39a9.67,9.67,0,0,0,14,0L164.5,52a9.9,9.9,0,0,0-14-14L93,95.5A9.67,9.67,0,0,0,93,109.5Z"/>
        </svg>
    )
}

export const IconFile = (props) => {
    return(
        <svg 
            className="bi bi-file-earmark-minus-fill" 
            fill={props.fill}
            viewBox="0 0 16 16" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6 8.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1z"/>
        </svg>
    )
}

export const IconArrowDown = (props) => {
    return(
        <svg 
            fill={props.fill}
            viewBox="0 0 48 48" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z"/>
            <path d="M0-.75h48v48h-48z" fill="none"/>
        </svg>
    )
}

export const IconCreditCard = (props) => {
    return(
        <svg 
            fill={props.fill}
            id="Layer_1_1_" 
            version="1.1" 
            viewBox="0 0 16 16" 
            xmlns="http://www.w3.org/2000/svg" 
        >
            <path d="M0,12c0,1.105,0.895,2,2,2h12c1.105,0,2-0.895,2-2V7H0V12z"/>
            <path d="M14,2H2C0.895,2,0,2.895,0,4v2h16V4C16,2.895,15.105,2,14,2z"/>
        </svg>
    )
}

export const IconDollar = (props) => {
    return(
        <svg 
            fill={props.fill}
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm1-5h1a3 3 0 0 0 0-6H7.99a1 1 0 0 1 0-2H14V5h-3V3H9v2H8a3 3 0 1 0 0 6h4a1 1 0 1 1 0 2H6v2h3v2h2v-2z"/>
        </svg>
    )
}

export const IconSearch = (props) => {
    return(
        <svg 
            fill={props.fill}
            viewBox="0 0 32 32" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <title/>
            <g id="search">
                <path d="M29.71,28.29l-6.5-6.5-.07,0a12,12,0,1,0-1.39,1.39s0,.05,0,.07l6.5,6.5a1,1,0,0,0,1.42,0A1,1,0,0,0,29.71,28.29ZM14,24A10,10,0,1,1,24,14,10,10,0,0,1,14,24Z"/>
            </g>
        </svg>
    )
}

export const IconShoppingCart = (props) => {
    return(
        <svg 
            className="icon-shopping-cart"
            baseProfile="tiny" 
            fill={props.fill} 
            version="1.2" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
        >
            <g id="Layer_1">
                <g>
                    <path d="M20.756,5.345C20.565,5.126,20.29,5,20,5H6.181L5.986,3.836C5.906,3.354,5.489,3,5,3H2.75c-0.553,0-1,0.447-1,1    s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124c0.016,0.053,0.029,0.103,0.054,0.151    c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112c0.058,0.054,0.125,0.092,0.193,0.13    c0.038,0.021,0.071,0.049,0.112,0.065C6.748,16.972,6.87,17,6.999,17C7,17,18,17,18,17c0.553,0,1-0.447,1-1s-0.447-1-1-1H7.847    l-0.166-1H19c0.498,0,0.92-0.366,0.99-0.858l1-7C21.031,5.854,20.945,5.563,20.756,5.345z M18.847,7l-0.285,2H15V7H18.847z M14,7    v2h-3V7H14z M14,10v2h-3v-2H14z M10,7v2H7C6.947,9,6.899,9.015,6.852,9.03L6.514,7H10z M7.014,10H10v2H7.347L7.014,10z M15,12v-2    h3.418l-0.285,2H15z"/>
                    <circle cx="8.5" cy="19.5" r="1.5"/><circle cx="17.5" cy="19.5" r="1.5"/>
                </g>
            </g>
        </svg>
    )
}

export const IconUser = (props) => {
    return(
        <svg 
            fill={props.fill}
            version="1.1" viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
        >
            <g id="info"/>
            <g id="icons">
                <g id="user">
                    <ellipse cx="12" cy="8" rx="5" ry="6"/>
                    <path d="M21.8,19.1c-0.9-1.8-2.6-3.3-4.8-4.2c-0.6-0.2-1.3-0.2-1.8,0.1c-1,0.6-2,0.9-3.2,0.9s-2.2-0.3-3.2-0.9    C8.3,14.8,7.6,14.7,7,15c-2.2,0.9-3.9,2.4-4.8,4.2C1.5,20.5,2.6,22,4.1,22h15.8C21.4,22,22.5,20.5,21.8,19.1z"/>
                </g>
            </g>
        </svg>
    )
}

export const IconView = () => {
    return(
        <svg 
            height="24" 
            viewBox="0 0 48 48" 
            width="24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M0 0h48v48H0z" fill="none"/>
            <path d="M12 10H6c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2zm28 0h-6c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2zm-14 0h-6c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z"/>
        </svg>
    )
}
