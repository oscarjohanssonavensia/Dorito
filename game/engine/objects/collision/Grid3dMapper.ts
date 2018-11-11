import Imovable from '../../../models/IMovable';


export const RESOLUTION = 0.005;   // TODO: must increase sector from 9 grid to dynamic based on imovable radius

const createGrid3d = (w: number, h: number) => {
    const res: Imovable[][][] = [];
    for (let y = 0; y < h; y++) {
        const row: Imovable[][] = [];
        for (let x = 0; x < w; x++) {
            row.push([]);
        }
        res.push(row);
    }
    return res;
}


export const addNewToGrid3d = (grid3d: Imovable[][][], list: Imovable[], all: boolean = false) => {

    let i = list.length - 1;
    for (i; i > -1; --i) {

        const item = list[i];
        if (all || item.markNewForColliders) {


            const x = Math.floor(item.pos.x * RESOLUTION);
            const y = Math.floor(item.pos.y * RESOLUTION);
            grid3d[y][x].push(item);

            item.markNewForColliders = false; // Muyo importante
        }
    }
}


export const updateGrid3dRadiusBased = (grid3d: Imovable[][][], list: Imovable[], clear: boolean) => {



    const sectorSizeModifier = clear ? 2 : 1;
    let i = list.length - 1;
    for (i; i > -1; --i) {

        const item = list[i];

        if (clear || !item.remove) {

            const posx = Math.floor(item.pos.x * RESOLUTION);
            const posy = Math.floor(item.pos.y * RESOLUTION);

            const sectorSize = Math.floor(item.radius * RESOLUTION) + sectorSizeModifier;

            const sectorsXY = getSectorIndexesAsFlatListsWrapped(grid3d, posx, posy, sectorSize);

            const xlist = sectorsXY[0];
            const ylist = sectorsXY[1];
            const len = xlist.length;
            for (let x = 0; x < len; x++) {
                for (let y = 0; y < len; y++) {
                    const sectorX = xlist[x];
                    const sectorY = ylist[y];

                    const sector = grid3d[sectorY][sectorX];
                    if (clear) {
                        const sectorLen = sector.length;
                        for (let s = 0; s < sectorLen; s++) {
                            sector.pop();
                        }
                    } else {
                        sector.push(item);
                    }
                }
            }
        }
    }
}

export const updateGrid3d = (grid3d: Imovable[][][]) => {
    const h = grid3d.length;
    const w = grid3d[0].length;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const sector = grid3d[y][x];

            let len = sector.length;
            for (let i = 0; i < len; i++) {
                const item = sector[i];
                if (item.remove) {
                    sector.splice(i, 1);
                    i--;
                    len--;

                } else {

                    const itemx = Math.floor(item.pos.x * RESOLUTION);
                    const itemy = Math.floor(item.pos.y * RESOLUTION);

                    if (itemx !== x || itemy !== y) {
                        sector.splice(i, 1);
                        i--;
                        len--;
                        const destinationSector = grid3d[itemy][itemx];
                        if (!destinationSector) {
                            debugger;
                        }
                        destinationSector.push(item);
                    }
                }
            }
        }
    }
}
/*
export const getSectorsAsFlatListWrapped = (grid3d: Imovable[][][], x: number, y: number) => {

    const res: Imovable[] = [];

    const maxX = grid3d[0].length - 1;
    const maxY = grid3d.length - 1;

    const coordsx = [x - 1 < 0 ? maxX : x - 1, x, x + 1 > maxX ? 0 : x + 1];
    const coordsy = [y - 1 < 0 ? maxY : y - 1, y, y + 1 > maxY ? 0 : y + 1];

    for (let yy = 0; yy < 3; yy++) {

        for (let xx = 0; xx < 3; xx++) {

            const coordx = coordsx[xx];
            const coordy = coordsy[yy];
            const sector = grid3d[coordy][coordx];

            const len = sector.length;
            for (let i = 0; i < len; i++) {
                res.push(sector[i]);
            }
        }
    }
    return res;
}*/

export const getSectorIndexesAsFlatListsWrapped = (grid3d: Imovable[][][], unsafe_x: number, unsafe_y: number, sectorSize: number = 1): number[][] => {
    const x = Math.floor(unsafe_x);
    const y = Math.floor(unsafe_y);
    const maxX = grid3d[0].length - 1;
    const maxY = grid3d.length - 1;

    let coordsx = [];
    let coordsy = [];

    const sectorOffsets = [];
    const sectorDimensions = sectorSize + sectorSize + 1;
    for (let i = 0; i < sectorDimensions; i++) {
        sectorOffsets.push(i - sectorSize);

        const _x = x - (i - sectorSize);
        const _y = y - (i - sectorSize);

        const wrappedX = _x < 0 ? maxX + 1 + _x : (_x > maxX ? _x - maxX : _x);
        const wrappedY = _y < 0 ? maxY + 1 + _y : (_y > maxY ? _y - maxY : _y);


        coordsx.push(wrappedX);
        coordsy.push(wrappedY);
    }
    return [coordsx, coordsy];
}

export const getSectorsAsFlatListWrapped = (grid3d: Imovable[][][], unsafe_x: number, unsafe_y: number, sectorSize: number = 1) => {

    const x = Math.floor(unsafe_x);
    const y = Math.floor(unsafe_y);

    const res = [];

    const maxX = grid3d[0].length - 1;
    const maxY = grid3d.length - 1;

    let coordsx = [];
    let coordsy = [];




    const sectorOffsets = [];
    const sectorDimensions = sectorSize + sectorSize + 1;
    for (let i = 0; i < sectorDimensions; i++) {
        sectorOffsets.push(i - sectorSize);

        const _x = x - (i - sectorSize);
        const _y = y - (i - sectorSize);

        const wrappedX = _x < 0 ? maxX + 1 + _x : (_x > maxX ? _x - maxX : _x);
        const wrappedY = _y < 0 ? maxY + 1 + _y : (_y > maxY ? _y - maxY : _y);


        coordsx.push(wrappedX);
        coordsy.push(wrappedY);
    }

    for (let yy = 0; yy < sectorDimensions; yy++) {
        for (let xx = 0; xx < sectorDimensions; xx++) {
            const coordx = coordsx[xx];
            const coordy = coordsy[yy];
            //try {
            if (!(sectorSize > 1 && coordy === y && coordx === x)) {
                const sector = grid3d[coordy][coordx];
                const len = sector.length;
                for (let i = 0; i < len; i++) {
                    res.push(sector[i]);
                }
            }
            /*} catch (e) {
                debugger;
            }*/
        }
    }

    return res;
}



export const getSectorsAsFlatList = (grid3d: Imovable[][][], x: number, y: number) => {
    const res: Imovable[] = [];

    const maxX = grid3d[0].length;
    const maxY = grid3d.length;
    const minY = 0;
    const minX = 0;

    const startX = Math.max(x - 1, minX);
    const startY = Math.max(y - 1, minY);
    const endX = Math.min(x + 2, maxX);
    const endY = Math.min(y + 2, maxY);

    //console.log(x,y,startY + '-' + endY, startX + '-' + endX);

    for (let yy = startY; yy < endY; yy++) {

        for (let xx = startX; xx < endX; xx++) {
            const sector = grid3d[yy][xx];
            const len = sector.length;
            for (let i = 0; i < len; i++) {
                res.push(sector[i]);
            }
        }
    }
    return res;
}

export default (list: Imovable[], WW: number, WH: number): Imovable[][][] => {
    const grid3d = createGrid3d(Math.ceil(WW * RESOLUTION), Math.ceil(WH * RESOLUTION));

    const len = list.length;
    for (let i = 0; i < len; i++) {
        const item = list[i];
        const x = Math.floor(item.pos.x * RESOLUTION);
        const y = Math.floor(item.pos.y * RESOLUTION);
        // try {
        grid3d[y][x].push(item);
        /*} catch (e) {
            console.error('itemcoords:', y, x);
            console.log('world', WW, WH, 'item', item.pos.x, item.pos.y);
            console.log('gridsize:', grid3d.length, grid3d[0].length);
            (window as any).grid = grid3d;
            (window as any).item = item;

            debugger;
            console.log(grid3d[y].length);
            console.log(grid3d[y][x]);

        }*/
    }
    return grid3d;
}

