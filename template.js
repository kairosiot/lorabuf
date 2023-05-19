//Generated Message Types {% for msg in messages %}
// Message: {{ msg.name }}, {{ msg.msg_type }}, port {{ msg.fport }}
//    Fields:
//        {% for field in msg.fields %}{{ field.name }} ({{ field.size }} bits)
//        {% endfor %}
//{% endfor %}

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

static TEMPLATE : &'static str = "Hello {name}!";
function decodeUplink(input) {
    console.log("decodeUplink", input);

    let o=null;
    let e=[];
    let b=input.bytes;
    let l=input.bytes.length;
    let p=input.fport;
    if (p==10 && l==3) {
        o={ field1: R(b,0,8), field2: R(b,8,16), field2: R(b,16,24)};
    }
    else if (p==11 && l==4) {
        o={ field1: R(b,0,16), field2: R(b,16,32)};
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
    if (p==10) {
        l=["field1", "field2"]
        V(l, f, e);
        W(b, i, 0, 8, f.field1); W(b, i, 8, 16, f.field2);
    }
    else if (p==11 ) {
        l=["field3", "field4"]
        V(l, f, e);
        W(b, i, 0, 3, f.field3); W(b, i, 4, 16, f.field4);
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
    if (p==10 && l==3) {
        o={ field1: R(b,0,8), field2: R(b,8,16), field2: R(b,16,24)};
    }
    else if (p==11 && l==4) {
        o={ field1: R(b,0,16), field2: R(b,16,32)};
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

//===========================================================

const uplinkParams = {
    bytes: [1, 2, 3],
    fport: 10,
    recvTime: Date.now()
};
console.log(decodeUplink(uplinkParams));

const uplinkParams1 = {
    bytes: [1, 2, 3, 4],
    fport: 11,
    recvTime: Date.now()
};
console.log(decodeUplink(uplinkParams1));


const downParam={
    fport: 10,
    fields: { field1: 123, field2: 345 }
};
console.log( encodeDownlink(downParam));

flist=["field1", "f3"]
obj={field1: 1, f2: 3}
elist=[]
V(flist, obj, elist);
console.log( elist);


