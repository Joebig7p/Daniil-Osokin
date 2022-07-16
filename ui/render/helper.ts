import { project, state } from "../common";
import { LayerData } from "../../src/meaxure/interfaces";

export function zoomSize(size: number) {
    return size * state.zoom / project.resolution;
}

export function percentageSize(size: number, size2: number) {
    return (Math.round(size / size2 * 1000) / 10) + "%";
}

export function unitSize(value: number, isText?: boolean) {
    // logic point
    let pt = value / project.resolution;
    // convert to display value
    let sz = Math.round(pt * state.scale * 100) / 100;
    let units = state.unit.split("/");
    let unit = units[0];
    if (units.length > 1 && isText) {
        unit = units[1];
    }
    return sz + unit;
}
export function unitCss(value) {
    let fontSize = /^font-size:/;
    let borderRadius = /^border-radius:/;
    let border = /^border:/;
    let boxShadow = /^box-shadow:/;
    let width = /^width:/;
    let height = /^height:/;
    let lineHeight = /^line-height:/;
    let layerData = state.current.layers[state.selectedIndex];
    return value.map(item => {
        if (fontSize.test(item)) {
            return 'font-size: ' + unitCssName(item);
        }
        if (width.test(item)) {
            return 'width: ' + unitWidthHeight(layerData,'width');
        }
        if (height.test(item)) {
            return 'height: ' + unitWidthHeight(layerData,'height');
        }
        if (lineHeight.test(item)) {
            return 'line-height: ' + unitCssName(item);
        }
        if (borderRadius.test(item)) {
            return 'border-radius: ' + unitCssName(item);
        }
        if (border.test(item)) {
            return unitBorder(layerData);
        }
        if (boxShadow.test(item)) {
            return unitBoxShadow(layerData)
        }
        return item
    })
}

function unitCssName(name) {
    let p = name.replace(/[^0-9]/ig, "");
    let pt = p / project.resolution;
    // convert to display value
    let sz = Math.round(pt * state.scale * 100) / 100;
    let units = state.unit.split("/");
    let unit = units[0];
    return sz + unit + ";"
}
//unit Width height
function unitWidthHeight(layerData: LayerData,value): string{
    let results = value == 'width' ? unitSize(layerData.rect.width) : unitSize(layerData.rect.height);
    return results +';'
}

// border
function unitBorder(layerData: LayerData): string {
    let borders = [];
    for (let i = layerData.borders.length - 1; i >= 0; i--) {
        let border = layerData.borders[i];
        borders.push('border: ' + unitSize(border.thickness) + ' solid ' + border.color['color-hex'].slice(0,7) +";");
    }
    return borders.join('')
}
// Box-Shadow
function unitBoxShadow(layerData: LayerData): string {
    let shadows = [];
    for (let i = layerData.shadows.length - 1; i >= 0; i--) {
        let shadow = layerData.shadows[i];
        let type = shadow.type == 'Inner' ? 'inset ' : ''
        shadows.push('box-shadow: ' + type + unitSize(shadow.offsetX) + ' ' + unitSize(shadow.offsetY) + ' ' + unitSize(shadow.blurRadius) + ' ' + unitSize(shadow.spread) + ' ', shadow.color['css-rgba'] +";");
    }
    return shadows.join('')
}

let msgTimeout;
export function message(msg) {
    let message = document.querySelector('#message') as HTMLDivElement;
    message.innerText = msg;
    message.style.display = 'inherit';
    if (msgTimeout) {
        clearTimeout(msgTimeout);
        msgTimeout = undefined;
    }
    msgTimeout = setTimeout(() => message.style.display = 'none', 1000);
}