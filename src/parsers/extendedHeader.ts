
const extendedHeaderParser = cStruct({
    id: cArray(uint8, 6), //6-byte ID = MAC
    ver: uint8,
    type_name: cString(64),
    name: cString(64),
    description: cString(128),
});
