
// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const log = require('../../util/log');

const menuIconURI = null;
const blockIconURI = null;

class testExt{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('testExt', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'diTextRecognition',
      name: 'Test',
      color1: '#f5a623',
      color2: '#235a4a',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'a',
          blockType: BlockType.COMMAND,
          arguments: {
            TXT: {
              type: ArgumentType.STRING
            },
            X: {
              type: ArgumentType.STRING
            },
            boolean: {
              type: ArgumentType.BOOLEAN
            }
          },
          text: 'block name label text [TXT] [X] [boolean]'
        },
        {
          opcode: 'b',
          blockType: BlockType.REPORTER,
          arguments: {
            TXT: {
              type: ArgumentType.STRING
            },
            X: {
              type: ArgumentType.STRING
            },
            boolean: {
              type: ArgumentType.BOOLEAN
            }
          },
          text: 'block name label text [TXT] [X] [boolean]'
        },
        {
          opcode: 'c',
          blockType: BlockType.BOOLEAN,
          text: 'block name'
        },
        {
          opcode: 'd',
          blockType: BlockType.HAT,
          isEdgeActivated: false,
          text: 'block name'
        }
      ]
    }
  }

a (args, util){
  const TXT = args.TXT;
  const X = args.X;
  const boolean = args.boolean;

  return this.write(`M0 \n`);
}

b (args, util){
  const TXT = args.TXT;
  const X = args.X;
  const boolean = args.boolean;

  return this.write(`M0 \n`);
}

c (args, util){

  return this.write(`M0 \n`);
}

d (args, util){

  return this.write(`M0 \n`);
}

}

module.exports = testExt;
