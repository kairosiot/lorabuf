//Generated Message Types 
// Message: DownlinkMessageName, Downlink, port 10, length 12 bytes
//    Fields:
//        one_bit_field (1 bits)
//        two_bit_field (2 bits)
//        eight_bit_field_with_value_override (8 bits, value=255)
//        one_byte_filed (8 bits)
//        two_byte_field (16 bits)
//        another_one_bit_field (1 bits)
//        one_byte_field_with_value_override (8 bits, value=171)
//        two_byte_field_with_value_override (16 bits, value=43981)
//        four_byte_field_with_value_override (32 bits, value=2882343202)
//        
//
// Message: DownlinkHardcodedPayload, Downlink, port 11, length 2 bytes
//    Fields:
//        command (8 bits, value=4)
//        data (8 bits, value=170)
//        
//
// Message: DownlinkPartialHardcodedPayload, Downlink, port 12, length 2 bytes
//    Fields:
//        command (8 bits, value=4)
//        data (8 bits)
//        
//
// Message: YetAnotherDownlink, Downlink, port 13, length 4 bytes
//    Fields:
//        twelveBit (12 bits)
//        value (13 bits)
//        
//
// Message: UplinkMessageName, Uplink, port 10, length 1 bytes
//    Fields:
//        some (1 bits)
//        field (1 bits)
//        name (2 bits)
//        goes (3 bits)
//        here (1 bits)
//        
//
// Message: SecondUplinkName, Uplink, port 11, length  bytes
//    Fields:
//        test (15 bits)
//        
//
// Message: ThirdUplinkName, Uplink, port 12, length  bytes
//    Fields:
//        test (16 bits)
//        
//
// Message: FourthUplinkName, Uplink, port 13, length 3 bytes
//    Fields:
//        test (17 bits)
//        
//

//verify fields were supplied
const V = (field_list, user_data, error_list) => {
    const keys = Object.keys(user_data);
    field_list
        .filter((f) => !keys.includes(f))
        .forEach((x) => error_list.push(`required field '${x}' was not supplied`));
    keys
        .filter((f) => !field_list.includes(f))
        .forEach((x) => error_list.push(`extra field '${x}' was supplied but not used`));
}

//read bits
function R(buffer, start, end) {
    let value=0;
    for(let i=start; i<end; i++) {
        value+=(((buffer[i>>3]>>(i%8))&1)<<(i-start));
        //console.log("read byte", i>>3, "mod8", i%8, "start", start, "value", value);
    }
    return value;
}

//write bits
function W(buffer, warnings, start, end, value) {
    if (value<0 || value>(2**(end-start)))
        warnings.push("value at bit "+start+" out of bounds. value="+value)

    for(let i=start; i<end; i++) {
        let bit=((value>>(i-start))&1)<<(i%8);
        buffer[i>>3]|=bit;
        //console.log("write bit", i, "byte", i>>3, "mod8", i%8, "value", bit);
    }
}

export function decodeUplink(input) {
    //console.log("decodeUplink", input);

    let o=null; //output field array
    let e=[]; //errors
    let b=input.bytes;
    let l=input.bytes.length;
    let p=input.fPort;
    if (false){} 
    else if (p==10 && l==1) {
        // Message: UplinkMessageName, Uplink, port 10, length 1 bytes
        o={ UplinkMessageName: {  some: R(b, 0, 1), field: R(b, 1, 2), name: R(b, 2, 4), goes: R(b, 4, 7), here: R(b, 7, 8), } }
    }
    else if (p==11) {
        // Message: SecondUplinkName, Uplink, port 11, length  bytes
        o={ SecondUplinkName: {  test: R(b, 0, 15), } }
    }
    else if (p==12) {
        // Message: ThirdUplinkName, Uplink, port 12, length  bytes
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


export function encodeDownlink(input) {
    //console.log("encodeDownlink", input);
    let p=input.fPort;
    let f=input.fields;

    //no error checking, missing fields will cause crash
    let b=null; //output byte array
    let w=[]; //warnings
    let e=[]; //errors
    if (false) {} 
    else if (p==10) {
        // Message: DownlinkMessageName, Downlink, port 10, length 12 bytes
        let l=["one_bit_field", "two_bit_field", "one_byte_filed", "two_byte_field", "another_one_bit_field", ];
        V(l, f, e);
        if (e.length==0) {
            b=[]
            W(b, w, 0, 1, f.one_bit_field); W(b, w, 1, 3, f.two_bit_field); W(b, w, 3, 11, 255); W(b, w, 11, 19, f.one_byte_filed); W(b, w, 19, 35, f.two_byte_field); W(b, w, 35, 36, f.another_one_bit_field); W(b, w, 36, 44, 171); W(b, w, 44, 60, 43981); W(b, w, 60, 92, 2882343202); 
        }
    }
    else if (p==11) {
        // Message: DownlinkHardcodedPayload, Downlink, port 11, length 2 bytes
        let l=[];
        V(l, f, e);
        if (e.length==0) {
            b=[]
            W(b, w, 0, 8, 4); W(b, w, 8, 16, 170); 
        }
    }
    else if (p==12) {
        // Message: DownlinkPartialHardcodedPayload, Downlink, port 12, length 2 bytes
        let l=["data", ];
        V(l, f, e);
        if (e.length==0) {
            b=[]
            W(b, w, 0, 8, 4); W(b, w, 8, 16, f.data); 
        }
    }
    else if (p==13) {
        // Message: YetAnotherDownlink, Downlink, port 13, length 4 bytes
        let l=["twelveBit", "value", ];
        V(l, f, e);
        if (e.length==0) {
            b=[]
            W(b, w, 0, 12, f.twelveBit); W(b, w, 12, 25, f.value); 
        }
    }
    else {
        e=["bad port"]
    }

    let output={
        fPort: p,
        bytes: b,
        errors: e,
        warnings: w
    };

    return output;
}

export function decodeDownlink(input) {
    //console.log("decodeDownlink", input);

    let o=null; //output field array
    let e=[]; //errors
    let b=input.bytes;
    let l=input.bytes.length;
    let p=input.fPort;
    if (false){} 
    else if (p==10 && l==12) {
        // Message: DownlinkMessageName, Downlink, port 10, length 12 bytes
        o={ DownlinkMessageName: {  one_bit_field: R(b, 0, 1), two_bit_field: R(b, 1, 3), eight_bit_field_with_value_override: R(b, 3, 11), one_byte_filed: R(b, 11, 19), two_byte_field: R(b, 19, 35), another_one_bit_field: R(b, 35, 36), one_byte_field_with_value_override: R(b, 36, 44), two_byte_field_with_value_override: R(b, 44, 60), four_byte_field_with_value_override: R(b, 60, 92), } }
    }
    else if (p==11 && l==2) {
        // Message: DownlinkHardcodedPayload, Downlink, port 11, length 2 bytes
        o={ DownlinkHardcodedPayload: {  command: R(b, 0, 8), data: R(b, 8, 16), } }
    }
    else if (p==12 && l==2) {
        // Message: DownlinkPartialHardcodedPayload, Downlink, port 12, length 2 bytes
        o={ DownlinkPartialHardcodedPayload: {  command: R(b, 0, 8), data: R(b, 8, 16), } }
    }
    else if (p==13 && l==4) {
        // Message: YetAnotherDownlink, Downlink, port 13, length 4 bytes
        o={ YetAnotherDownlink: {  twelveBit: R(b, 0, 12), value: R(b, 12, 25), } }
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