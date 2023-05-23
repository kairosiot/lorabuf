//Generated Message Types 
// Message: UplinkMessageName, Uplink, port 10, length 3 bytes
//    Fields:
//        some_one_bit_field (1 bits)
//        some_two_bit_field (2 bits)
//        some_eight_bit_field (8 bits)
//        field (1 bits)
//        names (2 bits)
//        go (3 bits)
//        after (1 bits)
//        type_and_size (1 bits)
//        
//
// Message: SecondUplinkName, Uplink, port 11, length 2 bytes
//    Fields:
//        test (15 bits)
//        
//
// Message: ThirdUplinkName, Uplink, port 12, length 2 bytes
//    Fields:
//        test (16 bits)
//        
//
// Message: FourthUplinkName, Uplink, port 13, length 3 bytes
//    Fields:
//        test (17 bits)
//        
//
// Message: DownlinkMessageName, Downlink, port 10, length 1 bytes
//    Fields:
//        some (1 bits)
//        field (1 bits)
//        name (2 bits)
//        goes (3 bits)
//        here (1 bits)
//        
//
// Message: AnotherDownlink, Downlink, port 11, length 4 bytes
//    Fields:
//        twelveBit (12 bits)
//        value (13 bits)
//        
//

const V = (field_list, user_data, error_list) => {
    const keys = Object.keys(user_data);
    field_list
        .filter((f) => !keys.includes(f))
        .forEach((x) => error_list.push(`required field ${x} was not supplied`));
    keys
        .filter((f) => !field_list.includes(f))
        .forEach((x) => error_list.push(`extra field ${x} was supplied but not used`));
}

//read bits
function R(buffer, start, end) {
    let value=0;
    for(let i=start; i<end; i++) {
        value+=(((buffer[i>>3]>>(i%8))&1)<<(i-start));
        //console.log("read", i>>3, i%8, start, value);
    }
    return value;
}

//write bits
function W(buffer, warnings, start, end, value) {
    if (value<0 || value>(2**(end-start-1)))
        warnings.push("value at bit "+start+" out of bounds")

    for(let i=start; i<end; i++) {
        let bit=((value>>(i-start))&1)<<(i%8);
        buffer[i>>3]|=bit;
        console.log("write", i, i>>3, i%8, bit);
    }
}

function decodeUplink(input) {
    console.log("decodeUplink", input);

    let o=null;
    let e=[];
    let b=input.bytes;
    let l=input.bytes.length;
    let p=input.fport;
    if (false){} 
    else if (p==10 && l==3) {
        // Message: UplinkMessageName, Uplink, port 10, length 3 bytes
        o={ UplinkMessageName: {  some_one_bit_field: R(b, 0, 1), some_two_bit_field: R(b, 1, 3), some_eight_bit_field: R(b, 3, 11), field: R(b, 11, 12), names: R(b, 12, 14), go: R(b, 14, 17), after: R(b, 17, 18), type_and_size: R(b, 18, 19), } }
    }
    else if (p==11 && l==2) {
        // Message: SecondUplinkName, Uplink, port 11, length 2 bytes
        o={ SecondUplinkName: {  test: R(b, 0, 15), } }
    }
    else if (p==12 && l==2) {
        // Message: ThirdUplinkName, Uplink, port 12, length 2 bytes
        o={ ThirdUplinkName: {  test: R(b, 0, 16), } }
    }
    else if (p==13 && l==3) {
        // Message: FourthUplinkName, Uplink, port 13, length 3 bytes
        o={ FourthUplinkName: {  test: R(b, 0, 17), } }
    }
    else {
        e=["bad port or length"]
    }

    let output = {
        data: o,
        errors: e,
        warnings: []
    }
    return output;
}

function encodeDownlink(input) {
    console.log("encodeDownlink", input);
    let p=input.fport;
    let f=input.fields;

    //no error checking, missing fields will cause crash
    let b=[];
    let i=[];
    let e=[];
    if (false) {} 
    else if (p==10) {
        // Message: DownlinkMessageName, Downlink, port 10, length 1 bytes
        l=["some", "field", "name", "goes", "here", ]
        V(l, f, e);
        W(b, i, 0, 1, f.some); W(b, i, 1, 2, f.field); W(b, i, 2, 4, f.name); W(b, i, 4, 7, f.goes); W(b, i, 7, 8, f.here); 
    }
    else if (p==11) {
        // Message: AnotherDownlink, Downlink, port 11, length 4 bytes
        l=["twelveBit", "value", ]
        V(l, f, e);
        W(b, i, 0, 12, f.twelveBit); W(b, i, 12, 25, f.value); 
    }
    else {
        e=["bad port"]
    }

    let output={
        fPort: p,
        bytes: b,
        errors: e,
        warnings: i
    };

    return output;
}

function decodeDownlink(input) {
    console.log("decodeDownlink", input);

    let o=null;
    let e=[];
    let b=input.bytes;
    let l=input.bytes.length;
    let p=input.fport;
    if (false){} 
    else if (p==10 && l==1) {
        // Message: DownlinkMessageName, Downlink, port 10, length 1 bytes
        o={ DownlinkMessageName: {  some: R(b, 0, 1), field: R(b, 1, 2), name: R(b, 2, 4), goes: R(b, 4, 7), here: R(b, 7, 8), } }
    }
    else if (p==11 && l==4) {
        // Message: AnotherDownlink, Downlink, port 11, length 4 bytes
        o={ AnotherDownlink: {  twelveBit: R(b, 0, 12), value: R(b, 12, 25), } }
    }
    else {
        e=["bad port or length"]
    }

    let output = {
        data: o,
        errors: e,
        warnings: []
    }
    return output;
}