#[macro_use]
extern crate serde_derive;

use std::fs;
use toml::{Table, Value};
use regex::{Regex, Captures};
use crate::MsgType::Uplink;

#[derive(Debug,Serialize)]
enum MsgType {
    Uplink,
    Downlink
}

#[derive(Debug,Serialize)]
struct Field {
    name : String,
    size : u8
}

#[derive(Debug,Serialize)]
struct Message {
    name : String,
    fields : Vec<Field>,
    msg_type : MsgType,
    fport : u8
}

macro_rules! panic_unexpected_type{
    ($a:expr)=>{
        {
            panic!("got {:?} but expected table", $a);
        }
    }
}

fn constructFields(table : Table) -> Vec<Field>{
    let mut fields = vec![];
    for (name, value) in table {
        println!("{:?}", name);
        println!("{:?}", value);
        match value {
            Value::Integer(x) => fields.push(Field { name, size: x as u8 }),
            _ => panic!("got {:?} but expected integer", value)
        }
    }
    return fields;
}

fn parseName(name : String) -> (MsgType, u8, String) {
    let re : Regex = Regex::new("(.*)-(.*)-(.*)").unwrap();

    let fields = re.captures(name.as_str()).unwrap();
    println!("fields {:?}", fields);

    let stype=fields.get(1).unwrap().as_str();
    let fport : u8 =fields.get(2).unwrap().as_str().parse().unwrap();
    let name=fields.get(3).unwrap().as_str().to_string();

    assert!(fport>0 && fport<224);
    assert!(name.len()>0);

    let msg_type = match stype {
        "uplink" => MsgType::Uplink,
        "downlink" => MsgType::Downlink,
        x => panic!("got '{}' but expected 'uplink' or 'downlink'", x)
    };


    (msg_type, fport, name)
}

fn constructMsg(key : String, value : Value) -> Message {
    println!("{:?}", key);
    println!("{:?}", value);

    if let Value::Table(table)=value {
        let (msg_type, fport, name) = parseName(key);
        Message{
            name,
            fields: constructFields(table),
            msg_type,
            fport,
        }
    }
    else {
        panic!("got {:?} but expected table", value)
    }
}

fn load_protocol() -> TemplateParameters {
    let file_contents = fs::read_to_string("input.toml").unwrap();
    let messageDefs : Table = file_contents.parse::<Table>().unwrap();

    let mut messages= vec![];
    for (key, value) in messageDefs {
        messages.push(constructMsg(key,value));
    }

    println!("msgList {:?}", messages);

    let context = TemplateParameters {
        name: "World".to_string(),
        messages
    };

    return context;
}

#[derive(Serialize)]
struct TemplateParameters {
    name: String,
    messages: Vec<Message>
}

fn execute_template(parameters: TemplateParameters) -> String {
    let file_contents = fs::read_to_string("template.js").unwrap();
    let template = liquid::ParserBuilder::with_stdlib()
        .build().unwrap()
        .parse(file_contents.as_str()).unwrap();

    let globals = liquid::to_object(&parameters).unwrap();

    let output = template.render(&globals).unwrap();


    println!("{}", output);
    return output;
}

fn main() {
    println!("Hello, world!");
    let parameters = load_protocol();
    execute_template(parameters);
}

