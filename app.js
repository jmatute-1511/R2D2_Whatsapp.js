const clc = require('cli-color');
const { Client } = require('whatsapp-web.js');
const ora = require('ora');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const readlyneSync = require('readline-sync');

class r2d2 {

    constructor(){
        this.loadspinner = ora(clc.yellow('Conectando a whatsapp...')).start();
        this.sessionpath = './session.json';
        this.sessionData;
        this.client;
        this.contacts;
    }

    async init () {

        if (fs.existsSync(this.sessionpath)){
            this.sessionData = require(this.sessionpath);
            this.client = new Client({
                session:this.sessionData
            })

            this.client.on('ready',  () =>{
                console.log(clc.green('Session has initialized'));
                this.loadspinner.stop();
                this.listenmessage();   
            })
            this.client.initialize();
        }
        else{
            this.client = new Client();
            this.client.on('qr', qr =>{
                qrcode.generate(qr,{small:true});
            });
            this.client.on('authenticated', session =>{
                this.sessionData = session;
                fs.writeFile(this.sessionpath, JSON.stringify(session), err =>{
                    if (err){
                        console.log('error')
                    }
                    else{
                        console.log(clc.green('Session has initialized sucessfully'));
                    }
                })
                this.loadspinner.stop();
            })
        }
            this.client.initialize();
    }

    async listenmessage() {
        this.client.on('message', async msg =>{
            this.contacts = await msg.getContact();
            console.log(clc.cyan(this.contacts.name), msg.from, msg.body);
            await this.sendmsg(msg.from); 
        })
    } 
    async sendmsg (from) {
            let answer = readlyneSync.question(clc.bgCyanBright('Escriba una mensaje')); 
            this.client.sendMessage(from,answer);
    }
}
const Clietnr2d2 = new r2d2();
Clietnr2d2.init();