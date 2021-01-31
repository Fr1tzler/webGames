const checkedTile = "c";
const uncheckedTile = "u";
const borderTile = "b";
const emptyTile = "e";

function generateField(sideLength) {
    field = [];
    field = setCheckedTiles(field);
    field = setNumbersOnUnchecked(field);
    field = setNumbersOnChecked(field);
    return field;
}

function generateEmptyField(sideLength) {
    let fieldSideLength = sideLength * 2 - 1;
    let field = []
    for (let y = 0; y < fieldSideLength; y++) {
        field.push([]);
        for (let x = 0; x < fieldSideLength; x++) {
            field[i].push(emptyTile);
        }
    }
    return field;
}

function setCheckedTiles(field) {
    return field;
}

function setNumbersOnUnchecked(field) {
    return field;
}

function setNumbersOnChecked(field) {
    return field;
}