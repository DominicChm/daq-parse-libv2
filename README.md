# Format

## Header

Contains information about modules contained in the data stream. Simplified for ease of transmission. Presumes that IDs
are pre-shared and pre-allocated to a given module type.

HEADER: `<0xAA> <LEN> <LEN> <N x Module Blocks> <CHECKSUM>`

MODULE BLOCK: `<ID> <ID> <TYPE_VER>`

## Extended Header

Contains extra information about modules that might be useful to parse data in the future. Usually only used to head a
file.

EXTENDED HEADER: `<0xBB> <LEN> <LEN> <N x Extended Module Blocks> <CHECKSUM>`

EXTENDED MODULE
BLOCK: `<ID> <ID> <TYPE_VER> <MOD_TYPE (cstring, 64 bytes)> <MOD_NAME (cstring, 64 bytes)> <MOD_DESC (cstring, 128 bytes)>`

## Regular Data

`<0x69> <DATA_CTYPE> <CHECKSUM>`

# Process

Decoder: Daqschema (ID -> Type pairs)
Construct CType from header Parse data...

