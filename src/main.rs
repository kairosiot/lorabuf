#[macro_use]
extern crate serde_derive;

use std::arch::x86_64::_mm_loadl_epi64;
use std::env;
use std::fs;
use std::path::Path;
//use std::process::id;
use configparser::ini::Ini;
use indexmap::IndexMap;
//use liquid::model::Path;
use regex::{Regex};
use crate::MsgType::{Downlink, Uplink};

#[derive(Debug)]
struct Config {
    message : String,
    template : String,
    output : String
}

fn load_config() -> Result<Config, String> {
    let args : Vec<String> =env::args().collect();
    println!("{:?}", args);
    if args.len()!=4 {
        return Err("Please provide three arguments message-def-filename, template-filename and output-filename".to_string());
    }

    let message= args[1].clone();
    let template= args[2].clone();
    let output= args[3].clone();

    Ok(Config{
        message,
        template,
        output
    })
}

#[derive(Debug,Serialize,PartialEq,Clone)]
enum MsgType {
    Uplink,
    Downlink
}

#[derive(Debug,Serialize,Clone)]
struct Field {
    name : String,
    typename : String,
    size : u8,
    start_index : u16,
    end_index : u16,
}

#[derive(Debug,Serialize,Clone)]
struct Message {
    name : String,
    fields : Vec<Field>,
    msg_type : MsgType,
    fport : u8,
    length : u8
}

fn parseFieldName(name : String) -> (String, String, u8) {
    let re : Regex = Regex::new("([a-z]+)([0-9]+) (.+)").unwrap();
    let fields = re.captures(name.as_str()).unwrap();
    let typename=fields.get(1).unwrap().as_str().to_string();
    let typesize : u8 =fields.get(2).unwrap().as_str().parse().unwrap();
    let name=fields.get(3).unwrap().as_str().to_string();

    assert_eq!(typename, "u");

    (name, typename, typesize)
}

fn constructFields(section_map : IndexMap<String, Option<String>>) -> Vec<Field>{
    let mut fields = vec![];
    for (name, value) in section_map {
        let (name, typename, size)=parseFieldName(name);
        fields.push(Field { name, size, typename, start_index: 0, end_index: 0 });
    }
    return fields;
}

fn parseMessageSectionName(name : String) -> (MsgType, u8, String) {
    let re : Regex = Regex::new("(.*) (.*) (.*)").unwrap();

    let fields = re.captures(name.as_str()).unwrap();
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

fn constructMsg(section_name : String, section_map : IndexMap<String, Option<String>>) -> Message {
    let (msg_type, fport, name) = parseMessageSectionName(section_name);

    let mut fields = constructFields(section_map);
    let mut length = 0;
    for f in fields.as_mut_slice() {
        f.start_index=length;
        length+=f.size as u16;
        f.end_index=length;
    }
    length=(length+7)/8;

    Message{
        name,
        fields,
        msg_type,
        fport,
        length: length as u8
    }
}

fn load_protocol(config: &Config) -> TemplateParameters {
    let mut ini_file = Ini::new_cs();
    let path = Path::new(&config.message);
    let message_defs = ini_file.load(path).unwrap();

    let mut messages= vec![];
    for (section_name, section_map) in message_defs {
        messages.push(constructMsg(section_name,section_map));
    }

    let all_messages = messages.clone();
    let uplinks = messages.clone().into_iter().filter(|m| m.msg_type == Uplink).collect();
    let downlinks = messages.clone().into_iter().filter(|m| m.msg_type == Downlink).collect();

    let context = TemplateParameters {
        name: "World".to_string(),
        all_messages,
        uplinks,
        downlinks,
    };

    return context;
}

#[derive(Serialize)]
struct TemplateParameters {
    name: String,
    all_messages: Vec<Message>,
    downlinks: Vec<Message>,
    uplinks: Vec<Message>
}

fn execute_template(config : &Config, parameters: TemplateParameters) -> String {
    let file_contents = fs::read_to_string(&config.template).unwrap();
    let template = liquid::ParserBuilder::with_stdlib()
        .build().unwrap()
        .parse(file_contents.as_str()).unwrap();

    let globals = liquid::to_object(&parameters).unwrap();
    let output = template.render(&globals).unwrap();

    println!("{}", output);
    return output;
}

fn write_output(config : &Config, text : String) {
    let path=Path::new(&config.output);
    fs::write(path, text).expect("write failed");
}

fn main() {
    println!("Info: this program cannot detect duplicated field or message names. Use with care.");
    println!("==========");

    let config_res = load_config();

    if let Err(x)=config_res {
        println!("Error: {}", x);
        return;
    }

    let config=config_res.unwrap();
    let parameters = load_protocol(&config);
    let text=execute_template(&config, parameters);
    write_output(&config, text);
}

