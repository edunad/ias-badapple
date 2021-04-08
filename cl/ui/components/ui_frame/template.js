
export default (vars) => /*html*/ `
        <div class='ui-frame-title-container' id='ui-frame-${vars.id}-title-container' style='${vars.draggable ? '-webkit-app-region: drag;' : ''}background-color: ${vars.bgColor}; border-color: ${vars.bgColor}'>
            <div class='ui-frame-title' style='color: ${vars.color}' id='ui-frame-${vars.id}-title'>:// ${vars.title}</div>
            <div id='ui-frame-${vars.id}-close' style='display: flex;' class='${vars.closable ? '' : 'hidden'}'>
                <div class='ui-frame-stripes'></div>
                <div class='ui-frame-close-button'></div>
            </div>
        </div>
        
        <div class='ui-frame-content-container' id='ui-frame-${vars.id}-content-container' style='border-color: ${vars.bgColor}'>
            ${vars.children}
        </div>
        
        <div id='ui-frame-${vars.id}-qr-container' class='ui-frame-qr-container${vars.qr ? '' : ' hidden'}'>
            <div id='ui-frame-${vars.id}-qr-triangle' class='ui-frame-qr-triangle' style='border-top-color: ${vars.bgColor}' ></div>
            <ui-qr-gen id='ui-frame-${vars.id}-qr' color='${vars.bgColor}' class='ui-frame-qr' cubeSize="3"></ui-qr-gen>
        </div>
    `;
